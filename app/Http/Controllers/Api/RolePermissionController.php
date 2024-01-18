<?php

namespace App\Http\Controllers\Api;

use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class RolePermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = $this->getUser();
        if (!$user->hasPermission('permission_role_view')) return abort(403);

        try {
            $data = Role::withCount('permissions')
                ->where('name', '<>', 'admin')
                ->get();
            foreach ($data as $item) {
                $item->display_name = trans("role.{$item->name}");
            }
            return Reply::successWithData($data, '');
        } catch (\Throwable $error) {
            Log::error($error->getMessage());
            if ($this->isDevelopment) return Reply::error($error->getMessage());
            return Reply::error('app.errors.somethingWentWrong', [], 500);
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
        $user = $this->getUser();
        if (!$user->hasPermission('permission_role_view')) return abort(403);
        $data = (object)[];

        try {
            $data->role = Role::with('permissions')
                ->where('name', '<>', 'admin')
                ->find($id);
            $data->app_permissions = Permission::all();
            foreach ($data->app_permissions as $app_permission) {
                $app_permission->display_name = trans("permission.{$app_permission->name}");
            }
            return Reply::successWithData($data, '');
        } catch (\Throwable $error) {
            Log::error($error->getMessage());
            if ($this->isDevelopment) return Reply::error($error->getMessage());
            return Reply::error('app.errors.somethingWentWrong', [], 500);
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
