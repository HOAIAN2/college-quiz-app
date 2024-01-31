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
		Schema::create('faculties', function (Blueprint $table) {
			$table->id();
			$table->string('shortcode')->unique();
			$table->string('name');
			$table->string('email')->nullable();
			$table->string('phone_number')->nullable();
			$table->unsignedBigInteger('leader_id')->nullable();
			$table->timestamps();
			$table->foreign('leader_id')->references('id')->on('users')->nullOnDelete();
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::dropIfExists('faculties');
	}
};
