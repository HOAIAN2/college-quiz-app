<?php

namespace App\Http\Controllers\Api;

use Carbon\Carbon;
use App\Models\Exam;
use App\Models\User;
use App\Helper\Reply;
use App\Enums\RoleType;
use App\Models\Setting;
use App\Models\ExamResult;
use App\Helper\NumberHelper;
use Illuminate\Http\Request;
use App\Enums\PermissionType;
use App\Models\ExamQuestionsOrder;
use Illuminate\Support\Facades\DB;
use App\Models\ExamQuestionsAnswer;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ExamResultsByUserExport;
use App\Http\Requests\ExamResult\CancelRequest;
use App\Http\Requests\ExamResult\RemarkRequest;
use App\Http\Requests\ExamResult\GetByUserRequest;

class ExamResultController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        //
    }

    public function show(string $id)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission(PermissionType::EXAM_RESULT_VIEW), 403);

        try {
            $exam_result = ExamResult::with('user')->findOrFail($id);

            // Check valid permission
            $exam = Exam::query();
            switch ($user->role_id) {
                case RoleType::ADMIN->value:
                    break;
                case RoleType::STUDENT->value:
                    $exam = $exam
                        ->whereHas('course.enrollments', function ($query) use ($user) {
                            $query->where('student_id', '=', $user->id);
                        });
                    break;
                case RoleType::TEACHER->value:
                    $exam = $exam
                        ->whereHas('course.teacher', function ($query) use ($user) {
                            $query->where('id', '=', $user->id);
                        })
                        ->orWhereHas('supervisors', function ($query) use ($user) {
                            $query->where('user_id', '=', $user->id);
                        });
                    break;
                default:
                    return Reply::error(trans('app.errors.something_went_wrong'), 500);
                    break;
            }
            $exam->findOrFail($exam_result->exam_id);

            $exam_questions_order = ExamQuestionsOrder::where('exam_id', $exam_result->exam_id)
                ->where('user_id', '=', $exam_result->user_id)
                ->firstOrFail();

            $exam_questions_answers = ExamQuestionsAnswer::with([
                'exam_question.question' => function ($query) use ($exam_questions_order) {
                    $query->withTrashed()
                        ->select('questions.id', 'content')
                        ->with(['question_options' => function ($query)  use ($exam_questions_order) {
                            $query->withTrashed()
                                ->select('id', 'question_id', 'content', 'is_correct')
                                ->inRandomOrder($exam_questions_order->id);
                        }])
                        ->inRandomOrder($exam_questions_order->id);
                }
            ])->where('exam_id', '=', $exam_result->exam_id)
                ->get();

            return Reply::successWithData([
                'exam_result' => $exam_result,
                'exam_questions_answers' => $exam_questions_answers,
            ], '');
        } catch (\Exception $error) {
            return $this->handleException($error);
        }
    }

    public function remark(RemarkRequest $request, string $id)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission(PermissionType::EXAM_RESULT_REMARK), 403);
        $now = Carbon::now();
        $validated = $request->validated();

        DB::beginTransaction();
        try {
            $can_remark_within_days = (int)Setting::get('exam_can_remark_within_days');
            if (!Hash::check($validated['password'], $user->password)) {
                return Reply::error(trans('auth.errors.password_incorrect'));
            }
            $target_exam_result = ExamResult::findOrFail($id);

            // Check valid permission
            $exam = Exam::query();
            switch ($user->role_id) {
                case RoleType::ADMIN->value:
                    break;
                // case RoleType::STUDENT->value:
                //     $exam = $exam
                //         ->whereHas('course.enrollments', function ($query) use ($user) {
                //             $query->where('student_id', '=', $user->id);
                //         });
                //     break;
                case RoleType::TEACHER->value:
                    $exam = $exam
                        ->whereHas('course.teacher', function ($query) use ($user) {
                            $query->where('id', '=', $user->id);
                        })
                        ->orWhereHas('supervisors', function ($query) use ($user) {
                            $query->where('user_id', '=', $user->id);
                        });
                    break;
                default:
                    return Reply::error(trans('app.errors.something_went_wrong'), 500);
                    break;
            }
            $exam->findOrFail($target_exam_result->exam_id);

            // Limit time to remark 2 months
            if ($now->subDays($can_remark_within_days)->greaterThan(Carbon::parse($target_exam_result->created_at))) {
                return Reply::error(trans('exam.can_remark_within_days', [
                    'days' => $can_remark_within_days
                ]));
            }

            $target_exam_result->created_at;
            $answers = $target_exam_result
                ->exam
                ->exam_questions_answers()
                ->where('user_id', $target_exam_result->user_id)
                ->get();
            $correct_count = 0;
            foreach ($answers as $answer) {
                $current_is_correct = $answer->is_correct;
                $new_is_correct = $answer->question_option->is_correct;
                if ($new_is_correct) $correct_count++;
                if ($current_is_correct != $new_is_correct) {
                    $answer->update([
                        'is_correct' => $new_is_correct
                    ]);
                }
            }
            $target_exam_result->update([
                'correct_count' => $correct_count,
                'remark_by_user_id' => $user->id
            ]);
            DB::commit();
            return Reply::successWithMessage(trans('app.successes.success'));
        } catch (\Exception $error) {
            DB::rollBack();
            return $this->handleException($error);
        }
    }

    public function cancel(CancelRequest $request, string $id)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission(PermissionType::EXAM_RESULT_CANCEL), 403);
        $validated = $request->validated();

        DB::beginTransaction();
        try {
            if (!Hash::check($validated['password'], $user->password)) {
                return Reply::error(trans('auth.errors.password_incorrect'));
            }
            $target_exam_result = ExamResult::findOrFail($id);
            // Check valid permission
            $exam = Exam::query();
            switch ($user->role_id) {
                case RoleType::ADMIN->value:
                    break;
                // case RoleType::STUDENT->value:
                //     $exam = $exam
                //         ->whereHas('course.enrollments', function ($query) use ($user) {
                //             $query->where('student_id', '=', $user->id);
                //         });
                //     break;
                case RoleType::TEACHER->value:
                    $exam = $exam
                        ->whereHas('course.teacher', function ($query) use ($user) {
                            $query->where('id', '=', $user->id);
                        })
                        ->orWhereHas('supervisors', function ($query) use ($user) {
                            $query->where('user_id', '=', $user->id);
                        });
                    break;
                default:
                    return Reply::error(trans('app.errors.something_went_wrong'), 500);
                    break;
            }
            $exam->findOrFail($target_exam_result->exam_id);

            $target_exam_result->update([
                'cancellation_reason' => $validated['cancellation_reason'],
                'cancelled_at' => Carbon::now(),
                'cancelled_by_user_id' => $user->id
            ]);
            DB::commit();
            return Reply::successWithMessage(trans('app.successes.success'));
        } catch (\Exception $error) {
            DB::rollBack();
            return $this->handleException($error);
        }
    }

    public function getByUser(GetByUserRequest $request, string $id)
    {
        $user = $this->getUser();
        abort_if($user->isStudent() && $user->id != $id, 403);
        $validated = $request->validated();

        try {
            // Force error to reduce queries
            User::where('role_id', '=', RoleType::STUDENT)->findOrFail($id);
            $exam_results = ExamResult::with([
                'exam'
            ])->where('user_id', $id);
            // Filter
            if (!empty($validated['subject_id'])) {
                $exam_ids = Exam::whereHas('course.subject', function ($query) use ($validated) {
                    $query->where('id', $validated['subject_id']);
                })->pluck('id');
                $exam_results->whereIn('exam_id', $exam_ids);
            }
            $exam_results = $exam_results->latest()->get();
            return Reply::successWithData($exam_results);
        } catch (\Exception $error) {
            return $this->handleException($error);
        }
    }

    public function exportExamResultsByUser(GetByUserRequest $request, string $id)
    {
        $user = $this->getUser();
        abort_if($user->isStudent() && $user->id != $id, 403);
        $validated = $request->validated();

        try {
            $data = [];
            $now = Carbon::now();
            // Force error to reduce queries
            $student = User::where('role_id', '=', RoleType::STUDENT)->findOrFail($id);
            $exam_results = ExamResult::with([
                'exam.course.subject'
            ])->where('user_id', $id);
            // Filter
            if (!empty($validated['subject_id'])) {
                $exam_ids = Exam::whereHas('course.subject', function ($query) use ($validated) {
                    $query->where('id', $validated['subject_id']);
                })->pluck('id');
                $exam_results->whereIn('exam_id', $exam_ids);
            }

            $exam_results = $exam_results->latest()->get();
            $base_score_scale = (int)Setting::get('exam_base_score_scale');

            foreach ($exam_results as $exam_result) {
                $score = NumberHelper::caculateScore($exam_result->correct_count, $exam_result->question_count, $base_score_scale);
                $data[] = [
                    'subject_name' => $exam_result->exam->course->subject->name,
                    'exam_name' => $exam_result->exam->name,
                    // 'course_name' => $exam_result->exam->course->name,
                    'score' => NumberHelper::formatScore($score)
                ];
            }
            return Excel::download(
                new ExamResultsByUserExport(collect($data)),
                "$student->shortcode-exam-results-$now.xlsx"
            );
            return Reply::successWithData($exam_results);
        } catch (\Exception $error) {
            return $this->handleException($error);
        }
    }
}
