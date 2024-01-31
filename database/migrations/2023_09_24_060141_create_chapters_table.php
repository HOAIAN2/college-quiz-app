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
		Schema::create('chapters', function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger('subject_id');
			$table->integer('chapter_number');
			$table->string('name');
			$table->timestamps();
			$table->foreign('subject_id')->references('id')->on('subjects')->cascadeOnDelete();
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::dropIfExists('chapters');
	}
};
