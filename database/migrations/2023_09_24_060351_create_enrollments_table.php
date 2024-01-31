<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
	/**
	 * Run the migrations.
	 */
	public function up(): void
	{
		Schema::create('enrollments', function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger('course_id');
			$table->unsignedBigInteger('student_id');
			$table->timestamps();
			$table->foreign('student_id')->references('id')->on('users')->cascadeOnDelete();
			$table->foreign('course_id')->references('id')->on('courses')->cascadeOnDelete();
			$table->unique(['course_id', 'student_id']);
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::dropIfExists('enrollments');
	}
};
