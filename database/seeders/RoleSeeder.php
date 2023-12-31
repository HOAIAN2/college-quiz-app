<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => 'admin',
                'display_name' => 'Quản trị viên',
            ],
            [
                'name' => 'teacher',
                'display_name' => 'Giáo viên',
            ],
            [
                'name' => 'student',
                'display_name' => 'Học sinh',
            ]
        ];
        foreach ($roles as $role) {
            Role::create($role);
        }
    }
}
