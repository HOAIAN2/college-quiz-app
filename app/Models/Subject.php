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
 * @property Collection|Question[] $questions
 *
 * @package App\Models
 */
class Subject extends Model
{
	use Searchable;
	protected $table = 'subjects';

	protected $searchable = [
		'shortcode',
		'name',
	];

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

	public function questions()
	{
		return $this->hasMany(Question::class);
	}
}
