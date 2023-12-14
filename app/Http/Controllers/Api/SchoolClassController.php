<?php

namespace App\Http\Controllers\Api;

use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Models\SchoolClass;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SchoolClassController extends Controller
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
        // $user = $this->getUser();
        try {
            if ($request->search != null) {
                $data = SchoolClass::search($request->search);
            } else $data = SchoolClass::all();
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
            $data = SchoolClass::withCount('students')->find($id);
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
