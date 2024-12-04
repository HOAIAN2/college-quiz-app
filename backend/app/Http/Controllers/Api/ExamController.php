<?php

namespace App\Http\Controllers\Api;

use App\Enums\PermissionType;
use App\Enums\RoleType;
use App\Exports\ExamResultsExport;
use App\Helper\NumberHelper;
use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Http\Requests\Exam\IndexRequest;
use App\Http\Requests\Exam\StoreRequest;
use App\Http\Requests\Exam\SubmitRequest;
use App\Http\Requests\Exam\SyncAnswerCacheRequest;
use App\Http\Requests\Exam\UpdateRequest;
use App\Http\Requests\Exam\UpdateStatusRequest;
use App\Models\Chapter;
use App\Models\Course;
use App\Models\Exam;
use App\Models\ExamQuestion;
use App\Models\ExamQuestionsOrder;
use App\Models\ExamResult;
use App\Models\ExamSupervisor;
use App\Models\ExamQuestionsAnswer;
use App\Models\Question;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;

class ExamController extends Controller
{
    const QUESTIONS_CACHE_KEY = 'exam:@exam_id:-user:@user_id-questions';
    const ANSWERS_CACHE_KEY = 'exam:@exam_id:-user:@user_id-answers';
    private int $allowLateSubmitSeconds = 0;

    public function __construct()
    {
        parent::__construct();
        $this->allowLateSubmitSeconds = config('custom.exam.allow_late_submit_seconds');
    }

    public function index(IndexRequest $request)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission(PermissionType::EXAM_VIEW), 403);
        $date = Carbon::now();
        $relations = [
            'course',
            'course.subject',
            // 'exam_supervisors.user',
            // 'course.teacher',
        ];
        if ($request->month != null && $request->year != null) {
            $date->setYear((int)$request->year);
            $date->setMonth((int)$request->month);
        }

        try {
            $data = Exam::with($relations)
                ->whereMonth('exam_date', '=', $date->month)
                ->whereYear('exam_date', '=', $date->year)
                ->orderBy('exam_date');

            switch ($user->role_id) {
                case RoleType::ADMIN->value:
                    $data = $data->get();
                    break;
                case RoleType::STUDENT->value:
                    $data = $data
                        ->whereHas('course.enrollments', function ($query) use ($user) {
                            $query->where('student_id', '=', $user->id);
                        })
                        ->get();
                    break;
                case RoleType::TEACHER->value:
                    $data = $data
                        ->whereHas('course.teacher', function ($query) use ($user) {
                            $query->where('id', '=', $user->id);
                        })
                        ->orWhereHas('exam_supervisors', function ($query) use ($user) {
                            $query->where('user_id', '=', $user->id);
                        })
                        ->get();
                    break;
                default:
                    return Reply::error('app.errors.something_went_wrong', [], 500);
                    break;
            }
            return Reply::successWithData($data, '');
        } catch (\Exception $error) {
            return $this->handleException($error);
        }
    }

    public function store(StoreRequest $request)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission(PermissionType::EXAM_CREATE), 403);

        DB::beginTransaction();
        try {
            # Check permission
            $course = Course::select('*');
            switch ($user->role_id) {
                case RoleType::TEACHER->value:
                    $course = $course->whereHas('teacher', function ($query) use ($user) {
                        $query->where('id', '=', $user->id);
                    })
                        ->findOrFail($request->course_id);
                    break;
                case RoleType::ADMIN->value:
                    $course = $course->findOrFail($request->course_id);
                    break;
                default:
                    return Reply::error('app.errors.something_went_wrong', [], 500);
                    break;
            }

            $course_end_date = Carbon::parse($course->semester->end_date);
            if ($course->isOver()) {
                return Reply::error('app.errors.semester_end', [], 400);
            }
            $exam_date = Carbon::parse($request->exam_date);
            if ($exam_date->greaterThanOrEqualTo($course_end_date)) {
                return Reply::error('app.errors.exam_date_greater_than_semester', [
                    'date' => $course_end_date
                ], 400);
            }
            $chapters = Chapter::withCount('questions')
                ->where('subject_id', '=', $course->subject_id)
                ->orderBy('chapter_number')
                ->get();
            $exam = Exam::create([
                'course_id' => $request->course_id,
                'name' => $request->name,
                'exam_date' => $exam_date,
                'exam_time' => $request->exam_time,
            ]);

            $expert_count = $request->expert_count;
            $hard_count = $request->hard_count;
            $medium_count = $request->medium_count;

            // Validate phrase
            if (
                array_sum([$expert_count, $hard_count, $medium_count])
                > array_sum(array_values($request->question_counts))
            ) {
                DB::rollBack();
                return Reply::error('exam.expert_question_limit_error');
            }

            foreach ($chapters as $key => $chapter) {
                $chapter->max_select_question = $request->question_counts[$key];
            }
            $chapters = $chapters->filter(function ($chapter) {
                return $chapter->max_select_question != null;
            })->shuffle();

            $question_ids = [];
            foreach ($chapters as $chapter) {
                $chapter_question_ids = [];
                if ($chapter != $chapters->last()) {
                    do {
                        $chapter_expert_count = random_int(0, $expert_count);
                        $chapter_hard_count = random_int(0, $hard_count);
                        $chapter_medium_count = random_int(0, $medium_count);
                    } while (
                        array_sum([$chapter_expert_count, $chapter_hard_count, $chapter_medium_count])
                        > $chapter->max_select_question
                    );
                } else {
                    $chapter_expert_count = $expert_count;
                    $chapter_hard_count = $hard_count;
                    $chapter_medium_count = $medium_count;
                }
                // Select random expert
                if ($chapter_expert_count != 0) {
                    $expert_questions_ids = Question::where('subject_id', '=', $course->subject_id)
                        ->where('chapter_id', '=', $chapter->id)
                        ->where('level', '=', 'expert')
                        ->inRandomOrder()
                        ->take($chapter_expert_count)
                        ->pluck('id')
                        ->toArray();
                    $chapter_question_ids = array_merge($chapter_question_ids, $expert_questions_ids);
                    $expert_count = $expert_count - count($expert_questions_ids);
                }
                // Select random hard
                if ($chapter_hard_count != 0) {
                    $hard_questions_ids = Question::where('subject_id', '=', $course->subject_id)
                        ->where('chapter_id', '=', $chapter->id)
                        ->where('level', '=', 'hard')
                        ->inRandomOrder()
                        ->take($chapter_hard_count)
                        ->pluck('id')
                        ->toArray();
                    $chapter_question_ids = array_merge($chapter_question_ids, $hard_questions_ids);
                    $hard_count = $hard_count - count($hard_questions_ids);
                }
                // Select random medium
                if ($chapter_medium_count != 0) {
                    $medium_questions_ids = Question::where('subject_id', '=', $course->subject_id)
                        ->where('chapter_id', '=', $chapter->id)
                        ->where('level', '=', 'medium')
                        ->inRandomOrder()
                        ->take($chapter_medium_count)
                        ->pluck('id')
                        ->toArray();
                    $chapter_question_ids = array_merge($chapter_question_ids, $medium_questions_ids);
                    $medium_count = $medium_count - count($medium_questions_ids);
                }
                // Not enough, select easy questions
                if (count($chapter_question_ids) < $chapter->max_select_question) {
                    $easy_questions_ids = Question::where('subject_id', '=', $course->subject_id)
                        ->where('chapter_id', '=', $chapter->id)
                        ->where('level', '=', 'easy')
                        ->inRandomOrder()
                        ->take($chapter->max_select_question - count($chapter_question_ids))
                        ->pluck('id')
                        ->toArray();
                    $chapter_question_ids = array_merge($chapter_question_ids,  $easy_questions_ids);
                }
                // Still not enough, select random and ignore level
                if (count($chapter_question_ids) < $chapter->max_select_question) {
                    $additional_questions_ids = Question::where('subject_id', '=', $course->subject_id)
                        ->where('chapter_id', '=', $chapter->id)
                        ->inRandomOrder()
                        ->take($chapter->max_select_question - count($chapter_question_ids))
                        ->pluck('id')
                        ->toArray();
                    $chapter_question_ids = array_merge($chapter_question_ids,  $additional_questions_ids);
                }
                // If still not enough, send error
                if (count($chapter_question_ids) != $chapter->max_select_question) {
                    DB::rollBack();
                    return Reply::error('app.errors.max_chapter_question_count', [
                        'name' => "$chapter->chapter_number. $chapter->name",
                        'number' => $chapter->questions_count
                    ], 400);
                }
                $question_ids = array_merge($question_ids, $chapter_question_ids);
            }
            shuffle($question_ids);
            foreach ($question_ids as $question_id) {
                ExamQuestion::create([
                    'exam_id' => $exam->id,
                    'question_id' => $question_id
                ]);
            }
            $supervisor_ids = User::where('role_id', '=', RoleType::TEACHER)
                ->whereIn('id', $request->supervisor_ids)
                ->pluck('id');
            foreach ($supervisor_ids as $supervisor_id) {
                ExamSupervisor::create([
                    'exam_id' => $exam->id,
                    'user_id' => $supervisor_id
                ]);
            }
            DB::commit();
            return Reply::successWithMessage('app.successes.record_save_success');
        } catch (\Exception $error) {
            DB::rollBack();
            return $this->handleException($error);
        }
    }

    public function show(string $id)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission(PermissionType::EXAM_VIEW), 403);
        $relations = [
            'exam_supervisors.user',
        ];

        try {
            $data = Exam::with($relations);
            switch ($user->role_id) {
                case RoleType::ADMIN->value:
                    break;
                case RoleType::STUDENT->value:
                    $data = $data
                        ->whereHas('course.enrollments', function ($query) use ($user) {
                            $query->where('student_id', '=', $user->id);
                        });
                    break;
                case RoleType::TEACHER->value:
                    $data = $data
                        ->whereHas('course.teacher', function ($query) use ($user) {
                            $query->where('id', '=', $user->id);
                        });
                    break;
                default:
                    return Reply::error('app.errors.something_went_wrong', [], 500);
                    break;
            }
            $data = $data->findOrFail($id);
            $result = [];
            $students = Course::findOrFail($data->course_id)->enrollments->pluck('user');

            foreach ($students as $student) {
                $exam_result = $student->exam_results()
                    ->where('exam_id', $data->id)
                    ->first();
                $result[] = [
                    'student_id' => $student->id,
                    'first_name' => $student->first_name,
                    'last_name' => $student->last_name,
                    'school_class_shortcode' => $student->school_class->shortcode,
                    'gender' => $student->gender,
                    'question_count' => $exam_result?->question_count,
                    'correct_count' => $exam_result?->correct_count,
                    'submitted_at' => $exam_result?->created_at
                ];
            }
            $data->result = $result;
            return Reply::successWithData($data, '');
        } catch (\Exception $error) {
            return $this->handleException($error);
        }
    }

    public function update(UpdateRequest $request, string $id)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission(PermissionType::EXAM_UPDATE), 403);
        $data = collect($request->validated())->except(['supervisor_ids'])->toArray();

        DB::beginTransaction();
        try {
            $target_exam = Exam::select('*');
            switch ($user->role_id) {
                case RoleType::TEACHER->value:
                    $target_exam = $target_exam->whereHas('course.teacher', function ($query) use ($user) {
                        $query->where('id', '=', $user->id);
                    })
                        ->findOrFail($id);
                    break;
                case RoleType::ADMIN->value:
                    $target_exam = $target_exam->findOrFail($id);
                    break;
                default:
                    return Reply::error('app.errors.something_went_wrong', [], 500);
                    break;
            }
            $exam_started_at = $target_exam->started_at != null
                ? Carbon::parse($target_exam->started_at) : null;
            if (
                $exam_started_at != null &&
                Carbon::now()->greaterThan($exam_started_at)
            ) {
                return Reply::error('app.errors.exam_has_end');
            }
            $data['exam_date'] = Carbon::parse($data['exam_date']);
            $target_exam->update($data);

            # Update supervisors
            if ($request->supervisor_ids == null) {
                ExamSupervisor::where('exam_id', '=', $target_exam->id)
                    ->delete();
            } else {
                $will_be_deleted_supervisor_ids = $target_exam->exam_supervisors()
                    ->whereNotIn('user_id', $request->supervisor_ids)
                    ->pluck('user_id');

                ExamSupervisor::where('exam_id', '=', $target_exam->id)
                    ->whereIn('user_id', $will_be_deleted_supervisor_ids)
                    ->delete();

                $existing_supervisor_ids = $target_exam->exam_supervisors()
                    ->whereIn('user_id', $request->supervisor_ids)
                    ->pluck('user_id')->toArray();

                $supervisor_ids = User::where('role_id', '=', RoleType::TEACHER)
                    ->whereIn('id', $request->supervisor_ids)
                    ->pluck('id');

                foreach ($supervisor_ids as $supervisor_id) {
                    if (in_array($supervisor_id, $existing_supervisor_ids)) continue;
                    ExamSupervisor::create([
                        'exam_id' => $target_exam->id,
                        'user_id' => $supervisor_id
                    ]);
                }
            }
            DB::commit();
            return Reply::successWithMessage('app.successes.record_save_success');
        } catch (\Exception $error) {
            DB::rollBack();
            return $this->handleException($error);
        }
    }

    public function destroy(string $id)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission(PermissionType::EXAM_DELETE), 403);

        DB::beginTransaction();
        try {
            $exam = Exam::select('*');
            switch ($user->role_id) {
                case RoleType::TEACHER->value:
                    $exam = $exam->whereHas('course.teacher', function ($query) use ($user) {
                        $query->where('id', '=', $user->id);
                    })
                        ->findOrFail($id);
                    break;
                case RoleType::ADMIN->value:
                    $exam = $exam->findOrFail($id);
                    break;
                default:
                    return Reply::error('app.errors.something_went_wrong', [], 500);
                    break;
            }
            $exam_started_at = $exam->started_at != null
                ? Carbon::parse($exam->started_at) : null;
            if (
                $exam_started_at != null &&
                Carbon::now()->greaterThan($exam_started_at)
            ) {
                return Reply::error('app.errors.exam_has_start');
            }
            $exam->delete();
            DB::commit();
            return Reply::successWithMessage('app.successes.record_delete_success');
        } catch (\Exception $error) {
            DB::rollBack();
            return $this->handleException($error);
        }
    }

    public function updateStatus(UpdateStatusRequest $request, string $id)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission(PermissionType::EXAM_UPDATE), 403);
        $now = Carbon::now();

        DB::beginTransaction();
        try {
            $target_exam = Exam::findOrFail($id);
            $has_update_status_permission = $target_exam->exam_supervisors()
                ->where('user_id', '=', $user->id)
                ->exists();
            if (!$user->isAdmin() && !$has_update_status_permission) {
                return Reply::error('', [], 403);
            }
            switch ($request->status) {
                case 'start':
                    if ($target_exam->cancelled_at != null) {
                        return Reply::error('app.errors.exam_has_cancel');
                    }
                    if ($now->lessThan(Carbon::parse($target_exam->exam_date))) {
                        return Reply::error('app.errors.not_yet_time_for_exam');
                    }
                    if ($target_exam->started_at == null) {
                        $target_exam->update([
                            'started_at' => $now
                        ]);
                    } else return Reply::error('app.errors.exam_has_start');
                    break;
                case 'cancel':
                    if ($target_exam->cancelled_at == null) {
                        $target_exam->update([
                            'cancelled_at' => $now
                        ]);
                    } else return Reply::error('app.errors.exam_has_cancel');
                    break;
                default:
                    return Reply::error('app.errors.something_went_wrong', [], 500);
                    break;
            }
            DB::commit();
            return Reply::successWithMessage('app.successes.success');
        } catch (\Exception $error) {
            DB::rollBack();
            return $this->handleException($error);
        }
    }

    public function take(string $id)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission(PermissionType::EXAM_SUBMIT), 403);
        $now = Carbon::now();

        DB::beginTransaction();
        try {
            $data = (object)[];
            $question_cache_key = str_replace(
                ['@exam_id', '@user_id'],
                [$id, $user->id],
                self::QUESTIONS_CACHE_KEY
            );
            $answers_cache_key = str_replace(
                ['@exam_id', '@user_id'],
                [$id, $user->id],
                self::ANSWERS_CACHE_KEY
            );
            $data->answers_cache = Cache::get($answers_cache_key);
            if (Cache::has($question_cache_key)) {
                $data->exam_data = Cache::get($question_cache_key);
                return Reply::successWithData($data, '');
            }

            $exam_questions_order = ExamQuestionsOrder::firstOrCreate([
                'exam_id' => $id,
                'user_id' => $user->id
            ]);

            $exam = Exam::with(['questions' => function ($query) use ($exam_questions_order) {
                $query
                    ->select('questions.id', 'content')
                    ->with(['question_options' => function ($query)  use ($exam_questions_order) {
                        $query->select('id', 'question_id', 'content')
                            ->inRandomOrder($exam_questions_order->id);
                    }])
                    ->inRandomOrder($exam_questions_order->id);
            }])
                ->whereHas('course.enrollments', function ($query) use ($user) {
                    $query->where('student_id', '=', $user->id);
                })
                ->whereDoesntHave('exam_questions_answers', function ($query)  use ($user) {
                    $query->where('user_id', '=', $user->id);
                })
                ->whereNotNull('started_at')
                ->whereNull('cancelled_at')
                ->findOrFail($id);

            $exam_started_at = Carbon::parse($exam->started_at);
            $exam_ended_at = $exam_started_at->copy()->addMinutes($exam->exam_time + $this->allowLateSubmitSeconds / 60);
            if ($now->lessThan($exam_started_at)) {
                return Reply::error('app.errors.exam_not_start');
            }
            if ($now->greaterThan($exam_ended_at)) {
                return Reply::error('app.errors.exam_has_end');
            }
            Cache::put($question_cache_key, $exam, $exam_ended_at);
            DB::commit();
            $data->exam_data = $exam;
            return Reply::successWithData($data, '');
        } catch (\Exception $error) {
            DB::rollBack();
            return $this->handleException($error);
        }
    }

    public function submit(SubmitRequest $request, string $id)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission(PermissionType::EXAM_SUBMIT), 403);
        $now = Carbon::now();
        $answers = $request->answers;

        DB::beginTransaction();
        try {
            $questions_cache_key = str_replace(
                ['@exam_id', '@user_id'],
                [$id, $user->id],
                self::QUESTIONS_CACHE_KEY
            );
            $answers_cache_key = str_replace(
                ['@exam_id', '@user_id'],
                [$id, $user->id],
                self::ANSWERS_CACHE_KEY
            );
            $exam_questions_order = ExamQuestionsOrder::where('exam_id', '=', $id)
                ->where('user_id', '=', $user->id)
                ->firstOrFail();

            $exam = Exam::with(['questions' => function ($query) use ($exam_questions_order) {
                $query->select('questions.id')
                    ->with(['question_options' => function ($query)  use ($exam_questions_order) {
                        $query->select('id', 'question_id', 'is_correct')
                            ->inRandomOrder($exam_questions_order->id);
                    }])
                    ->inRandomOrder($exam_questions_order->id);
            }])
                ->whereHas('course.enrollments', function ($query) use ($user) {
                    $query->where('student_id', '=', $user->id);
                })
                ->whereDoesntHave('exam_questions_answers', function ($query)  use ($user) {
                    $query->where('user_id', '=', $user->id);
                })
                ->whereNotNull('started_at')
                ->whereNull('cancelled_at')
                ->findOrFail($id);

            $exam_date = Carbon::parse($exam->exam_date);
            $exam_end_date = $exam_date->copy()->addMinutes($exam->exam_time);

            if ($request->bypass_key != null && $exam->canBypassExamTime($request->bypass_key)) {
                $exam_end_date = $exam_end_date->addSeconds($this->allowLateSubmitSeconds);
            }

            if ($now->lessThan($exam_date)) {
                return Reply::error('app.errors.exam_not_start');
            }

            if ($now->greaterThan($exam_end_date)) {
                return Reply::error('app.errors.exam_has_end');
            }

            # Save and caculate score
            $correct_count = 0;

            foreach ($exam->questions as $key => $question) {
                $answer = $answers[$key];
                $is_correct = false;
                $answer_id = null;

                if ($question->question_options->has((int)$answer)) {
                    $question_option = $question->question_options[$answer];
                    $answer_id = $question_option->id;
                    $is_correct = $question_option->is_correct;
                    if ($is_correct) $correct_count++;
                }
                ExamQuestionsAnswer::create([
                    'user_id' => $user->id,
                    'exam_id' => $exam->id,
                    'question_id' => $question->pivot->id,
                    'answer_id' => $answer_id,
                    'is_correct' => $is_correct
                ]);
            }
            $result_data = ExamResult::create([
                'exam_id' => $exam->id,
                'user_id' => $user->id,
                'correct_count' => $correct_count,
                'question_count' => count($exam->questions),
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);
            Cache::forget($questions_cache_key);
            Cache::forget($answers_cache_key);
            DB::commit();
            return Reply::successWithData($result_data, '');
            return Reply::successWithMessage('app.successes.record_save_success');
        } catch (\Exception $error) {
            DB::rollBack();
            return $this->handleException($error);
        }
    }

    public function exportResult(string $id)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission(PermissionType::EXAM_VIEW), 403);
        $now = Carbon::now();

        try {
            $data = [];
            $exam = Exam::with('course.enrollments.user');
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
                        });
                    break;
                default:
                    return Reply::error('app.errors.something_went_wrong', [], 500);
                    break;
            }
            $exam = $exam->findOrFail($id);
            $question_count = $exam->questions()->count();
            $students = $exam->course->enrollments->pluck('user');

            foreach ($students as $student) {
                $exam_result = $student->exam_results()
                    ->where('exam_id', $id)
                    ->first();
                $score = NumberHelper::caculateScore($exam_result?->correct_count, $question_count);
                $data[] = [
                    'first_name' => $student->first_name,
                    'last_name' => $student->last_name,
                    'school_class_shortcode' => $student->school_class->shortcode,
                    'score' => NumberHelper::formatScore($score)
                ];
            }
            return Excel::download(
                new ExamResultsExport(collect($data)),
                "$id-$exam->name-result-$now.xlsx"
            );
        } catch (\Exception $error) {
            return $this->handleException($error);
        }
    }

    public function syncCache(SyncAnswerCacheRequest $request, string $id)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission(PermissionType::EXAM_SUBMIT), 403);
        $now = Carbon::now();

        try {
            $answers_cache_key = str_replace(
                ['@exam_id', '@user_id'],
                [$id, $user->id],
                self::ANSWERS_CACHE_KEY
            );
            $exam = Exam::whereHas('course.enrollments', function ($query) use ($user) {
                $query->where('student_id', '=', $user->id);
            })
                ->whereDoesntHave('exam_questions_answers', function ($query)  use ($user) {
                    $query->where('user_id', '=', $user->id);
                })
                ->whereNotNull('started_at')
                ->whereNull('cancelled_at')
                ->findOrfail($id);

            $exam_started_at = Carbon::parse($exam->started_at);
            $exam_ended_at = $exam_started_at->copy()->addMinutes($exam->exam_time);
            if ($now->lessThan($exam_started_at)) {
                return Reply::error('app.errors.exam_not_start');
            }
            if ($now->greaterThan($exam_ended_at)) {
                return Reply::error('app.errors.exam_has_end');
            }
            Cache::put(
                $answers_cache_key,
                array_map('intval', $request->answers),
                Carbon::parse($exam->started_at)->addMinutes($exam->exam_time + $this->allowLateSubmitSeconds / 60)
            );
            return Reply::success();
        } catch (\Exception $error) {
            return $this->handleException($error);
        }
    }
}
