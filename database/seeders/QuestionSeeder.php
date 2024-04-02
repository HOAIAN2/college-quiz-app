<?php

namespace Database\Seeders;

use App\Models\Chapter;
use App\Models\Question;
use App\Models\QuestionOption;
use App\Models\Subject;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class QuestionSeeder extends Seeder
{
	/**
	 * Run the database seeds.
	 */
	public function run(): void
	{
		$dir = base_path('/dump/questions/');
		$questions = [];
		$levels = ['easy', 'medium', 'hard', 'expert'];
		$subject_id = Subject::where('shortcode', '=', 'AV226')
			->select('id')
			->firstOrFail()->id;
		$chapter_ids = Chapter::where('subject_id', '=', $subject_id)->pluck('id')->toArray();

		if (is_dir($dir)) {
			$files = scandir($dir);
			$files = array_diff($files, array('.', '..'));
			foreach ($files as $file) {
				$file_questions = json_decode(file_get_contents($dir . $file));
				$questions = array_merge($questions, $file_questions);
			}
		}
		foreach ($questions as $question) {
			$created_question = Question::create([
				'content' => $question->content,
				'subject_id' => $subject_id,
				'level' => $levels[array_rand($levels)],
				'chapter_id' => $chapter_ids[array_rand($chapter_ids)]
			]);
			foreach ($question->answers as $answer) {
				QuestionOption::create([
					'question_id' => $created_question->id,
					'content' => $answer->content,
					'is_correct' => $answer->is_correct
				]);
			}
		}
	}
}
