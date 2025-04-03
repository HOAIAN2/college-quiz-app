<?php

namespace App\Http\Controllers\Api;

use App\Enums\PermissionType;
use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Http\Requests\DeleteRequest;
use App\Http\Requests\Faculty\IndexRequest;
use App\Http\Requests\Faculty\StoreRequest;
use App\Http\Requests\Faculty\UpdateRequest;
use App\Models\Faculty;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FacultyController extends Controller
{
    public function index(IndexRequest $request)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission(PermissionType::FACULTY_VIEW), 403);
        $validated = $request->validated();

        try {
            $faculties = Faculty::with([
                'leader'
            ])->latest('id');
            if (!empty($validated['search'])) {
                $faculties = $faculties->search($validated['search']);
            }
            $faculties = $faculties->paginate($validated['per_page']);
            return Reply::successWithData($faculties, '');
        } catch (\Exception $error) {
            return $this->handleException($error);
        }
    }

    public function store(StoreRequest $request)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission(PermissionType::FACULTY_CREATE), 403);
        $validated = $request->validated();
        DB::beginTransaction();

        try {
            Faculty::create($validated);
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
        abort_if(!$user->hasPermission(PermissionType::FACULTY_VIEW), 403);

        try {
            $data = Faculty::with([
                'leader'
            ])->findOrFail($id);
            return Reply::successWithData($data, '');
        } catch (\Exception $error) {
            return $this->handleException($error);
        }
    }

    public function update(UpdateRequest $request, string $id)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission(PermissionType::FACULTY_UPDATE), 403);
        $validated = $request->validated();
        DB::beginTransaction();

        try {
            $faculty = Faculty::findOrFail($id);
            $faculty->update($validated);
            DB::commit();
            return Reply::successWithMessage(trans('app.successes.record_save_success'));
        } catch (\Exception $error) {
            DB::rollBack();
            return $this->handleException($error);
        }
    }

    public function destroy(DeleteRequest $request)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission(PermissionType::FACULTY_DELETE), 403);
        $validated = $request->validated();
        DB::beginTransaction();

        try {
            Faculty::destroy($validated['ids']);
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
        abort_if(!$user->hasPermission(PermissionType::FACULTY_VIEW), 403);

        try {
            $school_classes = Faculty::search($request->input('search'))
                ->take($this->autoCompleteResultLimit)
                ->get();
            return Reply::successWithData($school_classes, '');
        } catch (\Exception $error) {
            return $this->handleException($error);
        }
    }
}
