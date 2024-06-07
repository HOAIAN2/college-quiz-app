<?php

namespace App\Http\Controllers\Api;

use App\Exports\UsersExport;
use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Http\Requests\DeleteRequest;
use App\Http\Requests\User\AutoCompleteRequest;
use App\Http\Requests\User\ExportableRequest;
use App\Http\Requests\User\ExportRequest;
use App\Http\Requests\User\GetAllRequest;
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
		$data = (object)[];
		$data->user = $this->getUser()->load(['role', 'school_class', 'faculty']);
		try {
			$data->permissions = $data->user->role->permissions()->pluck('name');
			return Reply::successWithData($data, '');
		} catch (\Exception $error) {
			Log::error($error->getMessage());
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.something_went_wrong', [], 500);
		}
	}

	public function store(StoreRequest $request)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('user_create'), 403);

		DB::beginTransaction();
		try {
			$data = collect($request->validated())->except(['role', 'school_class_id', 'faculty_id'])->toArray();

			$data['password'] = Hash::make($request->password);
			$data['role_id'] = Role::ROLES[$request->role];
			if ($request->role == 'student') {
				$data['school_class_id'] = $request->school_class_id;
			}

			if ($request->role == 'teacher') {
				$data['faculty_id'] = $request->faculty_id;
			}
			$data['birth_date'] = Carbon::parse($request->birth_date);
			User::create($data);
			DB::commit();
			return Reply::successWithMessage('app.successes.record_save_success');
		} catch (\Exception $error) {
			Log::error($error->getMessage());
			DB::rollBack();
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.something_went_wrong', [], 500);
		}
	}

	public function show(string $id)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('user_view') && $id != $user->id, 403);

		try {
			$data = User::with(['role', 'school_class', 'faculty'])->findOrFail($id);
			return Reply::successWithData($data, '');
		} catch (\Exception $error) {
			Log::error($error->getMessage());
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.something_went_wrong', [], 500);
		}
	}

	public function update(UpdateRequest $request, string $id)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('user_update'), 403);

		DB::beginTransaction();
		try {
			$targetUser = User::with('role')->findOrFail($id);

			$data = collect($request->validated())->except(['password', 'school_class_id', 'faculty_id'])->toArray();

			if ($user->id == $id) $data['is_active'] = 1;
			if ($request->password != null) $data['password'] = Hash::make($request->password);

			if ($targetUser->role_id == Role::ROLES['student']) {
				$data['school_class_id'] = $request->school_class_id;
			}

			if ($targetUser->role_id == Role::ROLES['teacher']) {
				$data['faculty_id'] = $request->faculty_id;
			}
			$data['birth_date'] = Carbon::parse($request->birth_date);
			$targetUser->update($data);
			DB::commit();
			if ($data['is_active'] == 0) $targetUser->tokens()->delete();
			return Reply::successWithMessage('app.successes.record_save_success');
		} catch (\Exception $error) {
			Log::error($error->getMessage());
			DB::rollBack();
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.something_went_wrong', [], 500);
		}
	}

	public function destroy(DeleteRequest $request)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('user_delete'), 403);

		DB::beginTransaction();
		try {
			User::destroy($request->ids);
			DB::commit();
			return Reply::successWithMessage('app.successes.record_delete_success');
		} catch (\Exception $error) {
			Log::error($error->getMessage());
			DB::rollBack();
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.something_went_wrong', [], 500);
		}
	}

	public function getUserByType(GetByTypeRequest $request)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('user_view'), 403);

		try {
			$users = User::with(['role', 'school_class', 'faculty'])
				->where('role_id', '=', Role::ROLES[$request->role]);
			if ($request->search != null) {
				$users = $users->search($request->search);
			}

			$users = $users->latest('id')->paginate($request->per_page);
			return Reply::successWithData($users, '');
		} catch (\Exception $error) {
			Log::error($error->getMessage());
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.something_went_wrong', [], 500);
		}
	}

	public function importUsers(ImportRequest $request)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('user_create'), 403);

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
					return Reply::error($validated_result['message']);
				}
				$validated_record = $validated_result['data'];

				if ($request->role == 'student') {
					$school_class_id = SchoolClass::where('shortcode', $row[0])->pluck('id')->first();
					$validated_record['school_class_id'] = $school_class_id;
					if ($school_class_id == null) $non_exists_classes[] = $row[0];
				}

				if ($request->role == 'teacher') {
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
			return Reply::successWithMessage('app.successes.record_save_success');
		} catch (\Exception $error) {
			Log::error($error->getMessage());
			DB::rollBack();
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.something_went_wrong', [], 500);
		}
	}

	public function exportableFields(ExportableRequest $request)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('user_view'), 403);

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

		if ($request->role == 'student') {
			$data[] = [
				'field_name' => trans('headers.school_class.shortcode'),
				'field' => 'school_class.shortcode'
			];
		}

		if ($request->role == 'teacher') {
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
		abort_if(!$user->hasPermission('user_view'), 403);
		$data = $request->validated();
		$file_name = "Export_{$data['role']}_" . Carbon::now()->format(User::DATE_FORMAT) . '.xlsx';

		try {
			$query = User::where('role_id', '=', Role::ROLES[$data['role']]);
			if ($data['role'] == 'student') $query = $query->with('school_class');
			if ($data['role'] == 'teacher') $query = $query->with('faculty');

			$hiddens = (new User())->getHidden();
			$columns = array_filter($data['fields'], function ($value) use ($hiddens) {
				return !in_array($value, $hiddens);
			});

			$collection = $query->get();
			return Excel::download(new UsersExport($collection, $columns), $file_name);
		} catch (\Exception $error) {
			Log::error($error->getMessage());
			DB::rollBack();
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.something_went_wrong');
		}
	}

	public function autocomplete(AutoCompleteRequest $request)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('user_view'), 403);

		try {
			$users = User::where('role_id', '=', Role::ROLES[$request->role])
				->search($request->search)->take($this->autoCompleteResultLimit)->get();
			return Reply::successWithData($users, '');
		} catch (\Exception $error) {
			Log::error($error->getMessage());
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.something_went_wrong', [], 500);
		}
	}

	public function getAllUsers(GetAllRequest $request)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('user_view'), 403);

		try {
			$users = User::with(['role', 'school_class', 'faculty'])
				->where('role_id', '=', Role::ROLES[$request->role])
				->search($request->search)
				->latest('id')
				->take($this->autoCompleteResultLimit * 20)
				->get();
			return Reply::successWithData($users, '');
		} catch (\Exception $error) {
			Log::error($error->getMessage());
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.something_went_wrong', [], 500);
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
