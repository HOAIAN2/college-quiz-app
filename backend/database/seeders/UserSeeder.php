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
		$first_name = $this->command->ask('What is the user\'s first name?');
		$last_name = $this->command->ask('What is the user\'s last name?');
		$email = $this->command->ask('What is the user\'s email?');
		$birth_date = $this->command->ask('What is the user\'s birth date? (YYYY-MM-DD)');
		$gender = $this->command->choice('What is the user\'s gender?', ['male', 'female']);
		$address = $this->command->ask('What is the user\'s address?');
		$password = $this->command->secret('What is the user\'s password?');

		User::create([
			'role_id' => Role::where('name', '=', 'admin')->first()->id,
			'shortcode' => 'SYSADMIN',
			'first_name' => $first_name,
			'last_name' => $last_name,
			'email' => $email,
			'gender' => $gender,
			'address' => $address,
			'birth_date' => $birth_date,
			'is_active' => true,
			'password' => Hash::make($password)
		]);
	}
}
