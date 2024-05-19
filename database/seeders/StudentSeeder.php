<?php

namespace Database\Seeders;

use App\Models\SchoolClass;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class StudentSeeder extends Seeder
{
	/**
	 * Run the database seeds.
	 */
	public function run(): void
	{
		$students = file_get_contents(base_path('/dump/students.json'));
		$students = json_decode($students);
		foreach ($students as $student) {
			$school_class_id = SchoolClass::where('shortcode', $student->school_class)->pluck('id')->first();
			$student = collect($student)->except(['school_class', 'faculty'])->toArray();
			$student['school_class_id'] = $school_class_id;
			$student['password'] = Hash::make('123456789');
			User::create($student);
		}
	}
}
