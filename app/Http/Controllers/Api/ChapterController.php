<?php

namespace App\Http\Controllers\Api;

use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Http\Requests\Chapter\DeleteRequest;
use App\Http\Requests\Chapter\StoreRequest;
use App\Models\Chapter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ChapterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        $user = $this->getUser();
        if (!$user->isAdmin()) return Reply::error('permission.errors.403');

        DB::beginTransaction();
        try {
            Chapter::create($request->validated());
            DB::commit();
            return Reply::successWithMessage('app.successes.recordSaveSuccess');
        } catch (\Throwable $error) {
            Log::error($error->getMessage());
            DB::rollBack();
            if ($this->isDevelopment) return $error;
            return Reply::error('app.errors.serverError', [], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = $this->getUser();
        if (!$user->isAdmin()) return Reply::error('permission.errors.403');

        DB::beginTransaction();
        try {
            $chapter = Chapter::findOrFail($id);
            $chapter->update($request->validated());
            DB::commit();
            return Reply::successWithMessage('app.successes.recordSaveSuccess');
        } catch (\Throwable $error) {
            Log::error($error->getMessage());
            DB::rollBack();
            if ($this->isDevelopment) return $error;
            return Reply::error('app.errors.serverError', [], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DeleteRequest $request)
    {
        $user = $this->getUser();
        if (!$user->isAdmin()) return Reply::error('permission.errors.403');

        DB::beginTransaction();
        try {
            Chapter::destroy($request->ids);
            DB::commit();
            return Reply::successWithMessage('app.successes.recordDeleteSuccess');
        } catch (\Throwable $error) {
            Log::error($error->getMessage());
            DB::rollBack();
            if ($this->isDevelopment) return $error;
            return Reply::error('app.errors.serverError', [], 500);
        }
    }
}
