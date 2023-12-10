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
    function __construct()
    {
        parent::__construct();
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $this->getUser();
        $data = (object)[];
        $now = now();
        try {
            switch ($user->role_id) {
                case Role::ROLES['admin']:
                    $data->number_of_teachers = User::whereRoleId(Role::ROLES['teacher'])->count();
                    $data->number_of_students = User::whereRoleId(Role::ROLES['student'])->count();
                    $data->number_of_subjects = Subject::count();
                    $data->number_of_courses = Course::whereHas('semester', function ($query) use ($now) {
                        $query->whereDate('start_date', '<=', $now)
                            ->whereDate('end_date', '>=', $now);
                    })->count();
                    $data->number_of_question = Question::count();
                    $data->exams_in_next_week = Exam::whereBetween('exam_date', [$now, $now->copy()->addWeek()])
                        ->count();
                    $data->exams_in_this_month = Exam::whereBetween('exam_date', [now()->startOfMonth(), now()->endOfMonth()])
                        ->count();
                    break;
                case Role::ROLES['teacher']:
                    #
                    break;
                case Role::ROLES['student']:
                    #
                    break;
                default:
                    # code...
                    break;
            }
            return Reply::successWithData($data, '');
        } catch (\Throwable $error) {
            $message = $error->getMessage();
            Log::error($message);
            if (env('APP_DEBUG') == true) return $error;
            return Reply::error('app.errors.serverError', [], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
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
}
