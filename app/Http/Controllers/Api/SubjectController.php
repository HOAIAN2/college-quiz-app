<?php

namespace App\Http\Controllers\Api;

use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Http\Requests\Subject\DeleteRequest;
use App\Http\Requests\Subject\GetAllRequest;
use App\Http\Requests\Subject\StoreRequest;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SubjectController extends Controller
{
    public function index(GetAllRequest $request)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission('subject_view'), 403);

        $subjects = Subject::withCount(['chapters', 'courses']);

        try {
            if ($request->search != null) {
                $subjects = $subjects->search($request->search);
            }
            $subjects = $subjects->paginate();
            return Reply::successWithData($subjects, '');
        } catch (\Throwable $error) {
            Log::error($error->getMessage());
            if ($this->isDevelopment) return Reply::error($error->getMessage());
            return Reply::error('app.errors.failToSaveRecord');
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
            return Reply::successWithMessage('app.successes.recordSaveSuccess');
        } catch (\Throwable $error) {
            Log::error($error->getMessage());
            DB::rollBack();
            if ($this->isDevelopment) return Reply::error($error->getMessage());
            return Reply::error('app.errors.failToSaveRecord');
        }
    }

    public function show(string $id)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission('subject_view'), 403);

        try {
            $subject = Subject::with(['chapters', 'courses'])->findOrFail($id);
            return Reply::successWithData($subject, '');
        } catch (\Throwable $error) {
            Log::error($error->getMessage());
            if ($this->isDevelopment) return Reply::error($error->getMessage());
            return Reply::error('app.errors.failToSaveRecord');
        }
    }

    public function update(Request $request, string $id)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission('subject_update'), 403);

        DB::beginTransaction();
        try {
            $subject = Subject::findOrFail($id);
            $subject->update($request->validated());
            DB::commit();
            return Reply::successWithMessage('app.successes.recordSaveSuccess');
        } catch (\Throwable $error) {
            Log::error($error->getMessage());
            DB::rollBack();
            if ($this->isDevelopment) return Reply::error($error->getMessage());
            return Reply::error('app.errors.failToSaveRecord');
        }
    }

    public function destroy(DeleteRequest $request)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission('subject_delete'), 403);

        DB::beginTransaction();
        try {
            Subject::destroy($request->ids);
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
