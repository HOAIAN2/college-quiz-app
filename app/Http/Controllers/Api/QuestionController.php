<?php

namespace App\Http\Controllers\Api;

use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Http\Requests\Question\IndexRequest;
use App\Http\Requests\Question\StoreRequest;
use App\Http\Requests\Question\UpdateRequest;
use App\Models\Question;
use App\Models\QuestionOption;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class QuestionController extends Controller
{
	public function index(IndexRequest $request)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('question_view'), 403);

		try {
			$data = Question::where('subject_id', '=', $request->subject_id);
			if ($request->chapter_id != null) {
				$data = $data->where('chapter_id', '=', $request->chapter_id);
			}
			if ($request->search != null) {
				$data = $data->search($request->search);
			}
			return Reply::successWithData($data->get(), '');
		} catch (\Exception $error) {
			Log::error($error->getMessage());
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.something_went_wrong', [], 500);
		}
	}

	public function store(StoreRequest $request)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('question_create'), 403);

		$question_data = collect($request->validated())->except([
			'options',
			'true_option'
		])->toArray();
		$question_data['created_by'] = $user->id;

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
		abort_if(!$user->hasPermission('question_view'), 403);

		try {
			$data = Question::with(['question_options'])->findOrFail($id);
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
		abort_if(!$user->hasPermission('question_update'), 403);
		$data = collect($request->validated())
			->except([
				'options',
				'true_option',
			])->toArray();
		$data['last_updated_by'] = $user->id;

		DB::beginTransaction();
		try {
			$targetQuestion = Question::findOrFail($id);
			$targetQuestion->update($data);
			$question_options = $targetQuestion->question_options;

			foreach ($question_options as $key => $option) {
				$option->update([
					'content' => $request->options[$key],
					'is_correct' => $request->true_option == $key
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

	public function destroy(string $id)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('question_delete'), 403);

		DB::beginTransaction();
		try {
			Question::destroy($id);
			DB::commit();
			return Reply::successWithMessage('app.successes.record_delete_success');
		} catch (\Exception $error) {
			Log::error($error->getMessage());
			DB::rollBack();
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.something_went_wrong', [], 500);
		}
	}
}
