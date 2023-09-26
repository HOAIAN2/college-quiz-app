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
 * @property int $id
 * @property string $shortcode
 * @property string $name
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Collection|User[] $users
 *
 * @package App\Models
 */
class SchoolClass extends Model
{
	protected $table = 'school_classes';

	protected $fillable = [
		'shortcode',
		'name'
	];

	public function users()
	{
		return $this->hasMany(User::class, 'class_id');
	}
}
