<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use App\Traits\Searchable;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\HasApiTokens;

/**
 * Class User
 *
 * @property int $id
 * @property int $role_id
 * @property string $shortcode
 * @property string $first_name
 * @property string $last_name
 * @property string $email
 * @property string|null $phone_number
 * @property string $gender
 * @property string $address
 * @property Carbon $birth_date
 * @property int|null $school_class_id
 * @property int|null $faculty_id
 * @property bool $is_active
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @property Faculty|null $faculty
 * @property Role $role
 * @property SchoolClass|null $school_class
 * @property Collection|Course[] $courses
 * @property Collection|Enrollment[] $enrollments
 * @property Collection|ExamTracker[] $exam_trackers
 * @property Collection|Faculty[] $faculties
 * @property Collection|Question[] $questions
 * @property Collection|ExamQuestionsOrder[] $exam_questions_orders
 * @property Collection|ExamSupervisor[] $exam_supervisors
 *
 * @package App\Models
 */
class User extends Authenticatable
{
	use HasApiTokens, HasFactory, Notifiable, Searchable;

	const DATE_FORMAT = 'Y-m-d\TH:i:sP';

	protected $table = 'users';

	protected $searchable = [
		'first_name',
		'last_name',
		'email',
		'shortcode',
		'school_class.shortcode',
		'faculty.shortcode',
	];

	protected function casts()
	{
		return [
			'role_id' => 'int',
			'birth_date' => 'datetime:' . User::DATE_FORMAT,
			'is_active' => 'bool',
			'email_verified_at' => 'datetime:' . User::DATE_FORMAT
		];
	}

	protected $hidden = [
		'password',
		'remember_token'
	];

	protected $fillable = [
		'role_id',
		'shortcode',
		'first_name',
		'last_name',
		'email',
		'phone_number',
		'gender',
		'address',
		'birth_date',
		'school_class_id',
		'faculty_id',
		'is_active',
		'email_verified_at',
		'password',
		'remember_token'
	];

	public function faculty()
	{
		return $this->belongsTo(Faculty::class);
	}

	public function role()
	{
		return $this->belongsTo(Role::class);
	}

	public function school_class()
	{
		return $this->belongsTo(SchoolClass::class);
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

	public function faculties()
	{
		return $this->hasMany(Faculty::class, 'leader_id');
	}

	public function questions()
	{
		return $this->hasMany(Question::class, 'created_by');
	}

	public function exam_questions_orders()
	{
		return $this->hasMany(ExamQuestionsOrder::class);
	}

	public function exam_supervisors()
	{
		return $this->hasMany(ExamSupervisor::class);
	}

	public function isAdmin()
	{
		return $this->role_id == Role::ROLES['admin'];
	}

	public function isTeacher()
	{
		return $this->role_id == Role::ROLES['teacher'];
	}

	public function hasPermission(string $name)
	{
		return $this->role->permissions()->where('name', '=', $name)->exists();
	}

	public function hasPermissions(array $names)
	{
		return $this->role->permissions()->whereIn('name', $names)->count() == count($names);
	}
}
