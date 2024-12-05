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
        Schema::table('questions', function (Blueprint $table) {
            $table->renameColumn('created_by', 'created_by_user_id');
            $table->renameColumn('last_updated_by', 'last_updated_by_user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->renameColumn('created_by_user_id', 'created_by');
            $table->renameColumn('last_updated_by_user_id', 'last_updated_by');
        });
    }
};
