<?php

namespace App\Console\Commands;

use App\Models\Question;
use App\Models\QuestionOption;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class CleanupImages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:cleanup-images';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean up images that deleted in database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $question_images = [];

        Question::withTrashed()->select('content')->chunk(100, function ($questions) use (&$question_images) {
            foreach ($questions as $question) {
                array_push($question_images, ...$question->getImages());
            }
        });

        QuestionOption::withTrashed()->select('content')->chunk(100, function ($options) use (&$question_images) {
            foreach ($options as $option) {
                array_push($question_images, ...$option->getImages());
            }
        });

        $files = Storage::allFiles();
        $ignore_files = ['.gitignore'];

        $files_to_delete = array_filter($files, function ($file) use ($question_images, $ignore_files) {
            if (in_array($file, $ignore_files)) return false;
            return !in_array($file, $question_images);
        });

        Storage::delete($files_to_delete);
    }
}
