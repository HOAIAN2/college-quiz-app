<?php

namespace App\Http\Controllers\Api;

use App\Exports\UsersExport;
use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\DeleteRequest;
use App\Http\Requests\User\ExportRequest;
use App\Http\Requests\User\GetByTypeRequest;
use App\Http\Requests\User\ImportRequest;
use App\Http\Requests\User\StoreRequest;
use App\Http\Requests\User\UpdateRequest;
use App\Models\Faculty;
use App\Models\Role;
use App\Models\SchoolClass;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Maatwebsite\Excel\Facades\Excel;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class UserController extends Controller
{
    public function index()
    {
        $user = $this->getUser()->load(['role']);
        return Reply::successWithData($user, '');
    }

    public function store(StoreRequest $request)
    {
        $user = $this->getUser();
        if (!$user->isAdmin()) return Reply::error('permission.errors.403');

        DB::beginTransaction();
        try {
            $school_class = $request->school_class;
            $faculty = $request->faculty;
            $data = collect($request->validated())->except(['role', 'school_class', 'faculty'])->toArray();

            $data['password'] = Hash::make($request->password);
            $data['role_id'] = Role::ROLES[$request->role];
            if ($request->role == 'student') {
                $school_class_id = SchoolClass::where('shortcode', $school_class)->pluck('id')->first();
                if ($school_class_id == null) return Reply::error('app.errors.classNotExists', [
                    'shortcodes' => $school_class
                ]);
                $data['school_class_id'] = $school_class_id;
            }

            if ($request->role == 'teacher') {
                $faculty_id = Faculty::where('shortcode', $faculty)->pluck('id')->first();
                if ($faculty_id == false) return Reply::error('app.errors.faucltyNotExists', [
                    'shortcodes' => $faculty
                ]);
                $data['faculty'] = $faculty_id;
            }
            User::create($data);
            DB::commit();
            return Reply::successWithMessage('app.successes.recordSaveSuccess');
        } catch (\Throwable $error) {
            Log::error($error->getMessage());
            DB::rollBack();
            if ($this->isDevelopment) return Reply::error($error->getMessage());
            return Reply::error('app.errors.failToSaveRecord');
        }
    }

    public function show(string $id)
    {
        $user = $this->getUser();
        if (!$user->isAdmin() && !$user->isTeacher() && $id != $user->id) return Reply::error('permission.errors.403');

        try {
            $data = User::with(['role', 'school_class', 'faculty'])->find($id);
            return Reply::successWithData($data, '');
        } catch (\Throwable $error) {
            Log::error($error->getMessage());
            if ($this->isDevelopment) return Reply::error($error->getMessage());
            return Reply::error('app.errors.somethingWentWrong', [], 500);
        }
    }

    public function update(UpdateRequest $request, string $id)
    {
        $user = $this->getUser();
        if (!$user->isAdmin()) return Reply::error('permission.errors.403');

        DB::beginTransaction();
        try {
            $targetUser = User::with('role')->findOrFail($id);

            $school_class = $request->school_class;
            $faculty = $request->faculty;
            $data = collect($request->validated())->except(['password', 'school_class', 'faculty'])->toArray();

            if ($user->id == $id) $data['is_active'] = 1;
            if ($request->password != null) $data['password'] = Hash::make($request->password);

            if ($targetUser->role_id == Role::ROLES['student']) {
                $school_class_id = SchoolClass::where('shortcode', $school_class)->pluck('id')->first();
                if ($school_class_id == null) return Reply::error('app.errors.classNotExists', [
                    'shortcodes' => $school_class
                ]);
                $data['school_class_id'] = $school_class_id;
            }

            if ($targetUser->role_id == Role::ROLES['teacher']) {
                $faculty_id = Faculty::where('shortcode', $faculty)->pluck('id')->first();
                if ($faculty_id == false) return Reply::error('app.errors.faucltyNotExists', [
                    'shortcodes' => $faculty
                ]);
                $data['faculty_id'] = $faculty_id;
            }
            $targetUser->update($data);
            DB::commit();
            if ($data['is_active'] == 0) $targetUser->tokens()->delete();
            return Reply::successWithMessage('app.successes.recordSaveSuccess');
        } catch (\Throwable $error) {
            Log::error($error->getMessage());
            DB::rollBack();
            if ($this->isDevelopment) return Reply::error($error->getMessage());
            return Reply::error('app.errors.somethingWentWrong', [], 500);
        }
    }

    public function destroy(DeleteRequest $request)
    {
        $user = $this->getUser();
        if (!$user->isAdmin()) return Reply::error('permission.errors.403');

        DB::beginTransaction();
        try {
            User::destroy($request->ids);
            DB::commit();
            return Reply::successWithMessage('app.successes.recordDeleteSuccess');
        } catch (\Throwable $error) {
            Log::error($error->getMessage());
            DB::rollBack();
            if ($this->isDevelopment) return Reply::error($error->getMessage());
            return Reply::error('app.errors.somethingWentWrong', [], 500);
        }
    }

    public function getUserByType(GetByTypeRequest $request)
    {
        $user = $this->getUser();
        if (!$user->isAdmin() && !$user->isTeacher()) return Reply::error('permission.errors.403');

        try {
            $users = User::with(['role', 'school_class', 'faculty'])
                ->whereRoleId(Role::ROLES[$request->role]);
            if ($request->search != null) {
                $users = $users->search($request->search);
            }

            $users = $users->latest('id')->paginate($request->per_page);
            return Reply::successWithData($users, '');
        } catch (\Throwable $error) {
            Log::error($error->getMessage());
            if ($this->isDevelopment) return Reply::error($error->getMessage());
            return Reply::error('app.errors.failToSaveRecord');
        }
    }

    public function importUsers(ImportRequest $request)
    {
        $user = $this->getUser();
        if (!$user->isAdmin()) return Reply::error('permission.errors.403');

        DB::beginTransaction();
        try {
            $file = $request->file('file');
            $role_id = Role::ROLES[$request->role];
            $sheets = Excel::toArray([], $file);
            $data = [];
            $non_exists_classes = [];
            $non_exists_faculties = [];
            foreach ($sheets[0] as $index => $row) {
                if ($index == 0) continue;
                $record = [
                    'role' => $request->role,
                    'shortcode' => $row[1],
                    'first_name' => $row[3],
                    'last_name' => $row[2],
                    'gender' => $row[4],
                    'email' => $row[5],
                    'phone_number' => $row[6],
                    'address' => $row[7],
                    'birth_date' => Carbon::instance(Date::excelToDateTimeObject($row[8])),
                    'is_active' => true,
                    'password' => $row[9]
                ];

                $validated_result = $this->validateUserArray($record);
                if ($validated_result['is_valid'] == false) {
                    return Reply::error($validated_result['data']->getMessage());
                }
                $validated_record = $validated_result['data'];

                if ($request->role == 'student') {
                    $school_class_id = SchoolClass::where('shortcode', $row[0])->pluck('id')->first();
                    $record['school_class_id'] = $school_class_id;
                    if ($school_class_id == null) $non_exists_classes[] = $row[0];
                }

                if ($request->role == 'teacher') {
                    $faculty_id = Faculty::where('shortcode', $row[0])->pluck('id')->first();
                    $record['faculty_id'] = $faculty_id;
                    if ($faculty_id == null) $non_exists_faculties[] = $row[0];
                }

                $validated_record = collect($validated_record)->except(['role'])->toArray();
                $validated_record['password'] = Hash::make($request->password);
                $validated_record['role_id'] = $role_id;

                $data[] = $validated_record;
            }
            if (count($non_exists_classes) != 0) {
                return Reply::error('app.errors.classNotExists', [
                    'shortcodes' => implode(', ', $non_exists_classes)
                ]);
            }
            if (count($non_exists_faculties) != 0) {
                return Reply::error('app.errors.facultyNotExists', [
                    'shortcodes' => implode(', ', $non_exists_faculties)
                ]);
            }

            foreach ($data as $row) {
                User::create($row);
            }
            DB::commit();
            return Reply::successWithMessage('app.successes.recordSaveSuccess');
        } catch (\Throwable $error) {
            Log::error($error->getMessage());
            DB::rollBack();
            if ($this->isDevelopment) return Reply::error($error->getMessage());
            return Reply::error('app.errors.failToSaveRecord');
        }
    }

    public function exportUsers(ExportRequest $request)
    {
        $user = $this->getUser();
        if (!$user->isAdmin()) return Reply::error('permission.errors.403');
        $data = $request->validated();
        $file_name = "Export_{$data['role']}_" . Carbon::now()->format(User::DATE_FORMAT) . '.xlsx';

        try {
            $query = User::whereRoleId(Role::ROLES[$data['role']]);
            $columns = collect($data['fields'])->except((new User())->getHidden())->toArray();
            $headers = array_map(function ($value) {
                return trans('headers.users.' . $value);
            }, $columns);
            $query = $query->select($columns);
            $collection = $query->get();
            return Excel::download(new UsersExport($collection, $headers), $file_name);
        } catch (\Throwable $error) {
            Log::error($error->getMessage());
            DB::rollBack();
            if ($this->isDevelopment) return Reply::error($error->getMessage());
            return Reply::error('app.errors.somethingWentWrong');
        }
    }

    public function validateUserArray($record)
    {
        $store_request = new StoreRequest();
        $rules = collect($store_request->rules())->except(['school_class', 'faculty'])->toArray();
        $validator = Validator::make($record, $rules);

        if ($validator->fails()) {
            return [
                'is_valid' => false,
                'data' => ValidationException::withMessages($validator->errors()->toArray())
            ];
        }
        return [
            'is_valid' => true,
            'data' => $validator->validated()
        ];
    }
}
