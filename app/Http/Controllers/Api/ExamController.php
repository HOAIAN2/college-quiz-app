<?php

namespace App\Http\Controllers\Api;

use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Http\Requests\Exam\IndexRequest;
use App\Http\Requests\Exam\StoreRequest;
use App\Http\Requests\Exam\SubmitRequest;
use App\Http\Requests\Exam\UpdateRequest;
use App\Http\Requests\Exam\UpdateStatusRequest;
use App\Models\Chapter;
use App\Models\Course;
use App\Models\Exam;
use App\Models\ExamQuestion;
use App\Models\ExamQuestionsOrder;
use App\Models\ExamSupervisor;
use App\Models\ExamTracker;
use App\Models\Question;
use App\Models\Role;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ExamController extends Controller
{
	public $cacheKey = 'exam:@exam_id:-user:@user_id';

	public function index(IndexRequest $request)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('exam_view'), 403);
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
				case Role::ROLES['admin']:
					$data = $data->get();
					break;
				case Role::ROLES['student']:
					$data = $data
						->whereHas('course.enrollments', function ($query) use ($user) {
							$query->where('student_id', '=', $user->id);
						})
						->get();
					break;
				case Role::ROLES['teacher']:
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
			Log::error($error->getMessage());
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.something_went_wrong', [], 500);
		}
	}

	public function store(StoreRequest $request)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('exam_create'), 403);

		DB::beginTransaction();
		try {
			# Check permission
			$course = Course::select('*');
			switch ($user->role_id) {
				case Role::ROLES['teacher']:
					$course = $course->whereHas('teacher', function ($query) use ($user) {
						$query->where('id', '=', $user->id);
					})
						->findOrFail($request->course_id);
					break;
				case Role::ROLES['admin']:
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
			$question_ids = [];
			foreach ($chapters as $key => $chapter) {
				if ($request->question_counts[$key] == null) {
					continue;
				}
				$chapter_question_ids = Question::where('subject_id', '=', $course->subject_id)
					->where('chapter_id', '=', $chapter->id)
					->inRandomOrder()
					->take($request->question_counts[$key])
					->pluck('id')
					->toArray();
				if (count($chapter_question_ids) != $request->question_counts[$key]) {
					return Reply::error('app.errors.max_chapter_question_count', [
						'name' => "$chapter->chapter_number. $chapter->name",
						'number' => $chapter->questions_count
					], 400);
				}
				$question_ids = array_merge($question_ids, $chapter_question_ids);
			}
			# Random order all questions
			shuffle($question_ids);
			foreach ($question_ids as $question_id) {
				ExamQuestion::create([
					'exam_id' => $exam->id,
					'question_id' => $question_id
				]);
			}
			$supervisor_ids = User::where('role_id', '=', Role::ROLES['teacher'])
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
			Log::error($error->getMessage());
			DB::rollBack();
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.something_went_wrong', [], 500);
		}
	}

	public function show(string $id)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('exam_view'), 403);
		$relations = [
			'exam_supervisors.user',
		];
		$with_counts = [
			'questions',
		];

		try {
			$data = Exam::with($relations);
			switch ($user->role_id) {
				case Role::ROLES['admin']:
					break;
				case Role::ROLES['student']:
					$data = $data
						->whereHas('course.enrollments', function ($query) use ($user) {
							$query->where('student_id', '=', $user->id);
						});
					break;
				case Role::ROLES['teacher']:
					$data = $data
						->whereHas('course.teacher', function ($query) use ($user) {
							$query->where('id', '=', $user->id);
						});
					break;
				default:
					return Reply::error('app.errors.something_went_wrong', [], 500);
					break;
			}
			$data = $data
				->withCount($with_counts)
				->findOrFail($id);
			$result = [];
			$question_count = $data->questions()->count();
			$students = Course::findOrFail($data->course_id)->enrollments->pluck('user');

			foreach ($students as $student) {
				$is_submitted = ExamTracker::where('exam_id', '=', $id)
					->where('user_id', '=', $student->id)
					->exists();
				$correct_count = $is_submitted == true ? ExamTracker::where('exam_id', '=', $id)
					->where('user_id', '=', $student->id)
					->where('is_correct', '=', true)
					->count() : null;
				$result[] = [
					'student_id' => $student->id,
					'first_name' => $student->first_name,
					'last_name' => $student->last_name,
					'school_class_shortcode' => $student->school_class->shortcode,
					'gender' => $student->gender,
					'question_count' => $question_count,
					'correct_count' => $correct_count,
				];
			}
			$data->result = $result;
			return Reply::successWithData($data, '');
		} catch (\Exception $error) {
			Log::error($error->getMessage());
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.something_went_wrong', [], 500);
		}
	}

	public function update(UpdateRequest $request, string $id)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('exam_update'), 403);
		$data = collect($request->validated())->except(['supervisor_ids'])->toArray();

		DB::beginTransaction();
		try {
			$target_exam = Exam::select('*');
			switch ($user->role_id) {
				case Role::ROLES['teacher']:
					$target_exam = $target_exam->whereHas('course.teacher', function ($query) use ($user) {
						$query->where('id', '=', $user->id);
					})
						->findOrFail($id);
					break;
				case Role::ROLES['admin']:
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

				$supervisor_ids = User::where('role_id', '=', Role::ROLES['teacher'])
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
			Log::error($error->getMessage());
			DB::rollBack();
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.something_went_wrong', [], 500);
		}
	}

	public function destroy(string $id)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('exam_delete'), 403);

		DB::beginTransaction();
		try {
			$exam = Exam::select('*');
			switch ($user->role_id) {
				case Role::ROLES['teacher']:
					$exam = $exam->whereHas('course.teacher', function ($query) use ($user) {
						$query->where('id', '=', $user->id);
					})
						->findOrFail($id);
					break;
				case Role::ROLES['admin']:
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
			Log::error($error->getMessage());
			DB::rollBack();
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.something_went_wrong', [], 500);
		}
	}

	public function updateStatus(UpdateStatusRequest $request, string $id)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('exam_update'), 403);
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
					# code...
					break;
			}
			DB::commit();
			if ($request->status == 'start') return Reply::successWithMessage('app.successes.success');
			if ($request->status == 'cancel') return Reply::successWithMessage('app.successes.success');
		} catch (\Exception $error) {
			Log::error($error->getMessage());
			DB::rollBack();
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.something_went_wrong', [], 500);
		}
	}

	public function questions(string $id)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('exam_submit'), 403);
		$now = Carbon::now();

		DB::beginTransaction();
		try {
			$cache_key = str_replace(
				['@exam_id', '@user_id'],
				[$id, $user->id],
				$this->cacheKey
			);
			if (Cache::has($cache_key)) {
				return Reply::successWithData(Cache::get($cache_key), '');
			}

			$exam_questions_order = ExamQuestionsOrder::firstOrCreate([
				'exam_id' => $id,
				'user_id' => $user->id
			]);

			$data = Exam::with(['questions' => function ($query) use ($exam_questions_order) {
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
				->whereDoesntHave('exam_trackers', function ($query)  use ($user) {
					$query->where('user_id', '=', $user->id);
				})
				->whereNotNull('started_at')
				->whereNull('cancelled_at')
				->findOrFail($id);

			$exam_started_at = Carbon::parse($data->started_at);
			$exam_ended_at = $exam_started_at->copy()->addMinutes($data->exam_time);
			if ($now->lessThan($exam_started_at)) {
				return Reply::error('app.errors.exam_not_start');
			}
			if ($now->greaterThan($exam_ended_at)) {
				return Reply::error('app.errors.exam_has_end');
			}
			Cache::put($cache_key, $data, $exam_ended_at);
			DB::commit();
			return Reply::successWithData($data, '');
		} catch (\Exception $error) {
			Log::error($error->getMessage());
			DB::rollBack();
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.something_went_wrong', [], 500);
		}
	}

	public function submit(SubmitRequest $request, string $id)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('exam_submit'), 403);
		$now = Carbon::now();
		$answers = $request->answers;

		DB::beginTransaction();
		try {
			$cache_key = str_replace(
				['@exam_id', '@user_id'],
				[$id, $user->id],
				$this->cacheKey
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
				->whereDoesntHave('exam_trackers', function ($query)  use ($user) {
					$query->where('user_id', '=', $user->id);
				})
				->whereNotNull('started_at')
				->whereNull('cancelled_at')
				->findOrFail($id);

			$exam_date = Carbon::parse($exam->exam_date);
			$exam_end_date = $exam_date->copy()->addMinutes($exam->exam_time);

			if ($request->bypass_key != null && $exam->canBypassExamTime($request->bypass_key)) {
				$allow_late_submit = (int)env('ALLOW_LATE_SUBMIT', 120);
				$exam_end_date = $exam_end_date->addSeconds($allow_late_submit);
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
				ExamTracker::create([
					'user_id' => $user->id,
					'exam_id' => $exam->id,
					'question_id' => $question->pivot->id,
					'answer_id' => $answer_id,
					'is_correct' => $is_correct
				]);
			}
			$result_data = [
				'correct_count' => $correct_count,
				'question_count' => count($exam->questions)
			];
			Cache::forget($cache_key);
			DB::commit();
			return Reply::successWithData($result_data, '');
			return Reply::successWithMessage('app.successes.record_save_success');
		} catch (\Exception $error) {
			Log::error($error->getMessage());
			DB::rollBack();
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.something_went_wrong', [], 500);
		}
	}

	public function result(string $id)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('exam_view'), 403);

		try {
			$data = [];
			$exam = Exam::with('course.enrollments.user');
			switch ($user->role_id) {
				case Role::ROLES['admin']:
					break;
				case Role::ROLES['student']:
					$exam = $exam
						->whereHas('course.enrollments', function ($query) use ($user) {
							$query->where('student_id', '=', $user->id);
						});
					break;
				case Role::ROLES['teacher']:
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
				$is_submitted = ExamTracker::where('exam_id', '=', $id)
					->where('user_id', '=', $student->id)
					->exists();
				$correct_count = $is_submitted == true ? ExamTracker::where('exam_id', '=', $id)
					->where('user_id', '=', $student->id)
					->where('is_correct', '=', true)
					->count() : null;
				$data[] = [
					'first_name' => $student->first_name,
					'last_name' => $student->last_name,
					'school_class_shortcode' => $student->school_class->shortcode,
					'question_count' => $question_count,
					'correct_count' => $correct_count,
				];
			}
			return Reply::successWithData($data, '');
		} catch (\Exception $error) {
			Log::error($error->getMessage());
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.something_went_wrong', [], 500);
		}
	}
}
