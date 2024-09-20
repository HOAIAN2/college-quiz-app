<?php

namespace App\Console\Commands;

use App\Models\Exam;
use Carbon\Carbon;
use Illuminate\Console\Command;

class CancelLateExams extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:cancel-late-exams';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cancel lates exams';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $max_late_seconds = config('custom.exam.max_late_seconds');
        if ($max_late_seconds == null) return;
        $now = Carbon::now();

        Exam::where(
            'exam_date',
            '<=',
            $now->copy()->subSeconds((int)$max_late_seconds)
        )
            ->whereNull('started_at')
            ->whereNull('cancelled_at')
            ->update([
                'cancelled_at' => $now
            ]);
    }
}
