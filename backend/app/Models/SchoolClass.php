<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use App\Traits\FullTextSearch;
use App\Traits\Searchable;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class SchoolClass
 *
 * @property int $id
 * @property string $shortcode
 * @property string $name
 * @property int|null $faculty_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @property Faculty|null $faculty
 * @property Collection|User[] $students
 *
 * @package App\Models
 */
class SchoolClass extends Model
{
	use Searchable;

	protected $table = 'school_classes';

	protected $searchable = [
		'shortcode',
		'name',
	];

	protected function casts()
	{
		return [
			'faculty_id' => 'int'
		];
	}

	protected $fillable = [
		'shortcode',
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
