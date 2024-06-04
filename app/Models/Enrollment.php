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
 * @property int $course_id
 * @property int $student_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @property Course $course
 * @property User $user
 *
 * @package App\Models
 */
class Enrollment extends Model
{
	protected $table = 'enrollments';

	protected function casts()
	{
		return [
			'course_id' => 'int',
			'student_id' => 'int'
		];
	}


	protected $fillable = [
		'course_id',
		'student_id'
	];

	protected $hidden = [
		'created_at',
		'updated_at'
	];

	public function course()
	{
		return $this->belongsTo(Course::class);
	}

	public function user()
	{
		return $this->belongsTo(User::class, 'student_id');
	}
}
