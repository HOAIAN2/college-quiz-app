<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * Class User
 * 
 * @property int $id
 * @property int $role_id
 * @property string $shortcode
 * @property string $name
 * @property string $email
 * @property string|null $phone_number
 * @property string $gender
 * @property string $address
 * @property Carbon $birth_date
 * @property string|null $class
 * @property bool $is_active
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Role $role
 * @property Collection|Course[] $courses
 * @property Collection|Enrollment[] $enrollments
 * @property Collection|ExamTracker[] $exam_trackers
 * @property Collection|Question[] $questions
 *
 * @package App\Models
 */
class User extends Authenticatable
{
	use HasApiTokens, HasFactory, Notifiable;
	protected $table = 'users';

	protected $casts = [
		'role_id' => 'int',
		'birth_date' => 'datetime',
		'is_active' => 'bool',
		'email_verified_at' => 'datetime'
	];

	protected $hidden = [
		'password',
		'remember_token',
		'created_at',
		'updated_at'
	];

	protected $fillable = [
		'role_id',
		'shortcode',
		'name',
		'email',
		'phone_number',
		'gender',
		'address',
		'birth_date',
		'class',
		'is_active',
		'email_verified_at',
		'password',
		'remember_token'
	];

	public function role()
	{
		return $this->belongsTo(Role::class);
	}

	public function courses()
	{
		return $this->hasMany(Course::class, 'teacher_id');
	}

	public function enrollments()
	{
		return $this->hasMany(Enrollment::class, 'student_id');
	}

	public function exam_trackers()
	{
		return $this->hasMany(ExamTracker::class);
	}

	public function questions()
	{
		return $this->hasMany(Question::class, 'teacher_id');
	}
}
