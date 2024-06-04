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
 * Class Semester
 *
 * @property int $id
 * @property string $name
 * @property Carbon $start_date
 * @property Carbon $end_date
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @property Collection|Course[] $courses
 *
 * @package App\Models
 */
class Semester extends Model
{
	use Searchable;
	protected $table = 'semesters';

	const DATE_FORMAT = 'Y-m-d\TH:i:sP';

	protected $searchable = [
		'name',
		'start_date',
		'end_date',
	];

	protected function casts()
	{
		return [
			'start_date' => 'datetime:' . Semester::DATE_FORMAT,
			'end_date' => 'datetime:' . Semester::DATE_FORMAT
		];
	}

	protected $fillable = [
		'name',
		'start_date',
		'end_date'
	];

	protected $hidden = [
		'created_at',
		'updated_at'
	];

	public function courses()
	{
		return $this->hasMany(Course::class);
	}

	public function isOver()
	{
		return Carbon::now()->greaterThan($this->end_date);
	}
}
