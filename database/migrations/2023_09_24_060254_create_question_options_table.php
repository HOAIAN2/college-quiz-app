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
		Schema::create('question_options', function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger('question_id');
			$table->text('content');
			$table->boolean('is_correct')->default(false);
			$table->timestamps();
			$table->foreign('question_id')->references('id')->on('questions')->cascadeOnDelete();
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::dropIfExists('question_options');
	}
};
