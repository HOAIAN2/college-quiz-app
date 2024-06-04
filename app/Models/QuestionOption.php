<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class QuestionOption
 *
 * @property int $id
 * @property int $question_id
 * @property string $content
 * @property bool $is_correct
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @property Question $question
 * @property Collection|ExamTracker[] $exam_trackers
 *
 * @package App\Models
 */
class QuestionOption extends Model
{
	protected $table = 'question_options';

	protected function casts()
	{
		return [
			'question_id' => 'int',
			'is_correct' => 'bool'
		];
	}

	protected $fillable = [
		'question_id',
		'content',
		'is_correct'
	];

	protected $hidden = [
		'created_at',
		'updated_at'
	];

	public function question()
	{
		return $this->belongsTo(Question::class);
	}

	public function exam_trackers()
	{
		return $this->hasMany(ExamTracker::class, 'answer_id');
	}
}
