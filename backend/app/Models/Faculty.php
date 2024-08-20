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
 * Class Faculty
 *
 * @property int $id
 * @property string $shortcode
 * @property string $name
 * @property string|null $email
 * @property string|null $phone_number
 * @property int|null $leader_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @property User|null $leader
 * @property Collection|SchoolClass[] $school_classes
 * @property Collection|User[] $users
 *
 * @package App\Models
 */
class Faculty extends Model
{
	use Searchable;
	protected $table = 'faculties';

	protected $searchable = [
		'shortcode',
		'name',
		'email',
		'phone_number',
	];

	protected function casts()
	{
		return [
			'leader_id' => 'int'
		];
	}

	protected $fillable = [
		'shortcode',
		'name',
		'email',
		'phone_number',
		'leader_id'
	];

	public function leader()
	{
		return $this->belongsTo(User::class, 'leader_id');
	}

	public function school_classes()
	{
		return $this->hasMany(SchoolClass::class);
	}

	public function users()
	{
		return $this->hasMany(User::class);
	}
}
