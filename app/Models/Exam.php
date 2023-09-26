<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Exam
 * 
 * @property int $id
 * @property int $teacher_id
 * @property int $subject_id
 * @property int $semester_id
 * @property string $name
 * @property Carbon $exam_date
 * @property int $exam_time
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Semester $semester
 * @property Subject $subject
 * @property User $user
 * @property Collection|Question[] $questions
 * @property Collection|ExamTracker[] $exam_trackers
 *
 * @package App\Models
 */
class Exam extends Model
{
	protected $table = 'exams';

	protected $casts = [
		'teacher_id' => 'int',
		'subject_id' => 'int',
		'semester_id' => 'int',
		'exam_date' => 'datetime',
		'exam_time' => 'int'
	];

	protected $fillable = [
		'teacher_id',
		'subject_id',
		'semester_id',
		'name',
		'exam_date',
		'exam_time'
	];

	public function semester()
	{
		return $this->belongsTo(Semester::class);
	}

	public function subject()
	{
		return $this->belongsTo(Subject::class);
	}

	public function user()
	{
		return $this->belongsTo(User::class, 'teacher_id');
	}

	public function questions()
	{
		return $this->belongsToMany(Question::class, 'exam_questions')
					->withPivot('id')
					->withTimestamps();
	}

	public function exam_trackers()
	{
		return $this->hasMany(ExamTracker::class);
	}
}
