<?php

namespace App\Http\Controllers\Api;

use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Http\Requests\Semester\StoreRequest;
use App\Models\Semester;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SemesterController extends Controller
{
	/**
	 * Display a listing of the resource.
	 */
	public function index(Request $request)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('semester_view'), 403);

		try {
			$data = Semester::select('*');
			if ($request->search != null) {
				$data = $data->search($request->search);
			}
			$data = $data->latest('id')->get();
			return Reply::successWithData($data, '');
		} catch (\Throwable $error) {
			Log::error($error->getMessage());
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.somethingWentWrong', [], 500);
		}
		return Reply::successWithData($data, '');
	}

	/**
	 * Store a newly created resource in storage.
	 */
	public function store(StoreRequest $request)
	{

		$user = $this->getUser();
		abort_if(!$user->hasPermission('semester_create'), 403);
		$data = $request->validated();
		$data['start_date'] = Carbon::parse($request->start_date);
		$data['end_date'] = Carbon::parse($request->end_date);

		DB::beginTransaction();
		try {
			Semester::create($data);
			DB::commit();
			return Reply::successWithMessage('app.successes.recordSaveSuccess');
		} catch (\Throwable $error) {
			Log::error($error->getMessage());
			DB::rollBack();
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.failToSaveRecord', [], 500);
		}
	}

	/**
	 * Display the specified resource.
	 */
	public function show(string $id)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('semester_view'), 403);

		try {
			$semester = Semester::with(['courses'])->findOrFail($id);
			return Reply::successWithData($semester, '');
		} catch (\Throwable $error) {
			Log::error($error->getMessage());
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.failToSaveRecord', [], 500);
		}
	}

	/**
	 * Update the specified resource in storage.
	 */
	public function update(StoreRequest $request, string $id)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('semester_update'), 403);

		DB::beginTransaction();
		try {
			$semester = Semester::findOrFail($id);
			$semester->update($request->validated());
			DB::commit();
			return Reply::successWithMessage('app.successes.recordSaveSuccess');
		} catch (\Throwable $error) {
			Log::error($error->getMessage());
			DB::rollBack();
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.failToSaveRecord', [], 500);
		}
	}

	/**
	 * Remove the specified resource from storage.
	 */
	public function destroy(string $id)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('semester_delete'), 403);

		DB::beginTransaction();
		try {
			Semester::destroy($id);
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
