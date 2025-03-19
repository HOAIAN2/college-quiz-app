<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use App\Observers\ExamObserver;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Exam
 *
 * @property int $id
 * @property int $course_id
 * @property string $name
 * @property Carbon $exam_date
 * @property int $exam_time
 * @property Carbon|null $started_at
 * @property Carbon|null $cancelled_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @property Course $course
 * @property Collection|Question[] $questions
 * @property Collection|ExamQuestionsAnswer[] $exam_questions_answers
 * @property Collection|ExamQuestionsOrder[] $exam_questions_orders
 * @property Collection|ExamSupervisor[] $exam_supervisors
 * @property Collection|User[] $supervisors
 * @property Collection|ExamResult[] $exam_results
 *
 * @package App\Models
 */
#[ObservedBy(ExamObserver::class)]
class Exam extends Model
{
    protected $table = 'exams';

    const DATE_FORMAT = 'Y-m-d\TH:i:sP';

    protected function casts()
    {
        return [
            'course_id' => 'int',
            'exam_date' => 'datetime:' . self::DATE_FORMAT,
            'exam_time' => 'int',
            'started_at' => 'datetime:' . self::DATE_FORMAT,
            'cancelled_at' => 'datetime:' . self::DATE_FORMAT,
        ];
    }

    protected $fillable = [
        'course_id',
        'name',
        'exam_date',
        'exam_time',
        'started_at',
        'cancelled_at',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function questions()
    {
        return $this->belongsToMany(Question::class, 'exam_questions')
            ->withPivot('id')
            ->withTimestamps();
    }

    public function exam_questions_answers()
    {
        return $this->hasMany(ExamQuestionsAnswer::class);
    }

    public function exam_questions_orders()
    {
        return $this->hasMany(ExamQuestionsOrder::class);
    }

    public function exam_supervisors()
    {
        return $this->hasMany(ExamSupervisor::class);
    }

    public function supervisors()
    {
        return $this->belongsToMany(User::class, 'exam_supervisors')
            ->withPivot('id')
            ->withTimestamps();
    }

    public function exam_results()
    {
        return $this->hasMany(ExamResult::class);
    }
}
