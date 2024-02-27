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
		Schema::create('questions', function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger('created_by')->nullable();
			$table->unsignedBigInteger('last_updated_by')->nullable();
			$table->unsignedBigInteger('subject_id');
			$table->unsignedBigInteger('chapter_id')->nullable();
			$table->enum('level', ['easy', 'medium', 'hard', 'expert'])->default('easy');
			$table->text('content');
			$table->timestamps();

			$table->foreign('created_by')->references('id')->on('users')->nullOnDelete();
			$table->foreign('last_updated_by')->references('id')->on('users')->nullOnDelete();
			$table->foreign('subject_id')->references('id')->on('subjects')->cascadeOnDelete();
			$table->foreign('chapter_id')->references('id')->on('chapters')->nullOnDelete();
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::dropIfExists('questions');
	}
};
