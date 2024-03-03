<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
	/**
	 * Run the database seeds.
	 */
	public function run(): void
	{
		$permissions = [
			['name' => 'role_permission_view'],
			['name' => 'role_permission_grant'],

			['name' => 'user_view'],
			['name' => 'user_create'],
			['name' => 'user_update'],
			['name' => 'user_delete'],

			['name' => 'school_class_view'],
			['name' => 'school_class_create'],
			['name' => 'school_class_update'],
			['name' => 'school_class_delete'],

			['name' => 'faculty_view'],
			['name' => 'faculty_create'],
			['name' => 'faculty_update'],
			['name' => 'faculty_delete'],

			['name' => 'subject_view'],
			['name' => 'subject_create'],
			['name' => 'subject_update'],
			['name' => 'subject_delete'],

			['name' => 'question_view'],
			['name' => 'question_create'],
			['name' => 'question_update'],
			['name' => 'question_delete'],

			['name' => 'course_view'],
			['name' => 'course_create'],
			['name' => 'course_update'],
			['name' => 'course_delete'],

			['name' => 'exam_view'],
			['name' => 'exam_create'],
			['name' => 'exam_update'],
			['name' => 'exam_delete'],
			['name' => 'exam_submit'],

			['name' => 'semester_view'],
			['name' => 'semester_create'],
			['name' => 'semester_update'],
			['name' => 'semester_delete'],
		];
		foreach ($permissions as $permission) {
			Permission::create($permission);
		}
	}
}
