<?php

namespace App\Observers;

use App\Models\Question;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class QuestionObserver
{
    /**
     * Handle the Question "created" event.
     */
    public function created(Question $question): void
    {
        //
    }

    /**
     * Handle the Question "updated" event.
     */
    public function updated(Question $question): void
    {
        $old_question = new Question($question->getOriginal());

        $old_images = $old_question->getImages();
        $new_images = $question->getImages();

        $files_to_delete = array_filter($old_images, function($image) use($new_images){
            return !in_array($image, $new_images);
        });

        if (count($files_to_delete) != 0) {
            if (!Storage::delete($files_to_delete)) {
                Log::error("Fail to delete images", [
                    'name' => $files_to_delete
                ]);
            }
        }
    }

    /**
     * Handle the Question "deleted" event.
     */
    public function deleted(Question $question): void
    {
        //
    }

    /**
     * Handle the Question "restored" event.
     */
    public function restored(Question $question): void
    {
        //
    }

    /**
     * Handle the Question "force deleted" event.
     */
    public function forceDeleted(Question $question): void
    {
        //
    }
}
