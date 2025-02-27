<?php

namespace App\Observers;

use App\Models\QuestionOption;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class QuestionOptionObserver
{
    /**
     * Handle the QuestionOption "created" event.
     */
    public function created(QuestionOption $questionOption): void
    {
        //
    }

    /**
     * Handle the QuestionOption "updated" event.
     */
    public function updated(QuestionOption $questionOption): void
    {
        $old_question = new QuestionOption($questionOption->getOriginal());

        $old_images = $old_question->getImages();
        $new_images = $questionOption->getImages();

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
     * Handle the QuestionOption "deleted" event.
     */
    public function deleted(QuestionOption $questionOption): void
    {
        //
    }

    /**
     * Handle the QuestionOption "restored" event.
     */
    public function restored(QuestionOption $questionOption): void
    {
        //
    }

    /**
     * Handle the QuestionOption "force deleted" event.
     */
    public function forceDeleted(QuestionOption $questionOption): void
    {
        //
    }
}
