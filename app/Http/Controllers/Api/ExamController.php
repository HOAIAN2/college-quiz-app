<?php

namespace App\Http\Controllers\Api;

use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Http\Requests\Exam\StoreRequest;
use App\Models\Course;
use App\Models\Exam;
use App\Models\ExamQuestion;
use App\Models\Question;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ExamController extends Controller
{
	public function index()
	{
		//
	}

	public function store(StoreRequest $request)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('exam_create'), 403);

		DB::beginTransaction();
		try {
			$course = Course::findOrFail($request->course_id);
			if ($course->isOver()) {
				return Reply::error('app.errors.semesterEnd', [], 400);
			}

			$subject = $course->subject;
			$chapter_ids = $subject->chapters()
				->whereIn('id', $request->chapter_ids)
				->pluck('id');

			if (count($request->chapter_ids) != count($chapter_ids)) {
				return Reply::error('app.errors.failToSaveRecord', [], 500);
			}
			$exam = Exam::create([
				'course_id' => $request->course_id,
				'name' => $request->name,
				'exam_date' => Carbon::parse($request->exam_date),
				'exam_time' => $request->exam_time,
			]);
			foreach ($chapter_ids as $key => $chapter_id) {
				$question_ids = Question::where('subject_id', '=', $subject->id)
					->where('chapter_id', '=', $chapter_id)
					->inRandomOrder()
					->take($request->question_counts[$key])
					->pluck('id');
				if (count($question_ids) != $request->question_counts[$key]) {
					return Reply::error('app.errors.failToSaveRecord', [], 500);
				}
				foreach ($question_ids as $question_id) {
					ExamQuestion::create([
						'exam_id' => $exam->id,
						'question_id' => $question_id
					]);
				}
			}

			DB::commit();
			return Reply::successWithMessage('app.successes.recordSaveSuccess');
		} catch (\Throwable $error) {
			Log::error($error->getMessage());
			DB::rollBack();
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.failToSaveRecord', [], 500);
		}
	}

	public function show(string $id)
	{
		//
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
