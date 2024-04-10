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
		Schema::create('exam_supervisors', function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger('exam_id');
			$table->unsignedBigInteger('user_id');
			$table->timestamps();
			$table->foreign('exam_id')->references('id')->on('exams')->cascadeOnDelete();
			$table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::dropIfExists('exam_supervisors');
	}
};
