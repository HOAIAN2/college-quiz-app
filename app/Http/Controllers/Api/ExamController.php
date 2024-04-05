<?php

namespace App\Http\Controllers\Api;

use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Http\Requests\Exam\GetAllRequest;
use App\Http\Requests\Exam\StoreRequest;
use App\Http\Requests\Exam\UpdateRequest;
use App\Models\Chapter;
use App\Models\Course;
use App\Models\Exam;
use App\Models\ExamQuestion;
use App\Models\Question;
use App\Models\Role;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ExamController extends Controller
{
	public $cacheKey = 'exam:@exam_id:-user:@user_id';
	public function index(GetAllRequest $request)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('exam_view'), 403);
		$now = Carbon::now();
		$relations = [
			'course',
			'course.subject',
			// 'course.teacher',
		];
		$step = $request->step;

		try {
			switch ($user->role_id) {
				case Role::ROLES['admin']:
					$data = Exam::with($relations)
						->withCount(['questions'])
						->whereBetween('exam_date', [
							$now,
							$step == 'month' ? $now->copy()->addMonth() : $now->copy()->addWeek()
						])
						->get();
					break;
				case Role::ROLES['student']:
					$data = Exam::with($relations)
						->withCount(['questions'])
						->whereHas('course.enrollments', function ($query) use ($user) {
							$query->where('student_id', '=', $user->id);
						})->whereBetween('exam_date', [
							$now,
							$step == 'month' ? $now->copy()->addMonth() : $now->copy()->addWeek()
						])
						->get();
					break;
				case Role::ROLES['teacher']:
					$data = Exam::with($relations)
						->withCount(['questions'])
						->whereHas('course.teacher', function ($query) use ($user) {
							$query->where('id', '=', $user->id);
						})->whereBetween('exam_date', [
							$now,
							$step == 'month' ? $now->copy()->addMonth() : $now->copy()->addWeek()
						])
						->get();
					break;
				default:
					return Reply::error('app.errors.something_went_wrong', [], 500);
					break;
			}
			return Reply::successWithData($data, '');
		} catch (\Throwable $error) {
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
			$course = Course::findOrFail($request->course_id);
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
				if (!(bool)$request->question_counts[$key]) {
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
			DB::commit();
			return Reply::successWithMessage('app.successes.record_save_success');
		} catch (\Throwable $error) {
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
			'course',
			'course.subject',
			// 'course.teacher',
		];

		try {
			switch ($user->role_id) {
				case Role::ROLES['admin']:
					$data = Exam::with($relations)
						->withCount(['questions'])
						->findOrFail($id);
					break;
				case Role::ROLES['student']:
					$data = Exam::with($relations)
						->withCount(['questions'])
						->whereHas('course.enrollments', function ($query) use ($user) {
							$query->where('student_id', '=', $user->id);
						})
						->findOrFail($id);
					break;
				case Role::ROLES['teacher']:
					$data = Exam::with($relations)
						->withCount(['questions'])
						->whereHas('course.teacher', function ($query) use ($user) {
							$query->where('id', '=', $user->id);
						})
						->findOrFail($id);
					break;
				default:
					return Reply::error('app.errors.something_went_wrong', [], 500);
					break;
			}
			return Reply::successWithData($data, '');
		} catch (\Throwable $error) {
			Log::error($error->getMessage());
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.something_went_wrong', [], 500);
		}
	}

	public function update(UpdateRequest $request, string $id)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('exam_update'), 403);

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
			$exam_date = Carbon::parse($target_exam->exam_date);
			if (Carbon::now()->greaterThan($exam_date)) {
				return Reply::error('app.errors.exam_has_end');
			}
			$target_exam->update($request->validated());
			DB::commit();
		} catch (\Throwable $error) {
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
			$exam_date = Carbon::parse($exam->exam_date);
			if (Carbon::now()->greaterThan($exam_date)) {
				return Reply::error('app.errors.exam_has_end');
			}
			$exam_date->delete();
			DB::commit();
			return Reply::successWithMessage('app.successes.record_delete_success');
		} catch (\Throwable $error) {
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

		try {
			$cache_key = str_replace(
				['@exam_id', '@user_id'],
				[$id, $user->id],
				$this->cacheKey
			);
			if (Cache::has($cache_key)) {
				return Reply::successWithData(Cache::get($cache_key));
			}
			$data = Exam::with(['questions' => function ($query) {
				$query
					// ->select('id', 'content')
					->with(['question_options' => function ($query) {
						$query->select('id', 'question_id', 'content');
					}])
					->inRandomOrder();
			}])
				->whereHas('course.enrollments', function ($query) use ($user) {
					$query->where('student_id', '=', $user->id);
				})
				->findOrFail($id);

			$exam_date = Carbon::parse($data->exam_date);
			$exam_end_date = $exam_date->copy()->addMinutes($data->exam_time);
			if ($now->lessThan($exam_date)) {
				return Reply::error('app.errors.exam_not_start');
			}
			if ($now->greaterThan($exam_end_date)) {
				return Reply::error('app.errors.exam_has_end');
			}
			Cache::put($cache_key, $data, $exam_end_date);
			return Reply::successWithData($data, '');
		} catch (\Throwable $error) {
			Log::error($error->getMessage());
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.something_went_wrong', [], 500);
		}
	}
}
