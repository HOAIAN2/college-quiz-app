<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'role_id' => Role::where('name', '=', 'admin')->first()->id,
            'shortcode' => 'SYSADMIN',
            'name' => 'Lê Hoài Ân',
            'email' => 'an69tm@gmail.com',
            'gender' => 'male',
            'address' => 'Hòa Trị, Phú Hòa, Phú Yên, Việt Nam',
            'birth_date' => '2003-02-22',
            'is_active' => true,
            'password' => Hash::make(123456789)
        ]);
    }
}
