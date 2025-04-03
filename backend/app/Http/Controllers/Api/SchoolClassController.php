<?php

namespace App\Http\Controllers\Api;

use App\Enums\PermissionType;
use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Http\Requests\DeleteRequest;
use App\Http\Requests\SchoolClass\IndexRequest;
use App\Http\Requests\SchoolClass\StoreRequest;
use App\Http\Requests\SchoolClass\UpdateRequest;
use App\Models\SchoolClass;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SchoolClassController extends Controller
{
    public function index(IndexRequest $request)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission(PermissionType::SCHOOL_CLASS_VIEW), 403);
        $validated = $request->validated();

        $school_classes = SchoolClass::with(['faculty'])->latest('id');

        try {
            if (!empty($validated['search'])) {
                $school_classes = $school_classes->search($validated['search']);
            }
            $school_classes = $school_classes->paginate($validated['per_page']);
            return Reply::successWithData($school_classes, '');
        } catch (\Exception $error) {
            return $this->handleException($error);
        }
    }

    public function store(StoreRequest $request)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission(PermissionType::SCHOOL_CLASS_CREATE), 403);
        $data = $request->validated();

        DB::beginTransaction();
        try {
            SchoolClass::create($data);
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
        abort_if(!$user->hasPermission(PermissionType::SCHOOL_CLASS_VIEW), 403);

        try {
            $data = SchoolClass::with(['faculty'])->findOrFail($id);
            return Reply::successWithData($data, '');
        } catch (\Exception $error) {
            return $this->handleException($error);
        }
    }

    public function update(UpdateRequest $request, string $id)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission(PermissionType::SCHOOL_CLASS_UPDATE), 403);
        $data = $request->validated();

        DB::beginTransaction();
        try {
            $school_class = SchoolClass::findOrFail($id);
            $school_class->update($data);
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
        abort_if(!$user->hasPermission(PermissionType::SCHOOL_CLASS_DELETE), 403);
        $validated = $request->validated();
        DB::beginTransaction();

        try {
            SchoolClass::destroy($validated['ids']);
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
        abort_if(!$user->hasPermission(PermissionType::SCHOOL_CLASS_VIEW), 403);

        try {
            $school_classes = SchoolClass::search($request->input('search'))
                ->take($this->autoCompleteResultLimit)
                ->get();
            return Reply::successWithData($school_classes, '');
        } catch (\Exception $error) {
            return $this->handleException($error);
        }
    }
}
