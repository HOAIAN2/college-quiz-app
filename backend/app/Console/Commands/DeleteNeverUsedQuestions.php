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
        $trash_question_ids = Question::onlyTrashed()->pluck('id')->toArray();

        $used_question_ids = ExamQuestion::whereIn('question_id', $trash_question_ids)
            ->pluck('question_id')
            ->toArray();

        $never_used_question_ids = array_diff($trash_question_ids, $used_question_ids);

        Question::whereIn('id', $never_used_question_ids)->forceDelete();
    }
}
