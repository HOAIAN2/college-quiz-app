<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Subject
 * 
 * @property string $id
 * @property string $name
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Collection|Chapter[] $chapters
 * @property Collection|Enrollment[] $enrollments
 * @property Collection|Exam[] $exams
 *
 * @package App\Models
 */
class Subject extends Model
{
	protected $table = 'subjects';
	public $incrementing = false;

	protected $fillable = [
		'name'
	];

	public function chapters()
	{
		return $this->hasMany(Chapter::class);
	}

	public function enrollments()
	{
		return $this->hasMany(Enrollment::class);
	}

	public function exams()
	{
		return $this->hasMany(Exam::class);
	}
}
