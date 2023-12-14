<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class SchoolClass
 * 
 * @property string $id
 * @property string $name
 * @property string|null $faculty_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Faculty|null $faculty
 * @property Collection|User[] $students
 *
 * @package App\Models\Test
 */
class SchoolClass extends Model
{
	protected $table = 'school_classes';
	public $incrementing = false;

	const SEARCHABLE = [
		'id',
		'name',
		'faculty_id',
	];

	protected $fillable = [
		'name',
		'faculty_id'
	];

	public function faculty()
	{
		return $this->belongsTo(Faculty::class);
	}

	public function students()
	{
		return $this->hasMany(User::class);
	}
}
