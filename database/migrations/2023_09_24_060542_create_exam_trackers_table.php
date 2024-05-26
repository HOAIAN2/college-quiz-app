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
		Schema::create('exam_trackers', function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger('user_id');
			$table->unsignedBigInteger('exam_id');
			$table->unsignedBigInteger('question_id');
			$table->unsignedBigInteger('answer_id')->nullable();
			$table->boolean('is_correct')->default(false);
			$table->timestamps();
			$table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
			$table->foreign('exam_id')->references('id')->on('exams')->cascadeOnDelete();
			$table->foreign('question_id')->references('id')->on('exam_questions')->cascadeOnDelete();
			$table->foreign('answer_id')->references('id')->on('question_options')->cascadeOnDelete();
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::dropIfExists('exam_trackers');
	}
};
