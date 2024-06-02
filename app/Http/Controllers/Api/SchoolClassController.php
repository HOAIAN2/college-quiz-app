<?php

namespace App\Http\Controllers\Api;

use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Http\Requests\DeleteRequest;
use App\Http\Requests\SchoolClass\IndexRequest;
use App\Http\Requests\SchoolClass\StoreRequest;
use App\Http\Requests\SchoolClass\UpdateRequest;
use App\Models\SchoolClass;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SchoolClassController extends Controller
{
	public function index(IndexRequest $request)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('school_class_view'), 403);

		$school_classes = SchoolClass::with(['faculty'])->latest('id');

		try {
			if ($request->search != null) {
				$school_classes = $school_classes->search($request->search);
			}
			$school_classes = $school_classes->paginate($request->per_page);
			return Reply::successWithData($school_classes, '');
		} catch (\Exception $error) {
			Log::error($error->getMessage());
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.something_went_wrong');
		}
	}

	public function store(StoreRequest $request)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('school_class_create'), 403);
		$data = $request->validated();

		DB::beginTransaction();
		try {
			SchoolClass::create($data);
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
		abort_if(!$user->hasPermission('school_class_view'), 403);

		try {
			$data = SchoolClass::with(['faculty'])->findOrFail($id);
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
		abort_if(!$user->hasPermission('school_class_update'), 403);
		$data = $request->validated();

		DB::beginTransaction();
		try {
			$school_class = SchoolClass::findOrFail($id);
			$school_class->update($data);
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
		abort_if(!$user->hasPermission('school_class_delete'), 403);
		DB::beginTransaction();

		try {
			SchoolClass::destroy($request->ids);
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
		abort_if(!$user->hasPermission('school_class_view'), 403);

		try {
			$school_classes = SchoolClass::search($request->search)->take($this->autoCompleteResultLimit)->get();
			return Reply::successWithData($school_classes, '');
		} catch (\Exception $error) {
			Log::error($error->getMessage());
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.something_went_wrong', [], 500);
		}
	}
}
