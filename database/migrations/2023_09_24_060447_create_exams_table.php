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
		Schema::create('exams', function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger('course_id');
			$table->string('name');
			$table->dateTime('exam_date');
			$table->unsignedInteger('exam_time');
			$table->timestamps();
			$table->foreign('course_id')->references('id')->on('courses')->cascadeOnDelete();
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::dropIfExists('exams');
	}
};
