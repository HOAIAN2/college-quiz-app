<?php

namespace App\Http\Controllers\Api;

use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Http\Requests\Chapter\StoreRequest;
use App\Http\Requests\Chapter\UpdateRequest;
use App\Models\Chapter;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ChapterController extends Controller
{
	public function store(StoreRequest $request)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('subject_create'), 403);

		DB::beginTransaction();
		try {
			Chapter::create($request->validated());
			DB::commit();
			return Reply::successWithMessage('app.successes.record_save_success');
		} catch (\Exception $error) {
			Log::error($error->getMessage());
			DB::rollBack();
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.something_went_wrong', [], 500);
		}
	}

	public function update(UpdateRequest $request, string $id)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('subject_update'), 403);

		DB::beginTransaction();
		try {
			$chapter = Chapter::findOrFail($id);
			$chapter->update($request->validated());
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
		abort_if(!$user->hasPermission('subject_delete'), 403);

		DB::beginTransaction();
		try {
			Chapter::destroy($id);
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
