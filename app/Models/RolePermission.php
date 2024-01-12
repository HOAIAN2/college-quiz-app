<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class RolePermission
 * 
 * @property int $id
 * @property int $role_id
 * @property int $perrmission_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Permission $permission
 * @property Role $role
 *
 * @package App\Models
 */
class RolePermission extends Model
{
	protected $table = 'role_permissions';

	protected $casts = [
		'role_id' => 'int',
		'perrmission_id' => 'int'
	];

	protected $fillable = [
		'role_id',
		'perrmission_id'
	];

	public function permission()
	{
		return $this->belongsTo(Permission::class, 'perrmission_id');
	}

	public function role()
	{
		return $this->belongsTo(Role::class);
	}
}
