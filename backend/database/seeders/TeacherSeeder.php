<?php

namespace Database\Seeders;

use App\Models\Faculty;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TeacherSeeder extends Seeder
{
	/**
	 * Run the database seeds.
	 */
	public function run(): void
	{
		$teachers = file_get_contents(base_path('/dump/teachers.json'));
		$teachers = json_decode($teachers);
		$index = 1;
		foreach ($teachers as $teacher) {
			$faculty_id = Faculty::inRandomOrder()->pluck('id')->first();
			$teacher = collect($teacher)->except(['school_class', 'faculty'])->toArray();
			$teacher['password'] = Hash::make('123456789');
			$teacher['faculty_id'] = $faculty_id;
			$teacher['shortcode'] = 'GVDH' . str_pad($index, 8, '0', STR_PAD_LEFT);
			User::create($teacher);
			$index += 1;
		}
	}
}
