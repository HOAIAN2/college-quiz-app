<?php

namespace App\Http\Controllers\Api;

use App\Enums\PermissionType;
use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Http\Requests\Semester\StoreRequest;
use App\Models\Semester;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SemesterController extends Controller
{
    public function index(Request $request)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission(PermissionType::SEMESTER_VIEW), 403);

        try {
            $data = Semester::select('*');
            if ($request->input('search') != null) {
                $data = $data->search($request->input('search'));
            }
            $data = $data
                ->limit($this->defaultLimit)
                ->latest('id')
                ->get();
            return Reply::successWithData($data, '');
        } catch (\Exception $error) {
            return $this->handleException($error);
        }
    }

    public function store(StoreRequest $request)
    {

        $user = $this->getUser();
        abort_if(!$user->hasPermission(PermissionType::SEMESTER_CREATE), 403);
        $validated = $request->validated();

        DB::beginTransaction();
        try {
            Semester::create($validated);
            DB::commit();
            return Reply::successWithMessage(trans('app.successes.record_save_success'));
        } catch (\Exception $error) {
            DB::rollBack();
            return $this->handleException($error);
        }
    }

    public function show(string $id)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission(PermissionType::SEMESTER_VIEW), 403);

        try {
            $semester = Semester::findOrFail($id);
            return Reply::successWithData($semester, '');
        } catch (\Exception $error) {
            return $this->handleException($error);
        }
    }

    public function update(StoreRequest $request, string $id)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission(PermissionType::SEMESTER_UPDATE), 403);
        $validated = $request->validated();

        DB::beginTransaction();
        try {
            $semester = Semester::findOrFail($id);
            $semester->update($validated);
            DB::commit();
            return Reply::successWithMessage(trans('app.successes.record_save_success'));
        } catch (\Exception $error) {
            DB::rollBack();
            return $this->handleException($error);
        }
    }

    public function destroy(string $id)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission(PermissionType::SEMESTER_DELETE), 403);

        DB::beginTransaction();
        try {
            Semester::destroy($id);
            DB::commit();
            return Reply::successWithMessage(trans('app.successes.record_delete_success'));
        } catch (\Exception $error) {
            DB::rollBack();
            return $this->handleException($error);
        }
    }

    public function autocomplete(Request $request)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission(PermissionType::SEMESTER_VIEW), 403);

        try {
            $semesters = Semester::where('end_date', '>=', Carbon::now())
                ->search($request->input('search'))
                ->take($this->autoCompleteResultLimit)
                ->get();
            return Reply::successWithData($semesters, '');
        } catch (\Exception $error) {
            return $this->handleException($error);
        }
    }
}
