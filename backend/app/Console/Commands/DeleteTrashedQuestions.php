<?php

namespace App\Console\Commands;

use App\Models\Question;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class DeleteTrashedQuestions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:delete-trashed-questions';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This command use to delete trashed questions that never be used';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $trashed_questions = Question::with(['question_options'])->onlyTrashed()
            ->whereNotIn('id', function ($query) {
                $query->select('question_id')->from('exam_questions');
            })
            ->take(100)
            ->get();

        $image_paths = [];

        foreach ($trashed_questions as $question) {
            array_push($image_paths, ...$question->getImages());
            foreach ($question->question_options as $question_option) {
                array_push($image_paths, ...$question_option->getImages());
            }
        }

        Question::whereIn('id', $trashed_questions->pluck('id'))->forceDelete();

        if (count($image_paths) != 0) {
            if (!Storage::delete($image_paths)) {
                Log::error("Fail to delete images", [
                    'name' => $image_paths
                ]);
            }
        }
    }
}
