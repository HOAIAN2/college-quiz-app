<?php

namespace App\Console\Commands;

use App\Models\ExamQuestion;
use App\Models\Question;
use Illuminate\Console\Command;

class DeleteNeverUsedQuestions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:delete-never-used-questions';

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
        Question::onlyTrashed()
            ->whereNotIn('id', function ($query) {
                $query->select('question_id')->from('exam_questions');
            })
            ->forceDelete();
    }
}
