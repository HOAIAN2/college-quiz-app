<?php

namespace App\Http\Controllers\Api;

use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Models\Faculty;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class FacultyController extends Controller
{
    public function index(Request $request)
    {
        try {
            if ($request->search != null) {
                $data = Faculty::withCount([
                    'school_classes',
                    'users'
                ])->search($request->search);
            } else $data = Faculty::withCount([
                'school_classes',
                'users'
            ])->get();
            return Reply::successWithData($data, '');
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
            $data = Faculty::with([
                'school_classes'
            ])->find($id);
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
}
