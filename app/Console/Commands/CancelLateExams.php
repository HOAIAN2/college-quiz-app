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
		$cancel_late_exams_interval = env('CANCEL_LATE_EXAMS_INTERVAL');
		if ($cancel_late_exams_interval == null) return;
		$now = Carbon::now();

		Exam::where(
			'exam_date',
			'<=',
			$now->copy()->subSeconds((int)$cancel_late_exams_interval)
		)
			->whereNull('started_at')
			->whereNull('cancelled_at')
			->update([
				'cancelled_at' => $now
			]);
	}
}
