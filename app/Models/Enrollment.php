<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Enrollment
 * 
 * @property int $id
 * @property int $semester_id
 * @property int $student_id
 * @property int $subject_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Semester $semester
 * @property User $user
 * @property Subject $subject
 *
 * @package App\Models
 */
class Enrollment extends Model
{
	protected $table = 'enrollments';

	protected $casts = [
		'semester_id' => 'int',
		'student_id' => 'int',
		'subject_id' => 'int'
	];

	protected $fillable = [
		'semester_id',
		'student_id',
		'subject_id'
	];

	public function semester()
	{
		return $this->belongsTo(Semester::class);
	}

	public function user()
	{
		return $this->belongsTo(User::class, 'student_id');
	}

	public function subject()
	{
		return $this->belongsTo(Subject::class);
	}
}
