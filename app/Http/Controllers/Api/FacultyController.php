<?php

namespace App\Http\Controllers\Api;

use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Http\Requests\DeleteRequest;
use App\Http\Requests\Faculty\IndexRequest;
use App\Http\Requests\Faculty\StoreRequest;
use App\Http\Requests\Faculty\UpdateRequest;
use App\Models\Faculty;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class FacultyController extends Controller
{
	public function index(IndexRequest $request)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('faculty_view'), 403);

		$faculties = Faculty::with([
			'leader'
		])->latest('id');

		try {
			if ($request->search != null) {
				$faculties = $faculties->search($request->search);
			}
			$faculties = $faculties->paginate($request->per_page);
			return Reply::successWithData($faculties, '');
		} catch (\Exception $error) {
			Log::error($error->getMessage());
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.something_went_wrong');
		}
	}

	public function store(StoreRequest $request)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('faculty_create'), 403);
		$data = $request->validated();
		DB::beginTransaction();

		try {
			Faculty::create($data);
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
		abort_if(!$user->hasPermission('faculty_view'), 403);

		try {
			$data = Faculty::with([
				'leader'
			])->findOrFail($id);
			return Reply::successWithData($data, '');
		} catch (\Exception $error) {
			Log::error($error->getMessage());
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.something_went_wrong');
		}
	}

	public function update(UpdateRequest $request, string $id)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('faculty_update'), 403);
		$data = $request->validated();
		DB::beginTransaction();

		try {
			$faculty = Faculty::findOrFail($id);
			$faculty->update($data);
			DB::commit();
			return Reply::successWithMessage('app.successes.record_save_success');
		} catch (\Exception $error) {
			Log::error($error->getMessage());
			DB::rollBack();
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.something_went_wrong', [], 500);
		}
	}

	public function destroy(DeleteRequest $request)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('faculty_delete'), 403);
		DB::beginTransaction();

		try {
			Faculty::destroy($request->ids);
			DB::commit();
			return Reply::successWithMessage('app.successes.record_delete_success');
		} catch (\Exception $error) {
			Log::error($error->getMessage());
			DB::rollBack();
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.something_went_wrong', [], 500);
		}
	}
	public function autocomplete(Request $request)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('faculty_view'), 403);

		try {
			$school_classes = Faculty::search($request->search)->take($this->autoCompleteResultLimit)->get();
			return Reply::successWithData($school_classes, '');
		} catch (\Exception $error) {
			Log::error($error->getMessage());
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.something_went_wrong', [], 500);
		}
	}
}
