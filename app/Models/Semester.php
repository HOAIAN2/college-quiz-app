<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Semester
 * 
 * @property int $id
 * @property string $name
 * @property Carbon $start_date
 * @property Carbon $end_date
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Collection|Enrollment[] $enrollments
 * @property Collection|Exam[] $exams
 *
 * @package App\Models
 */
class Semester extends Model
{
	protected $table = 'semesters';

	protected $casts = [
		'start_date' => 'datetime',
		'end_date' => 'datetime'
	];

	protected $fillable = [
		'name',
		'start_date',
		'end_date'
	];

	public function enrollments()
	{
		return $this->hasMany(Enrollment::class);
	}

	public function exams()
	{
		return $this->hasMany(Exam::class);
	}
}
