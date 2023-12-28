<?php

namespace App\Http\Controllers\Api;

use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Models\SchoolClass;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SchoolClassController extends Controller
{
    public function index(Request $request)
    {
        // $user = $this->getUser();
        $school_classes = SchoolClass::withCount('students');
        try {
            if ($request->search != null) {
                $$school_classes = $school_classes->search($request->search);
            }
            $school_classes = $school_classes->paginate();
            return Reply::successWithData($school_classes, '');
        } catch (\Throwable $error) {
            Log::error($error->getMessage());
            if ($this->isDevelopment) return $error;
            return Reply::error('app.errors.serverError');
        }
    }
    public function store(Request $request)
    {
        //
    }
    public function show(string $id)
    {
        try {
            $data = SchoolClass::withCount('students')->find($id);
            return Reply::successWithData($data, '');
        } catch (\Throwable $error) {
            Log::error($error->getMessage());
            if ($this->isDevelopment) return $error;
            return Reply::error('app.errors.serverError');
        }
    }
    public function update(Request $request, string $id)
    {
        //
    }
    public function destroy(string $id)
    {
        //
    }
    public function autocomplete(Request $request)
    {
        $user = $this->getUser();
        if (!$user->isAdmin() && !$user->isTeacher()) return Reply::error('permission.errors.403');

        try {
            $school_classes = SchoolClass::search($request->search)->take(5)->get();
            return Reply::successWithData($school_classes, '');
        } catch (\Throwable $error) {
            Log::error($error->getMessage());
            if ($this->isDevelopment) return $error;
            return Reply::error('app.errors.serverError', [], 500);
        }
    }
}
