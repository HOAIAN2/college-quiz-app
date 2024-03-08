<?php

namespace App\Http\Controllers\Api;

use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Http\Requests\Course\GetAllRequest;
use App\Http\Requests\Course\StoreRequest;
use App\Http\Requests\Course\UpdateRequest;
use App\Models\Course;
use App\Models\Role;
use App\Models\Semester;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CourseController extends Controller
{
	public function index(GetAllRequest $request)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('course_view'), 403);

		try {
			$data = Course::where('semester_id', '=', $request->semester_id);
			if ($request->search != null) {
				$data = $data->search($request->search);
			}
			$data = $data->latest('id')->get();
			return Reply::successWithData($data, '');
		} catch (\Throwable $error) {
			Log::error($error->getMessage());
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.somethingWentWrong', [], 500);
		}
	}

	public function store(StoreRequest $request)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('course_create'), 403);
		$data = $request->validated();

		DB::beginTransaction();
		try {
			$semester = Semester::findOrFail($request->semester_id);
			if ($semester->isOver()) {
				return Reply::error('app.errors.semesterEnd', [], 400);
			}
			User::whereRoleId(Role::ROLES['teacher'])
				->select('id')->findOrFail($request->teacher_id);
			Course::create($data);
			DB::commit();
			return Reply::successWithMessage('app.successes.recordSaveSuccess');
		} catch (\Throwable $error) {
			Log::error($error->getMessage());
			DB::rollBack();
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.failToSaveRecord', [], 500);
		}
	}

	public function show(string $id)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('course_view'), 403);

		try {
			$courses = Course::with([
				'teacher',
				'subject',
				'enrollments.user' => function ($query) {
					$query->with(['role', 'school_class', 'faculty']);
				}
			])->findOrFail($id);
			return Reply::successWithData($courses, '');
		} catch (\Throwable $error) {
			Log::error($error->getMessage());
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.somethingWentWrong', [], 500);
		}
	}

	public function update(UpdateRequest $request, string $id)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('course_update'), 403);
		$data = $request->validated();
		DB::beginTransaction();

		try {
			$targetCourse = Course::findOrFail($id);
			if ($targetCourse->semester->isOver()) {
				return Reply::error('app.errors.semesterEnd', [], 400);
			}
			User::whereRoleId(Role::ROLES['teacher'])
				->select('id')->findOrFail($request->teacher_id);
			$targetCourse->update($data);
			DB::commit();
			return Reply::successWithMessage('app.successes.recordSaveSuccess');
		} catch (\Throwable $error) {
			Log::error($error->getMessage());
			DB::rollBack();
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.failToSaveRecord', [], 500);
		}
	}

	public function destroy(string $id)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('course_delete'), 403);

		DB::beginTransaction();
		try {
			Course::destroy($id);
			DB::commit();
			return Reply::successWithMessage('app.successes.recordDeleteSuccess');
		} catch (\Throwable $error) {
			Log::error($error->getMessage());
			DB::rollBack();
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.somethingWentWrong', [], 500);
		}
	}
	public function byUser(string $id)
	{
		// if ($data->user == null) return Reply::successWithData($data, '');
		// # Get course
		// switch ($data->user->role_id) {
		//     case Role::ROLES['student']:
		//         $data->courses = Course::whereHas('semester', function ($query) use ($now) {
		//             $query->whereDate('start_date', '<=', $now)
		//                 ->whereDate('end_date', '>=', $now);
		//         })->whereHas('enrollments', function ($query) use ($id) {
		//             $query->where('student_id', '=', $id);
		//         });
		//         break;
		//     case Role::ROLES['teacher']:
		//         $data->courses = Course::whereHas('semester', function ($query) use ($now) {
		//             $query->whereDate('start_date', '<=', $now)
		//                 ->whereDate('end_date', '>=', $now);
		//         })->where('teacher_id', '=', $data->user->id);
		//         break;
		//     default:
		//         $data->courses = [];
		//         break;
		// }
	}
}
