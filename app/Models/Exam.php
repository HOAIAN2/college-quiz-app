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
 * @property int $course_id
 * @property string $name
 * @property Carbon $exam_date
 * @property int $exam_time
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @property Course $course
 * @property Collection|Question[] $questions
 * @property Collection|ExamTracker[] $exam_trackers
 *
 * @package App\Models
 */
class Exam extends Model
{
	protected $table = 'exams';

	const DATE_FORMAT = 'Y-m-d\TH:i:sP';

	protected $casts = [
		'course_id' => 'int',
		'exam_date' => 'datetime:' . Exam::DATE_FORMAT,
		'exam_time' => 'int'
	];

	protected $fillable = [
		'course_id',
		'name',
		'exam_date',
		'exam_time'
	];

	public function course()
	{
		return $this->belongsTo(Course::class);
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

	public function isOver()
	{
		$over_at = Carbon::parse($this->exam_date)->addMinutes($this->exam_time);
		return $over_at->greaterThan(Carbon::now());
	}

	public function markAllTracker()
	{
		foreach ($this->exam_trackers as $exam_tracker) {
			$exam_tracker->markTracker();
		}
	}
}
