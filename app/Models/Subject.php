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
 * @property int $id
 * @property string $shortcode
 * @property string $name
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Collection|Chapter[] $chapters
 * @property Collection|Course[] $courses
 *
 * @package App\Models
 */
class Subject extends Model
{
	protected $table = 'subjects';

	protected $fillable = [
		'shortcode',
		'name'
	];

	protected $hidden = [
		'created_at',
		'updated_at'
	];

	public function chapters()
	{
		return $this->hasMany(Chapter::class);
	}

	public function courses()
	{
		return $this->hasMany(Course::class);
	}
}
