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
		if (env('CANCEL_LATE_EXAMS_INTERVAL') == null) return;
		$now = Carbon::now();

		Exam::where(
			'exam_date',
			'<=',
			$now->copy()->subSeconds((int)env('CANCEL_LATE_EXAMS_INTERVAL'))
		)
			->whereNull('started_at')
			->whereNull('cancelled_at')
			->update([
				'cancelled_at' => $now
			]);
	}
}
