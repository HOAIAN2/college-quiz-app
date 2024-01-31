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
		Schema::create('users', function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger('role_id');
			$table->string('shortcode')->unique();
			$table->string('first_name');
			$table->string('last_name');
			$table->string('email')->unique();
			$table->char('phone_number', 10)->unique()->nullable();
			$table->enum('gender', ['male', 'female'])->default('male');
			$table->string('address');
			$table->date('birth_date');
			$table->unsignedBigInteger('school_class_id')->nullable();
			$table->unsignedBigInteger('faculty_id')->nullable();
			$table->boolean('is_active')->default(true);
			$table->timestamp('email_verified_at')->nullable();
			$table->string('password');
			$table->rememberToken();
			$table->timestamps();
			$table->foreign('role_id')->references('id')->on('roles')->cascadeOnDelete();
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::dropIfExists('users');
	}
};
