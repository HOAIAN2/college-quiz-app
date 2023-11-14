<?php

namespace App\Http\Controllers\api;

use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Exam;
use App\Models\Question;
use App\Models\Role;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Http\Request;

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
        switch ($user->role_id) {
            case Role::ROLES['admin']:
                # Get student, teacher count
                $data->teacher_count = 0;
                $data->student_count = 0;
                $user_roles = User::where('role_id', '<>', Role::ROLES['admin'])->pluck('role_id');
                foreach ($user_roles as $item) {
                    if ($item == Role::ROLES['teacher']) $data->teacher_count++;
                    else $data->student_count++;
                }
                # Get Subject count
                $data->subject_count = Subject::count('id');
                # Get courses count
                $data->course_count = Course::whereHas('semester', function ($query) use ($now) {
                    $query->whereDate('start_date', '<=', $now)
                        ->whereDate('end_date', '>=', $now);
                })->count('id');
                # Get Question count
                $data->question_count = Question::count('id');
                # Get exam count
                $data->exam_in_next_week = Exam::whereBetween('exam_date', [$now, $now->copy()->addWeek()])
                    ->count('id');
                $data->exam_in_this_month = Exam::whereBetween('exam_date', [now()->startOfMonth(), now()->endOfMonth()])
                    ->count('id');
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
        return $data;
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
