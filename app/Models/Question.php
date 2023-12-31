<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Question
 * 
 * @property int $id
 * @property int $created_by
 * @property int $chapter_id
 * @property string $level
 * @property string $content
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Chapter $chapter
 * @property User $created_by
 * @property Collection|Exam[] $exams
 * @property Collection|ExamTracker[] $exam_trackers
 * @property Collection|QuestionOption[] $question_options
 * @method bool contains_option($id)
 *
 * @package App\Models
 */
class Question extends Model
{
	protected $table = 'questions';

	protected $casts = [
		'created_by' => 'int',
		'chapter_id' => 'int'
	];

	protected $fillable = [
		'created_by',
		'chapter_id',
		'level',
		'content'
	];

	protected $hidden = [
		'created_at',
		'updated_at'
	];

	public function chapter()
	{
		return $this->belongsTo(Chapter::class);
	}

	public function created_by()
	{
		return $this->belongsTo(User::class, 'created_by');
	}

	public function exams()
	{
		return $this->belongsToMany(Exam::class, 'exam_questions')
			->withPivot('id')
			->withTimestamps();
	}

	public function exam_trackers()
	{
		return $this->hasMany(ExamTracker::class);
	}

	public function question_options()
	{
		return $this->hasMany(QuestionOption::class);
	}
	public function contains_option($id)
	{
		return $this->id == QuestionOption::find($id)->question_id;
	}
}
