<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Role
 * 
 * @property int $id
 * @property string $name
 * @property string $display_name
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Collection|User[] $users
 *
 * @package App\Models
 */
class Role extends Model
{
	protected $table = 'roles';

	const ROLES = [
		'admin' => 1,
		'teacher' => 2,
		'student' => 3
	];
	protected $fillable = [
		'name',
		'display_name'
	];

	protected $hidden = [
		'created_at',
		'updated_at'
	];

	public function users()
	{
		return $this->hasMany(User::class);
	}
}
