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
		Schema::create('school_classes', function (Blueprint $table) {
			$table->id();
			$table->string('shortcode')->unique();
			$table->string('name');
			$table->unsignedBigInteger('faculty_id')->nullable();
			$table->timestamps();
			$table->foreign('faculty_id')->references('id')->on('faculties')->nullOnDelete();
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::dropIfExists('classes');
	}
};
