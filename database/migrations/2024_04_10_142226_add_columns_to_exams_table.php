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
		Schema::table('exams', function (Blueprint $table) {
			$table->dateTime('started_at')->nullable()->after('exam_time');
			$table->dateTime('cancelled_at')->nullable()->after('started_at');
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::table('exams', function (Blueprint $table) {
			$table->dropColumn([
				'started_at',
				'cancelled_at',
			]);
		});
	}
};
