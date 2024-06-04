<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use App\Traits\Searchable;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Course
 *
 * @property int $id
 * @property int $teacher_id
 * @property int $subject_id
 * @property int $semester_id
 * @property string $shortcode
 * @property string $name
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @property Semester $semester
 * @property Subject $subject
 * @property User $teacher
 * @property Collection|Enrollment[] $enrollments
 * @property Collection|Exam[] $exams
 *
 * @package App\Models
 */
class Course extends Model
{
	use Searchable;

	protected $table = 'courses';

	protected $searchable = [
		'shortcode',
		'name',
	];

	protected function casts()
	{
		return [
			'teacher_id' => 'int',
			'subject_id' => 'int',
			'semester_id' => 'int'
		];
	}

	protected $fillable = [
		'teacher_id',
		'subject_id',
		'semester_id',
		'shortcode',
		'name'
	];

	protected $hidden = [
		'created_at',
		'updated_at'
	];

	public function semester()
	{
		return $this->belongsTo(Semester::class);
	}

	public function subject()
	{
		return $this->belongsTo(Subject::class);
	}

	public function teacher()
	{
		return $this->belongsTo(User::class, 'teacher_id');
	}

	public function enrollments()
	{
		return $this->hasMany(Enrollment::class);
	}

	public function exams()
	{
		return $this->hasMany(Exam::class);
	}

	public function hasStudent(int $id)
	{
		return $this->enrollments()->where('student_id', '=', $id)->exists();
	}

	public function hasAnyStudentFromList(array $ids)
	{
		return $this->enrollments()->whereIn('student_id', $ids)->exists();
	}

	public function isOver()
	{
		return $this->semester->isOver();
	}
}
