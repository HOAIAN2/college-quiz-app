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
		Schema::create('courses', function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger('teacher_id');
			$table->unsignedBigInteger('subject_id');
			$table->unsignedBigInteger('semester_id');
			$table->string('shortcode')->unique();
			$table->string('name');
			$table->timestamps();
			$table->foreign('teacher_id')->references('id')->on('users')->cascadeOnDelete();
			$table->foreign('subject_id')->references('id')->on('subjects')->cascadeOnDelete();
			$table->foreign('semester_id')->references('id')->on('semesters')->cascadeOnDelete();
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::dropIfExists('courses');
	}
};
