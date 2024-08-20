<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
	/**
	 * Seed the application's database.
	 */
	public function run(): void
	{
		$this->call([
			FacultySeeder::class,
			ShoolClassSeeder::class,
			RoleSeeder::class,
			UserSeeder::class,
			SubjectSeeder::class,
			ChapterSeeder::class,
			StudentSeeder::class,
			PermissionSeeder::class,
			RolePermissionSeeder::class,
			TeacherSeeder::class,
			QuestionSeeder::class,
		]);
	}
}
