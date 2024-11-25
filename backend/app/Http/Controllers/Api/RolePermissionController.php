<?php

namespace App\Http\Controllers\Api;

use App\Enums\PermissionType;
use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Http\Requests\RolePermission\UpdateRequest;
use App\Models\Permission;
use App\Models\Role;
use App\Models\RolePermission;
use Illuminate\Support\Facades\DB;

class RolePermissionController extends Controller
{
    public $ignore_permissions = [
        'role_permission_view',
        'role_permission_grant',
    ];

    public function index()
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission(PermissionType::ROLE_PERMISSION_VIEW), 403);

        try {
            $data = Role::withCount('permissions')
                ->where('name', '<>', 'admin')
                ->get();
            foreach ($data as $item) {
                $item->display_name = trans("role.{$item->name}");
            }
            return Reply::successWithData($data, '');
        } catch (\Exception $error) {
            return $this->handleException($error);
        }
    }

    public function show(string $id)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission(PermissionType::ROLE_PERMISSION_VIEW), 403);
        $data = (object)[];

        try {
            $data->role = Role::with('permissions')
                ->where('name', '<>', 'admin')
                ->findOrFail($id);
            $data->app_permissions = Permission::whereNotIn('name', $this->ignore_permissions)
                ->get();
            foreach ($data->app_permissions as $app_permission) {
                $app_permission->display_name = trans("permission.{$app_permission->name}");
            }
            return Reply::successWithData($data, '');
        } catch (\Exception $error) {
            return $this->handleException($error);
        }
    }

    public function update(UpdateRequest $request, string $id)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission(PermissionType::ROLE_PERMISSION_GRANT), 403);

        DB::beginTransaction();
        try {
            $role = Role::where('name', '<>', 'admin')
                ->findOrFail($id);

            $permission_ids = Permission::whereIn('id', $request->ids)
                ->whereNotIn('name', $this->ignore_permissions)
                ->pluck('id')
                ->toArray();
            $role->permissions()->sync($permission_ids);
            DB::commit();
            return Reply::successWithMessage('app.successes.record_save_success');
        } catch (\Exception $error) {
            DB::rollBack();
            return $this->handleException($error);
        }
    }
}
