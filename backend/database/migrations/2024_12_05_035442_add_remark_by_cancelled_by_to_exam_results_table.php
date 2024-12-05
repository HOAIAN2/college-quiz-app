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
        Schema::table('exam_results', function (Blueprint $table) {
            $table->unsignedBigInteger('cancelled_by_user_id')->nullable()->after('cancellation_reason');
            $table->unsignedBigInteger('remark_by_user_id')->nullable()->after('cancelled_by_user_id');

            $table->foreign('cancelled_by_user_id')->references('id')->on('users')->nullOnDelete();
            $table->foreign('remark_by_user_id')->references('id')->on('users')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('exam_results', function (Blueprint $table) {
            $table->dropForeign(['cancelled_by_user_id']);
            $table->dropForeign(['remark_by_user_id']);
            $table->dropColumn([
                'cancelled_by_user_id',
                'remark_by_user_id',
            ]);
        });
    }
};
