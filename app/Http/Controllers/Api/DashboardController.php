<?php

namespace App\Http\Controllers\Api;

use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Exam;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
	public function index()
	{
		$user = $this->getUser();
		$data = (object)[];
		$now = now();
		try {
			$exams_each_month = Exam::select(DB::raw('MONTH(exam_date) as month'), DB::raw('COUNT(*) as count'))
				->whereYear('exam_date', 2024)
				->groupBy('month')
				->orderBy('month');
			switch ($user->role_id) {
				case Role::ROLES['admin']:
					# Get Count for 4 card in Dashboard
					$data->number_of_teachers = User::whereRoleId(Role::ROLES['teacher'])->count();
					$data->number_of_students = User::whereRoleId(Role::ROLES['student'])->count();
					$data->number_of_courses = Course::whereHas('semester', function ($query) use ($now) {
						$query->whereDate('start_date', '<=', $now)
							->whereDate('end_date', '>=', $now);
					})->count();
					$data->exams_in_this_month = Exam::whereBetween(
						'exam_date',
						[now()->startOfMonth(), now()->endOfMonth()]
					)
						->count();
					# Today exams
					$data->today_exams = Exam::whereDate('exam_date', $now)->get();
					# Exam each month for chart
					break;
				case Role::ROLES['teacher']:
					# Get Count for 4 card in Dashboard
					$data->number_of_teachers = User::whereRoleId(Role::ROLES['teacher'])->count();
					$data->number_of_students = User::whereRoleId(Role::ROLES['student'])->count();
					$data->number_of_courses = Course::whereHas('semester', function ($query) use ($now) {
						$query->whereDate('start_date', '<=', $now)
							->whereDate('end_date', '>=', $now);
					})->count();
					$data->exams_in_this_month = Exam::whereHas('course.teacher', function ($query) use ($user) {
						$query->where('id', '=', $user->id);
					})->whereBetween('exam_date', [now()->startOfMonth(), now()->endOfMonth()])
						->count();
					# Today exams
					$data->today_exams = Exam::whereHas('course.teacher', function ($query) use ($user) {
						$query->where('id', '=', $user->id);
					})->whereDate('exam_date', $now)
						->get();
					# Exam each month for chart
					$exams_each_month = $exams_each_month
						->whereHas('course.teacher', function ($query) use ($user) {
							$query->where('id', '=', $user->id);
						});
					break;
				case Role::ROLES['student']:
					# Get Count for 4 card in Dashboard
					$data->number_of_teachers = User::whereRoleId(Role::ROLES['teacher'])->count();
					$data->number_of_students = User::whereRoleId(Role::ROLES['student'])->count();
					$data->number_of_courses = Course::whereHas('semester', function ($query) use ($now) {
						$query->whereDate('start_date', '<=', $now)
							->whereDate('end_date', '>=', $now);
					})->count();
					$data->exams_in_this_month = Exam::whereHas('course.enrollments', function ($query) use ($user) {
						$query->where('student_id', '=', $user->id);
					})->whereBetween('exam_date', [
						now()->startOfMonth(),
						now()->endOfMonth()
					])->count();
					# Today exams
					$data->today_exams = Exam::whereHas('course.enrollments', function ($query) use ($user) {
						$query->where('student_id', '=', $user->id);
					})->whereDate('exam_date', $now)
						->get();
					# Exam each month for chart
					$exams_each_month = $exams_each_month
						->whereHas('course.enrollments', function ($query) use ($user) {
							$query->where('student_id', '=', $user->id);
						});
					break;
				default:
					return Reply::error('app.errors.something_went_wrong', [], 500);
					break;
			}
			# Exam each month for chart
			$exams_each_month = $exams_each_month->pluck('count', 'month')
				->toArray();
			$exams_each_month_filled = array_fill(1, 12, 0);

			foreach ($exams_each_month as $month => $count) {
				$exams_each_month_filled[$month] = $count;
			}

			$data->exams_each_month = array_values($exams_each_month_filled);

			return Reply::successWithData($data, '');
		} catch (\Exception $error) {
			Log::error($error->getMessage());
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.something_went_wrong', [], 500);
		}
	}
}
