<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
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
 * @property int|null $class_id
 * @property string $shortcode
 * @property string $name
 * @property string $email
 * @property string|null $phone_number
 * @property string $gender
 * @property string $address
 * @property bool $is_active
 * @property Carbon $email_verified_at
 * @property string $password
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property SchoolClass|null $school_class
 * @property Role $role
 * @property Collection|Enrollment[] $enrollments
 * @property Collection|ExamTracker[] $exam_trackers
 * @property Collection|Exam[] $exams
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
        'class_id' => 'int',
        'is_active' => 'bool',
        'email_verified_at' => 'datetime'
    ];

    protected $hidden = [
        'password',
        'remember_token'
    ];

    protected $fillable = [
        'role_id',
        'class_id',
        'shortcode',
        'name',
        'email',
        'phone_number',
        'gender',
        'address',
        'is_active',
        'email_verified_at',
        'password',
        'remember_token'
    ];

    public function school_class()
    {
        return $this->belongsTo(SchoolClass::class, 'class_id');
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class, 'student_id');
    }

    public function exam_trackers()
    {
        return $this->hasMany(ExamTracker::class);
    }

    public function exams()
    {
        return $this->hasMany(Exam::class, 'teacher_id');
    }

    public function questions()
    {
        return $this->hasMany(Question::class, 'teacher_id');
    }
}
