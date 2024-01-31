<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\RolePermission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
	/**
	 * Run the database seeds.
	 */
	public function run(): void
	{
		$admin_permission_ids = Permission::pluck('id');
		foreach ($admin_permission_ids as $admin_permission_id) {
			RolePermission::create([
				'role_id' => Role::ROLES['admin'],
				'permission_id' => $admin_permission_id
			]);
		};
	}
}
