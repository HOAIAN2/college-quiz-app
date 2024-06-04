<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class ExamTracker
 *
 * @property int $id
 * @property int $user_id
 * @property int $exam_id
 * @property int $question_id
 * @property int $answer_id
 * @property bool $is_correct
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @property QuestionOption $question_option
 * @property Exam $exam
 * @property ExamQuestion $exam_question
 * @property User $user
 *
 * @package App\Models
 */
class ExamTracker extends Model
{
	protected $table = 'exam_trackers';

	protected function casts()
	{
		return [
			'user_id' => 'int',
			'exam_id' => 'int',
			'question_id' => 'int',
			'answer_id' => 'int',
			'is_correct' => 'bool'
		];
	}

	protected $fillable = [
		'user_id',
		'exam_id',
		'question_id',
		'answer_id',
		'is_correct'
	];

	protected $hidden = [
		'created_at',
		'updated_at'
	];

	public function question_option()
	{
		return $this->belongsTo(QuestionOption::class, 'answer_id');
	}

	public function exam()
	{
		return $this->belongsTo(Exam::class);
	}

	public function exam_question()
	{
		return $this->belongsTo(ExamQuestion::class, 'question_id');
	}

	public function user()
	{
		return $this->belongsTo(User::class);
	}

	public function markTracker()
	{
		$is_correct = QuestionOption::where('id', '=', $this->answer_id)
			->where('question_id', '=', $this->question_id)
			->pluck('is_correct')
			->first();
		if ($is_correct != null) {
			$this->is_correct = $is_correct;
			$this->save();
		}
	}
}
