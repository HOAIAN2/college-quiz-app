<?php

namespace App\Http\Controllers\Api;

use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Http\Requests\Subject\StoreRequest;
use App\Http\Requests\Subject\UpdateRequest;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SubjectController extends Controller
{
	public function index(Request $request)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('subject_view'), 403);

		$subjects = Subject::select('*');

		try {
			if ($request->search != null) {
				$subjects = $subjects->whereFullText(Subject::FULLTEXT, $request->search);
			}
			$subjects = $subjects
				->limit($this->defaultLimit)
				->get();
			return Reply::successWithData($subjects, '');
		} catch (\Exception $error) {
			return $this->handleException($error);
		}
	}

	public function store(StoreRequest $request)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('subject_create'), 403);

		DB::beginTransaction();
		try {
			Subject::create($request->validated());
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
		abort_if(!$user->hasPermission('subject_view'), 403);

		try {
			$subject = Subject::with([
				'chapters' => function ($query) {
					$query->withCount(['questions']);
				}
			])->findOrFail($id);
			return Reply::successWithData($subject, '');
		} catch (\Exception $error) {
			return $this->handleException($error);
		}
	}

	public function update(UpdateRequest $request, string $id)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('subject_update'), 403);

		DB::beginTransaction();
		try {
			$subject = Subject::findOrFail($id);
			$subject->update($request->validated());
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
		abort_if(!$user->hasPermission('subject_delete'), 403);

		DB::beginTransaction();
		try {
			Subject::destroy($id);
			DB::commit();
			return Reply::successWithMessage('app.successes.record_delete_success');
		} catch (\Exception $error) {
			DB::rollBack();
			return $this->handleException($error);
		}
	}

	public function autocomplete(Request $request)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('subject_view'), 403);

		try {
			$users = Subject::search($request->search)
				->take($this->autoCompleteResultLimit)
				->get();
			return Reply::successWithData($users, '');
		} catch (\Exception $error) {
			return $this->handleException($error);
		}
	}
}
