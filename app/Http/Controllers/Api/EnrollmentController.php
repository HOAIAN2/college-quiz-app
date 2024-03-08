<?php

namespace App\Http\Controllers\Api;

use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Http\Requests\Enrollment\DeleteRequest;
use App\Http\Requests\Enrollment\StoreRequest;
use App\Models\Course;
use App\Models\Enrollment;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EnrollmentController extends Controller
{
	/**
	 * Display a listing of the resource.
	 */
	public function index()
	{
		//
	}

	/**
	 * Store a newly created resource in storage.
	 */
	public function store(StoreRequest $request)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('course_update'), 403);

		DB::beginTransaction();
		try {
			$course = Course::findOrFail($request->course_id);
			if (Carbon::now()->greaterThan($course->semester->end_date)) {
				return Reply::error('app.errors.semesterEnd', [], 400);
			}
			if (!$course->hasAnyStudentFromList($request->student_ids)) {
				$student_ids = $request->student_ids;
				foreach ($student_ids as $student_id) {
					Enrollment::create([
						'course_id' => $request->course_id,
						'student_id' => $student_id
					]);
				}
			}
			DB::commit();
			return Reply::successWithMessage('app.successes.recordSaveSuccess');
		} catch (\Throwable $error) {
			Log::error($error->getMessage());
			DB::rollBack();
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.somethingWentWrong', [], 500);
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
	public function destroy(DeleteRequest $request)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('course_update'), 403);

		DB::beginTransaction();
		try {
			$course = Course::findOrFail($request->course_id);
			if (Carbon::now()->greaterThan($course->semester->end_date)) {
				return Reply::error('app.errors.semesterEnd', [], 400);
			}
			Enrollment::destroy($request->ids);
			DB::commit();
			return Reply::successWithMessage('app.successes.recordDeleteSuccess');
		} catch (\Throwable $error) {
			Log::error($error->getMessage());
			DB::rollBack();
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.somethingWentWrong', [], 500);
		}
	}
}
