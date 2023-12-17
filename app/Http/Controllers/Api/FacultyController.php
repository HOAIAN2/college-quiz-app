<?php

namespace App\Http\Controllers\Api;

use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Models\Faculty;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class FacultyController extends Controller
{
    public function __construct()
    {
        parent::__construct();
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            if ($request->search != null) {
                $data = Faculty::search($request->search);
            } else $data = Faculty::all();
            return Reply::successWithData($data, '');
        } catch (\Throwable $error) {
            $message = $error->getMessage();
            Log::error($message);
            if (env('APP_DEBUG') == true) return $error;
            return Reply::error('app.errors.serverError');
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $data = Faculty::with([
                'school_classes'
            ])->find($id);
            return Reply::successWithData($data, '');
        } catch (\Throwable $error) {
            $message = $error->getMessage();
            Log::error($message);
            if (env('APP_DEBUG') == true) return $error;
            return Reply::error('app.errors.serverError');
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}