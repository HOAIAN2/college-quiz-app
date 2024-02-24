<?php

namespace App\Http\Controllers\Api;

use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Http\Requests\QuestionOption\StoreRequest;
use App\Models\QuestionOption;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class QuestionOptionController extends Controller
{
	public function store(StoreRequest $request)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('question_update'), 403);

		DB::beginTransaction();
		try {
			if ($request->is_correct == 1) {
				QuestionOption::where('question_id', '=', $request->question_id)->update([
					'is_correct' => false
				]);
			}
			QuestionOption::create($request->validated());
			DB::commit();
			return Reply::successWithMessage('app.successes.recordSaveSuccess');
		} catch (\Throwable $error) {
			Log::error($error->getMessage());
			DB::rollBack();
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.somethingWentWrong', [], 500);
		}
	}

	public function update(Request $request, string $id)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('question_update'), 403);
		$data = $request->validated();

		DB::beginTransaction();
		try {
			$targetQuestionOption = QuestionOption::findOrFail($id);

			if ($request->is_correct == 1) {
				QuestionOption::where('question_id', '=', $targetQuestionOption->question_id)
					->update([
						'is_correct' => false
					]);
			}
			$targetQuestionOption->update($data);
			DB::commit();
			return Reply::successWithMessage('app.successes.recordSaveSuccess');
		} catch (\Throwable $error) {
			Log::error($error->getMessage());
			DB::rollBack();
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.somethingWentWrong', [], 500);
		}
	}

	public function destroy(string $id)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('question_update'), 403);

		DB::beginTransaction();
		try {
			QuestionOption::destroy($id);
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
