<?php

namespace App\Observers;

use App\Models\Exam;
use App\Models\Setting;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class ExamObserver
{
    // Use static variables to reduce queries per request
    protected static int|null $examAutoCancelAfterSeconds = null;

    public function retrieved(Exam $exam): void
    {
        // Load setting only once per request
        if (self::$examAutoCancelAfterSeconds === null) {
            self::$examAutoCancelAfterSeconds = (int) Setting::get('exam_auto_cancel_after_seconds');
        }

        if (self::$examAutoCancelAfterSeconds === 0) return;
        $now = Carbon::now();

        try {
            if (
                $exam->started_at == null &&
                $exam->cancelled_at == null &&
                $exam->exam_date <= $now->copy()->subSeconds(self::$examAutoCancelAfterSeconds)
            ) {
                $exam->cancelled_at = $now;
                $exam->save();
            }
        } catch (\Exception $error) {
            $context = [
                'url' => request()->url(),
                'stack_trace' => $error->getTrace()[0] ?? [],
            ];
            Log::error($error->getMessage(), $context);
        }
    }
    /**
     * Handle the Exam "created" event.
     */
    public function created(Exam $exam): void
    {
        //
    }

    /**
     * Handle the Exam "updated" event.
     */
    public function updated(Exam $exam): void
    {
        //
    }

    /**
     * Handle the Exam "deleted" event.
     */
    public function deleted(Exam $exam): void
    {
        //
    }

    /**
     * Handle the Exam "restored" event.
     */
    public function restored(Exam $exam): void
    {
        //
    }

    /**
     * Handle the Exam "force deleted" event.
     */
    public function forceDeleted(Exam $exam): void
    {
        //
    }
}
