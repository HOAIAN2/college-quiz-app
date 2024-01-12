<?php

namespace App\Http\Controllers\Api;

use App\Helper\Reply;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class RolePermissionController extends Controller
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
    public function store(Request $request)
    {
        //
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function navBarFeatures()
    {
        $user = $this->getUser();
        try {
            $data = $user->role->permissions()
                ->where('name', 'like', '%view')
                ->pluck('name');
            return Reply::successWithData($data, '');
        } catch (\Throwable $error) {
            Log::error($error->getMessage());
            if ($this->isDevelopment) return Reply::error($error->getMessage());
            return Reply::error('app.errors.somethingWentWrong', [], 500);
        }
    }
}
