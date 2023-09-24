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
        Schema::create('enrollments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('semester_id');
            $table->string('student_id');
            $table->string('subject_id');
            $table->timestamps();
            $table->foreign('semester_id')->references('id')->on('semesters');
            $table->foreign('student_id')->references('id')->on('users');
            $table->foreign('subject_id')->references('id')->on('subjects');
            $table->unique(['semester_id', 'student_id', 'subject_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enrollments');
    }
};
