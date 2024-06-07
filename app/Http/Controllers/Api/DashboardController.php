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
			# Section 1: 4 Cards
			$data->number_of_teachers = User::where('role_id', '=', Role::ROLES['teacher'])->count();
			$data->number_of_students = User::where('role_id', '=', Role::ROLES['student'])->count();
			$data->number_of_courses = Course::whereHas('semester', function ($query) use ($now) {
				$query->whereDate('start_date', '<=', $now)
					->whereDate('end_date', '>=', $now);
			})->count();
			$data->exams_in_this_month = Exam::whereBetween(
				'exam_date',
				[now()->startOfMonth(), now()->endOfMonth()]
			);
			# Section 2
			$data->today_exams = Exam::whereDate('exam_date', $now);

			$exams_each_month = Exam::select(DB::raw('MONTH(exam_date) as month'), DB::raw('COUNT(*) as count'))
				->whereYear('exam_date', $now->year)
				->groupBy('month')
				->orderBy('month');

			#
			switch ($user->role_id) {
				case Role::ROLES['admin']:
					$data->exams_in_this_month = $data->exams_in_this_month->count();
					$data->today_exams = $data->today_exams->get();
					break;
				case Role::ROLES['teacher']:
					$data->exams_in_this_month = $data->exams_in_this_month->whereHas('course.teacher', function ($query) use ($user) {
						$query->where('id', '=', $user->id);
					})->count();
					$data->today_exams = $data->today_exams->whereHas('course.teacher', function ($query) use ($user) {
						$query->where('id', '=', $user->id);
					})->get();
					$exams_each_month = $exams_each_month
						->whereHas('course.teacher', function ($query) use ($user) {
							$query->where('id', '=', $user->id);
						});
					break;
				case Role::ROLES['student']:
					$data->exams_in_this_month = $data->exams_in_this_month->whereHas('course.enrollments', function ($query) use ($user) {
						$query->where('student_id', '=', $user->id);
					})->count();
					$data->today_exams = $data->today_exams->whereHas('course.enrollments', function ($query) use ($user) {
						$query->where('student_id', '=', $user->id);
					})->get();
					$exams_each_month = $exams_each_month
						->whereHas('course.enrollments', function ($query) use ($user) {
							$query->where('student_id', '=', $user->id);
						});
					break;
				default:
					return Reply::error('app.errors.something_went_wrong', [], 500);
			}
			$exams_each_month = $exams_each_month->pluck('count', 'month')
				->toArray();
			$data->exams_each_month = array_values(array_replace(array_fill(1, 12, 0), $exams_each_month));
			return Reply::successWithData($data, '');
		} catch (\Exception $error) {
			Log::error($error->getMessage());
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.something_went_wrong', [], 500);
		}
	}
}
