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
use App\Models\Course;
use App\Models\Faculty;
use App\Models\Role;
use App\Models\SchoolClass;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
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
            $data = collect($request->validated())->except(['role'])->toArray();
            $data['password'] = Hash::make($request->password);
            $data['role_id'] = Role::ROLES[$request->role];
            if ($request->role == 'student') {
                $exists_class = SchoolClass::where('id', $request->school_class_id)->exists();
                if ($exists_class == false) return Reply::error('app.errors.classNotRxists', [
                    'id' => $request->school_class_id
                ]);
            } else if ($request->role == 'teacher') {
                $exists_faculty = Faculty::where('id', $request->faculty_id)->exists();
                if ($exists_faculty == false) return Reply::error('app.errors.faucltyNotRxists', [
                    'id' => $request->faculty_id
                ]);
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

    public function show(Request $request, string $id)
    {
        $user = $this->getUser();
        if (!$user->isAdmin() && !$user->isTeacher() && $id != $user->id) return Reply::error('permission.errors.403');

        $now = now();
        $data = (object)[];
        try {
            $data->user = User::with('role')->find($id);
            if ($data->user == null) return Reply::successWithData($data, '');
            # Get course
            switch ($data->user->role_id) {
                case Role::ROLES['student']:
                    $data->courses = Course::whereHas('semester', function ($query) use ($now) {
                        $query->whereDate('start_date', '<=', $now)
                            ->whereDate('end_date', '>=', $now);
                    })->whereHas('enrollments', function ($query) use ($id) {
                        $query->where('student_id', '=', $id);
                    });
                    break;
                case Role::ROLES['teacher']:
                    $data->courses = Course::whereHas('semester', function ($query) use ($now) {
                        $query->whereDate('start_date', '<=', $now)
                            ->whereDate('end_date', '>=', $now);
                    })->where('teacher_id', '=', $data->user->id);
                    break;
                default:
                    $data->courses = [];
                    break;
            }
            return Reply::successWithData($data, '');
        } catch (\Throwable $error) {
            Log::error($error->getMessage());
            if ($this->isDevelopment) return Reply::error($error->getMessage());
            return Reply::error('app.errors.serverError', [], 500);
        }
    }

    public function update(UpdateRequest $request, string $id)
    {
        $user = $this->getUser();
        if (!$user->isAdmin()) return Reply::error('permission.errors.403');

        DB::beginTransaction();
        try {
            $targetUser = User::with('role')->findOrFail($id);
            $data = collect($request->validated())->except(['password'])->toArray();
            if ($user->id == $id) $data['is_active'] = 1;
            if ($request->password != null) $data['password'] = Hash::make($request->password);
            if ($targetUser->role_id == Role::ROLES['student']) {
                $exists_class = SchoolClass::where('id', $request->school_class_id)->exists();
                if ($exists_class == false) return Reply::error('app.errors.classNotRxists', [
                    'id' => $request->school_class_id
                ]);
            } else if ($targetUser->role_id == Role::ROLES['teacher']) {
                $exists_faculty = Faculty::where('id', $request->faculty_id)->exists();
                if ($exists_faculty == false) return Reply::error('app.errors.faucltyNotRxists', [
                    'id' => $request->faculty_id
                ]);
            }
            $targetUser->update($data);
            DB::commit();
            if ($data['is_active'] == 0) $targetUser->tokens()->delete();
            return Reply::successWithMessage('app.successes.recordSaveSuccess');
        } catch (\Throwable $error) {
            Log::error($error->getMessage());
            DB::rollBack();
            if ($this->isDevelopment) return Reply::error($error->getMessage());
            return Reply::error('app.errors.serverError', [], 500);
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
            return Reply::error('app.errors.serverError', [], 500);
        }
    }

    public function getUserByType(GetByTypeRequest $request)
    {
        $user = $this->getUser();
        if (!$user->isAdmin() && !$user->isTeacher()) return Reply::error('permission.errors.403');

        try {
            $users = User::with('role')
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
            foreach ($sheets[0] as $index => $row) {
                if ($index == 0) continue;
                $record = [
                    'role_id' => $role_id,
                    'shortcode' => $row[1],
                    'first_name' => $row[3],
                    'last_name' => $row[2],
                    'gender' => $row[4],
                    'email' => $row[5],
                    'phone_number' => $row[6],
                    'address' => $row[7],
                    'birth_date' => Carbon::instance(Date::excelToDateTimeObject($row[8])),
                    'is_active' => true,
                    'password' => Hash::make($row[9])
                ];
                if ($request->role == 'student') {
                    $exists_class = SchoolClass::where('id', $row[0])->exists();
                    if ($exists_class == false) return Reply::error('app.errors.classNotRxists', [
                        'id' => $row[0]
                    ]);
                    $record['school_class_id'] = $row[0];
                } else if ($request->role == 'teacher') {
                    $exists_faculty = Faculty::where('id', $row[0])->exists();
                    if ($exists_faculty == false) return Reply::error('app.errors.faucltyNotRxists', [
                        'id' => $row[0]
                    ]);
                    $record['faculty_id'] = $row[0];
                }
                $data[] = $record;
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
            return Reply::error('app.errors.serverError');
        }
    }
}
