<?php

namespace App\Http\Controllers\Api;

use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Http\Requests\Question\GetAllRequest;
use App\Http\Requests\Question\StoreRequest;
use App\Models\Question;
use App\Models\QuestionOption;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class QuestionController extends Controller
{
	/**
	 * Display a listing of the resource.
	 */
	public function index(GetAllRequest $request)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('question_view'), 403);

		try {
			$data = Question::with(['question_options'])
				->where('subject_id', '=', $request->subject_id);
			if ($request->chapter_id != null) {
				$data = $data->where('chapter_id', '=', $request->chapter_id);
			}
			if ($request->search != null) {
				$data = $data->search($request->search);
			}
			return Reply::successWithData($data->get());
		} catch (\Throwable $error) {
			Log::error($error->getMessage());
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.somethingWentWrong', [], 500);
		}
	}

	/**
	 * Store a newly created resource in storage.
	 */
	public function store(StoreRequest $request)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('question_create'), 403);

		$question_data = collect($request->validated())->except([
			'options',
			'true_option'
		])->toArray();

		DB::beginTransaction();
		try {
			$question_options = $request->options;
			# Save question
			$question = Question::create($question_data);
			# Save question options
			foreach ($question_options as $key => $value) {
				QuestionOption::create([
					'question_id' => $question->id,
					'content' => $value,
					'is_correct' => $request->true_option == $key
				]);
			}
			DB::commit();
			return Reply::successWithMessage('app.successes.recordSaveSuccess');
		} catch (\Throwable $error) {
			Log::error($error->getMessage());
			DB::rollBack();
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.somethingWentWrong', [], 500);
		}
	}

	/**
	 * Display the specified resource.
	 */
	public function show(string $id)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('question_view'), 403);

		try {
			$data = Question::with(['question_options'])->findOrFail($id);
			return Reply::successWithData($data);
		} catch (\Throwable $error) {
			Log::error($error->getMessage());
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.somethingWentWrong', [], 500);
		}
	}

	/**
	 * Update the specified resource in storage.
	 */
	public function update(Request $request, string $id)
	{
		return $id;
	}

	/**
	 * Remove the specified resource from storage.
	 */
	public function destroy(string $id)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('question_delete'), 403);

		DB::beginTransaction();
		try {
			Question::destroy($id);
			DB::commit();
			return Reply::successWithMessage('app.successes.recordDeleteSuccess');
		} catch (\Throwable $error) {
			Log::error($error->getMessage());
			DB::rollBack();
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.somethingWentWrong', [], 500);
		}
	}
}
