<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class ExamQuestionsOrder
 * 
 * @property int $id
 * @property int $exam_id
 * @property int $user_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Exam $exam
 * @property User $user
 *
 * @package App\Models
 */
class ExamQuestionsOrder extends Model
{
	protected $table = 'exam_questions_orders';

	protected $casts = [
		'exam_id' => 'int',
		'user_id' => 'int'
	];

	protected $fillable = [
		'exam_id',
		'user_id'
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
