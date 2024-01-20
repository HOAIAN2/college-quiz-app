<?php

namespace App\Http\Controllers\Api;

use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Http\Requests\RolePermission\UpdateRequest;
use App\Models\Permission;
use App\Models\Role;
use App\Models\RolePermission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
                ->findOrFail($id);
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
    public function update(UpdateRequest $request, string $id)
    {
        $user = $this->getUser();
        if (!$user->hasPermission('permission_role_grant')) return abort(403);

        DB::beginTransaction();
        try {
            $role = Role::with('permissions')
                ->where('name', '<>', 'admin')
                ->findOrFail($id);

            if ($request->ids == null) {
                RolePermission::where('role_id', '=', $role->id)
                    ->delete();
            } else {
                $will_be_deleted_permission_ids = $role->permissions()
                    ->whereNotIn('id', $request->ids)->pluck('id');

                RolePermission::where('role_id', '=', $role->id)
                    ->whereIn('permission_id', $will_be_deleted_permission_ids)
                    ->delete();

                $existing_permission_ids = $role->permissions()
                    ->whereIn('id', $request->ids)->pluck('id')->toArray();

                $permission_ids = Permission::whereIn('id', $request->ids)
                    ->pluck('id');

                foreach ($permission_ids as $permission_id) {
                    if (in_array($permission_id, $existing_permission_ids)) continue;
                    RolePermission::create([
                        'role_id' => $role->id,
                        'permission_id' => $permission_id
                    ]);
                }
            }
            DB::commit();
            return Reply::successWithMessage('app.successes.recordSaveSuccess');
        } catch (\Throwable $error) {
            Log::error($error->getMessage());
            DB::rollBack();
            if ($this->isDevelopment) return Reply::error($error->getMessage());
            return Reply::error('app.errors.somethingWentWrong', [], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
