<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class ExamResult
 *
 * @property int $id
 * @property int $exam_id
 * @property int $user_id
 * @property int $correct_count
 * @property int $question_count
 * @property string $ip
 * @property string $user_agent
 * @property Carbon|null $cancelled_at
 * @property string|null $cancellation_reason
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @property Exam $exam
 * @property User $user
 *
 * @package App\Models
 */
class ExamResult extends Model
{
    protected $table = 'exam_results';

    const DATE_FORMAT = 'Y-m-d\TH:i:sP';

    protected function casts()
    {
        return [
            'exam_id' => 'int',
            'user_id' => 'int',
            'correct_count' => 'int',
            'question_count' => 'int',
            'cancelled_at' => 'datetime',
            'created_at' => 'datetime:' . self::DATE_FORMAT,
            'updated_at' => 'datetime:' . self::DATE_FORMAT,
        ];
    }

    protected $fillable = [
        'exam_id',
        'user_id',
        'correct_count',
        'question_count',
        'ip',
        'user_agent',
        'cancelled_at',
        'cancellation_reason'
    ];

    public function exam()
    {
        return $this->belongsTo(Exam::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
