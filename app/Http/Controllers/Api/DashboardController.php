<?php

namespace App\Http\Controllers\Api;

use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Exam;
use App\Models\Question;
use App\Models\Role;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $this->getUser();
        $data = (object)[];
        $now = now();
        try {
            switch ($user->role_id) {
                case Role::ROLES['admin']:
                    # Get Count for 4 card in Dashboard
                    $data->number_of_teachers = User::whereRoleId(Role::ROLES['teacher'])->count();
                    $data->number_of_students = User::whereRoleId(Role::ROLES['student'])->count();
                    $data->number_of_courses = Course::whereHas('semester', function ($query) use ($now) {
                        $query->whereDate('start_date', '<=', $now)
                            ->whereDate('end_date', '>=', $now);
                    })->count();
                    $data->exams_in_this_month = Exam::whereBetween('exam_date', [now()->startOfMonth(), now()->endOfMonth()])
                        ->count();
                    # Get render data
                    $data->exams_in_next_week = Exam::with([
                        'course',
                        'course.subject',
                        'course.teacher',
                    ])->whereBetween('exam_date', [$now, $now->copy()->addWeek()])
                        ->get();
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
                    # Get render data
                    $data->exams_in_next_week = Exam::with([
                        'course',
                        'course.subject',
                        'course.teacher',
                    ])->whereHas('course.teacher', function ($query) use ($user) {
                        $query->where('id', '=', $user->id);
                    })->whereBetween('exam_date', [$now, $now->copy()->addWeek()])
                        ->get();
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
                    })->whereBetween('exam_date', [now()->startOfMonth(), now()->endOfMonth()])
                        ->count();
                    # Get render data
                    $data->exams_in_next_week = Exam::with([
                        'course',
                        'course.subject',
                        'course.teacher',
                    ])->whereHas('course.enrollments', function ($query) use ($user) {
                        $query->where('student_id', '=', $user->id);
                    })->whereBetween('exam_date', [$now, $now->copy()->addWeek()])
                        ->get();
                    break;
                default:
                    # code...
                    break;
            }
            return Reply::successWithData($data, '');
        } catch (\Throwable $error) {
            Log::error($error->getMessage());
            if ($this->isDevelopment) return $error;
            return Reply::error('app.errors.serverError', [], 500);
        }
    }
}
