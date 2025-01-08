<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Setting
 * 
 * @property int $id
 * @property string $key
 * @property string $value
 * @property string|null $group
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @package App\Models
 */
class Setting extends Model
{
	protected $table = 'settings';

	protected $fillable = [
		'key',
		'value',
		'group',
	];

	public static function get(string $key)
	{
		return self::where('key', $key)->select('value')->first()?->value;
	}
}
