<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class ExamQuestion
 *
 * @property int $id
 * @property int $exam_id
 * @property int $question_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @property Exam $exam
 * @property Question $question
 *
 * @package App\Models
 */
class ExamQuestion extends Model
{
	protected $table = 'exam_questions';

	protected function casts()
	{
		return [
			'exam_id' => 'int',
			'question_id' => 'int'
		];
	}

	protected $fillable = [
		'exam_id',
		'question_id'
	];

	protected $hidden = [
		'created_at',
		'updated_at'
	];

	public function exam()
	{
		return $this->belongsTo(Exam::class);
	}

	public function question()
	{
		return $this->belongsTo(Question::class);
	}
}
