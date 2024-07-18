<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class ExamResult
 *
 * @property int $id
 * @property int $exam_id
 * @property int $user_id
 * @property int $correct_count
 * @property int $question_count
 * @property string $submit_ip
 * @property Carbon|null $cancelled_at
 * @property string|null $cancellation_reason
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @property Exam $exam
 * @property User $user
 *
 * @package App\Models
 */
class ExamResult extends Model
{
	protected $table = 'exam_results';

	protected function casts()
	{
		return [
			'exam_id' => 'int',
			'user_id' => 'int',
			'correct_count' => 'int',
			'question_count' => 'int',
			'cancelled_at' => 'datetime'
		];
	}

	protected $fillable = [
		'exam_id',
		'user_id',
		'correct_count',
		'question_count',
		'submit_ip',
		'cancelled_at',
		'cancellation_reason'
	];

	public function exam()
	{
		return $this->belongsTo(Exam::class);
	}

	public function user()
	{
		return $this->belongsTo(User::class);
	}
}
