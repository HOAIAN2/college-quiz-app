<?php

namespace App\Http\Controllers\Api;

use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Http\Requests\Exam\StoreRequest;
use App\Models\Chapter;
use App\Models\Course;
use App\Models\Exam;
use App\Models\ExamQuestion;
use App\Models\Question;
use App\Models\Role;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ExamController extends Controller
{
	public function index()
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('exam_view'), 403);

		try {
			switch ($user->role_id) {
				case Role::ROLES['admin']:
					# code...
					break;
				case Role::ROLES['student']:
					# code...
					break;
				case Role::ROLES['teacher']:
					# code...
					break;
				default:
					# code...
					break;
			}
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
			if ($course->isOver()) {
				return Reply::error('app.errors.semester_end', [], 400);
			}
			$chapters = Chapter::withCount('questions')
				->where('subject_id', '=', $course->subject_id)
				->orderBy('chapter_number')
				->get();
			$exam = Exam::create([
				'course_id' => $request->course_id,
				'name' => $request->name,
				'exam_date' => Carbon::parse($request->exam_date),
				'exam_time' => $request->exam_time,
			]);
			foreach ($chapters as $key => $chapter) {
				if (!(bool)$request->question_counts[$key]) {
					continue;
				}
				$question_ids = Question::where('subject_id', '=', $course->subject_id)
					->where('chapter_id', '=', $chapter->id)
					->inRandomOrder()
					->take($request->question_counts[$key])
					->pluck('id');
				if (count($question_ids) != $request->question_counts[$key]) {
					return Reply::error('app.errors.max_chapter_question_count', [
						'name' => $chapter->name,
						'number' => $chapter->questions_count
					], 400);
				}
				foreach ($question_ids as $question_id) {
					ExamQuestion::create([
						'exam_id' => $exam->id,
						'question_id' => $question_id
					]);
				}
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
		$now = Carbon::now();

		try {
			$relations = [];
			switch ($user->role_id) {
				case Role::ROLES['admin']:
					# code...
					break;
				case Role::ROLES['student']:
					# code...
					break;
				case Role::ROLES['teacher']:
					$relations[] = '';
					# code...
					break;
				default:
					# code...
					break;
			}
		} catch (\Throwable $error) {
			Log::error($error->getMessage());
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.something_went_wrong', [], 500);
		}
	}

	public function update(Request $request, string $id)
	{
		//
	}

	public function destroy(string $id)
	{
		//
	}
}
