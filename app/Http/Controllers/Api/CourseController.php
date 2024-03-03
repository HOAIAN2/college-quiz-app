<?php

namespace App\Http\Controllers\Api;

use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Http\Requests\Course\GetAllRequest;
use App\Models\Course;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
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
			return Reply::successWithData($data->get(), '');
		} catch (\Throwable $error) {
			Log::error($error->getMessage());
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.somethingWentWrong', [], 500);
		}
	}

	public function store(Request $request)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('course_create'), 403);
		$data = $request->validated();

		DB::beginTransaction();
		try {
			User::whereRoleId(Role::ROLES['teacher'])
				->select('id')->firstOrFail($request->teacher_id);
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

	/**
	 * Display the specified resource.
	 */
	public function show(string $id)
	{
		//
	}

	/**
	 * Update the specified resource in storage.
	 */
	public function update(Request $request, string $id)
	{
		//
	}

	/**
	 * Remove the specified resource from storage.
	 */
	public function destroy(string $id)
	{
		//
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
