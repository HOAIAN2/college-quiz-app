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
 * @property int $teacher_id
 * @property int $chapter_id
 * @property string $content
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Chapter $chapter
 * @property User $user
 * @property Collection|Exam[] $exams
 * @property Collection|ExamTracker[] $exam_trackers
 * @property Collection|QuestionOption[] $question_options
 *
 * @package App\Models
 */
class Question extends Model
{
	protected $table = 'questions';

	protected $casts = [
		'teacher_id' => 'int',
		'chapter_id' => 'int'
	];

	protected $fillable = [
		'teacher_id',
		'chapter_id',
		'content'
	];

	public function chapter()
	{
		return $this->belongsTo(Chapter::class);
	}

	public function user()
	{
		return $this->belongsTo(User::class, 'teacher_id');
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
	public function contains_option($question_option)
	{
		$options = $this->question_options();
		foreach ($options as $option) {
			if ($option->id == $question_option->id) return true;
		}
		return false;
	}
}
