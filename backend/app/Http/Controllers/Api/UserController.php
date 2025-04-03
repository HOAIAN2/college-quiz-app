<?php

namespace App\Http\Controllers\Api;

use App\Enums\PermissionType;
use App\Enums\RoleType;
use App\Exports\UsersExport;
use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Http\Requests\DeleteRequest;
use App\Http\Requests\User\AutoCompleteRequest;
use App\Http\Requests\User\ExportableRequest;
use App\Http\Requests\User\ExportRequest;
use App\Http\Requests\User\ImportRequest;
use App\Http\Requests\User\PaginateRequest;
use App\Http\Requests\User\SearchRequest;
use App\Http\Requests\User\StoreRequest;
use App\Http\Requests\User\UpdateRequest;
use App\Models\Faculty;
use App\Models\SchoolClass;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Maatwebsite\Excel\Facades\Excel;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class UserController extends Controller
{
    public function index()
    {
        $data = (object)[];
        $data->user = $this->getUser()->load(['role', 'school_class', 'faculty']);
        try {
            $data->permissions = $data->user->role->permissions()->pluck('name');
            return Reply::successWithData($data, '');
        } catch (\Exception $error) {
            return $this->handleException($error);
        }
    }

    public function store(StoreRequest $request)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission(PermissionType::USER_CREATE), 403);
        $validated = $request->validated();
        DB::beginTransaction();

        try {
            $data = collect($validated)->except(['role', 'school_class_id', 'faculty_id'])->toArray();

            $data['password'] = Hash::make($validated['password']);
            $data['role_id'] = RoleType::valueFromName($validated['role']);
            if ($validated['role'] == 'student') {
                $data['school_class_id'] = $validated['school_class_id'];
            }

            if ($validated['role'] == 'teacher') {
                $data['faculty_id'] = $validated['faculty_id'];
            }
            $data['birth_date'] = Carbon::parse($validated['birth_date']);
            User::create($data);
            DB::commit();
            return Reply::successWithMessage(trans('app.successes.record_save_success'));
        } catch (\Exception $error) {
            DB::rollBack();
            return $this->handleException($error);
        }
    }

    public function show(string $id)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission(PermissionType::USER_VIEW) && $id != $user->id, 403);

        try {
            $data = User::with(['role', 'school_class', 'faculty'])->findOrFail($id);
            return Reply::successWithData($data, '');
        } catch (\Exception $error) {
            return $this->handleException($error);
        }
    }

    public function update(UpdateRequest $request, string $id)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission(PermissionType::USER_UPDATE), 403);
        $validated = $request->validated();
        DB::beginTransaction();

        try {
            $target_user = User::with('role')->findOrFail($id);

            if ($target_user->role_id == RoleType::ADMIN->value && $user->id != $target_user->id) {
                return Reply::error(trans('app.errors.403'), 403);
            }

            $data = collect($validated)->except(['password', 'school_class_id', 'faculty_id'])->toArray();

            if ($user->id == $id) $data['is_active'] = 1;

            if (!empty($validated['password']) && $target_user->role_id != RoleType::ADMIN->value) {
                $data['password'] = Hash::make($validated['password']);
            }

            if ($target_user->role_id == RoleType::STUDENT->value) {
                $data['school_class_id'] = $validated['school_class_id'];
            }

            if ($target_user->role_id == RoleType::TEACHER->value) {
                $data['faculty_id'] = $validated['faculty_id'];
            }

            if ($target_user->email != $data['email']) {
                $data['email_verified_at'] = null;
            }

            $data['birth_date'] = Carbon::parse($validated['birth_date']);
            $target_user->update($data);
            DB::commit();
            if ($data['is_active'] == 0) $target_user->tokens()->delete();
            return Reply::successWithMessage(trans('app.successes.record_save_success'));
        } catch (\Exception $error) {
            DB::rollBack();
            return $this->handleException($error);
        }
    }

    public function destroy(DeleteRequest $request)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission(PermissionType::USER_DELETE), 403);
        $validated = $request->validated();
        DB::beginTransaction();

        try {
            User::whereIn('id', $validated['ids'])
                ->where('id', '<>', $user->id)
                ->delete();
            DB::commit();
            return Reply::successWithMessage(trans('app.successes.record_delete_success'));
        } catch (\Exception $error) {
            DB::rollBack();
            return $this->handleException($error);
        }
    }

    public function paginateUsers(PaginateRequest $request)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission(PermissionType::USER_VIEW), 403);
        $validated = $request->validated();

        try {
            $users = User::with(['role', 'school_class', 'faculty'])
                ->where('role_id', '=', RoleType::valueFromName($validated['role']));
            // Filter
            if (!empty($validated['school_class_id'])) {
                $users = $users->where('school_class_id', $validated['school_class_id']);
            }
            if (!empty($validated['faculty_id'])) {
                $users = $users->where('faculty_id', $validated['faculty_id']);
            }
            if (!empty($validated['search'])) {
                $users = $users->where(function ($query) use ($validated) {
                    $query->whereFullText(User::FULLTEXT, $validated['search']);
                    if (ctype_alnum($validated['search'])) {
                        $query->orWhere('shortcode', 'like', "{$validated['search']}%");
                    }
                });
            }

            $users = $users->latest('id')->paginate($validated['per_page']);
            return Reply::successWithData($users, '');
        } catch (\Exception $error) {
            return $this->handleException($error);
        }
    }

    public function importUsers(ImportRequest $request)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission(PermissionType::USER_CREATE), 403);
        $validated = $request->validated();
        DB::beginTransaction();

        try {
            $file = $request->file('file');
            $role_id = RoleType::valueFromName($validated['role']);
            $sheets = Excel::toArray([], $file);
            $data = [];
            $non_exists_classes = [];
            $non_exists_faculties = [];
            foreach ($sheets[0] as $index => $row) {
                if ($index == 0) continue;
                $record = [
                    'role' => $validated['role'],
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
                    return Reply::error($validated_result['message']);
                }
                $validated_record = $validated_result['data'];

                if ($validated['role'] == 'student') {
                    $school_class_id = SchoolClass::where('shortcode', $row[0])->pluck('id')->first();
                    $validated_record['school_class_id'] = $school_class_id;
                    if ($school_class_id == null) $non_exists_classes[] = $row[0];
                }

                if ($validated['role'] == 'teacher') {
                    $faculty_id = Faculty::where('shortcode', $row[0])->pluck('id')->first();
                    $validated_record['faculty_id'] = $faculty_id;
                    if ($faculty_id == null) $non_exists_faculties[] = $row[0];
                }

                $validated_record = collect($validated_record)->except(['role'])->toArray();
                $validated_record['password'] = Hash::make($record['password']);
                $validated_record['role_id'] = $role_id;

                $data[] = $validated_record;
            }
            if (count($non_exists_classes) != 0) {
                return Reply::error(trans('app.errors.class_not_exists', [
                    'shortcodes' => implode(', ', $non_exists_classes)
                ]));
            }
            if (count($non_exists_faculties) != 0) {
                return Reply::error(trans('app.errors.faculty_not_exists', [
                    'shortcodes' => implode(', ', $non_exists_faculties)
                ]));
            }

            foreach ($data as $row) {
                User::create($row);
            }
            DB::commit();
            return Reply::successWithMessage(trans('app.successes.record_save_success'));
        } catch (\Exception $error) {
            DB::rollBack();
            return $this->handleException($error);
        }
    }

    public function exportableFields(ExportableRequest $request)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission(PermissionType::USER_VIEW), 403);
        $validated = $request->validated();

        $hiddens = $user->getHidden();
        $fillable = $user->getFillable();

        $hiddens[] = 'role_id';
        $hiddens[] = 'school_class_id';
        $hiddens[] = 'faculty_id';
        $hiddens[] = 'is_active';
        $hiddens[] = 'email_verified_at';

        $columns = array_filter($fillable, function ($value) use ($hiddens) {
            return !in_array($value, $hiddens);
        });

        $data = [];

        foreach ($columns as $column) {
            $data[] = [
                'field_name' => trans("headers.users.$column"),
                'field' => $column
            ];
        }

        if ($validated['role'] == 'student') {
            $data[] = [
                'field_name' => trans('headers.school_class.shortcode'),
                'field' => 'school_class.shortcode'
            ];
        }

        if ($validated['role'] == 'teacher') {
            $data[] = [
                'field_name' => trans('headers.faculty.shortcode'),
                'field' => 'faculty.shortcode'
            ];
        }
        return Reply::successWithData($data, '');
    }

    public function exportUsers(ExportRequest $request)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission(PermissionType::USER_VIEW), 403);
        $validated = $request->validated();

        try {
            $query = User::where('role_id', '=', RoleType::valueFromName($validated['role']));
            if ($validated['role'] == 'student') $query = $query->with('school_class');
            if ($validated['role'] == 'teacher') $query = $query->with('faculty');

            if (!empty($validated['school_class_id'])) {
                $query = $query->where('school_class_id', $validated['school_class_id']);
            }
            if (!empty($validated['faculty_id'])) {
                $query = $query->where('faculty_id', $validated['faculty_id']);
            }
            if (!empty($validated['search'])) {
                $query = $query->where(function ($query) use ($validated) {
                    $query->whereFullText(User::FULLTEXT, $validated['search']);
                    if (ctype_alnum($validated['search'])) {
                        $query->orWhere('shortcode', 'like', "{$validated['search']}%");
                    }
                });
            }

            $hiddens = (new User())->getHidden();
            $columns = array_filter($validated['fields'], function ($value) use ($hiddens) {
                return !in_array($value, $hiddens);
            });

            $collection = $query->get();
            return Excel::download(
                new UsersExport($collection, $columns),
                'Export-' . trans("role.{$validated['role']}") . '-' . Carbon::now() . '.xlsx'
            );
        } catch (\Exception $error) {
            DB::rollBack();
            return $this->handleException($error);
        }
    }

    public function autocomplete(AutoCompleteRequest $request)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission(PermissionType::USER_VIEW), 403);
        $validated = $request->validated();

        try {
            $users = User::where('role_id', '=', RoleType::valueFromName($validated['role']))
                ->search($validated['search'])
                ->take($this->autoCompleteResultLimit)
                ->get();
            return Reply::successWithData($users, '');
        } catch (\Exception $error) {
            return $this->handleException($error);
        }
    }

    public function searchUsers(SearchRequest $request)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission(PermissionType::USER_VIEW), 403);
        $validated = $request->validated();

        try {
            $users = User::with(['role', 'school_class', 'faculty'])
                ->where('role_id', '=', RoleType::valueFromName($validated['role']))
                ->latest('id');
            if (!empty($validated['search'])) {
                $users = $users->whereFullText(User::FULLTEXT, $validated['search']);
            }
            $users = $users->take($this->autoCompleteResultLimit * 10)
                ->get();
            return Reply::successWithData($users, '');
        } catch (\Exception $error) {
            return $this->handleException($error);
        }
    }

    public function validateUserArray($record)
    {
        $store_request = new StoreRequest();
        $rules = collect($store_request->rules())->except([
            'school_class_id',
            'faculty_id'
        ])->toArray();
        $validator = Validator::make($record, $rules);

        if ($validator->fails()) {
            return [
                'is_valid' => false,
                'data' => ValidationException::withMessages($validator->errors()->toArray()),
                'message' => $validator->errors()->first()
            ];
        }
        return [
            'is_valid' => true,
            'data' => $validator->validated(),
        ];
    }
}
