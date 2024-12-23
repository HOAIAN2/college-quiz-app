<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

/**
 * Class QuestionOption
 *
 * @property int $id
 * @property int $question_id
 * @property string $content
 * @property bool $is_correct
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @property Question $question
 * @property Collection|ExamQuestionsAnswer[] $exam_questions_answers
 *
 * @package App\Models
 */
class QuestionOption extends Model
{
    use SoftDeletes;
    
    protected $table = 'question_options';

    protected function casts()
    {
        return [
            'question_id' => 'int',
            'is_correct' => 'bool'
        ];
    }

    protected $fillable = [
        'question_id',
        'content',
        'is_correct'
    ];

    protected $hidden = [
        'created_at',
        'updated_at'
    ];

    public function question()
    {
        return $this->belongsTo(Question::class);
    }

    public function exam_questions_answers()
    {
        return $this->hasMany(ExamQuestionsAnswer::class, 'answer_id');
    }

    public function getContentAttribute($value)
    {
        libxml_use_internal_errors(true);
        $htmlString = mb_convert_encoding($value, 'UTF-8', 'auto');
        $dom = new \DOMDocument();
        @$dom->loadHTML(mb_convert_encoding($htmlString, 'HTML-ENTITIES', 'UTF-8'), LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
        libxml_clear_errors();
        $images = $dom->getElementsByTagName('img');

        foreach ($images as $img) {
            $src = $img->attributes['src']->textContent;
            if (Str::startsWith($src, '/uploads')) {
                $img->attributes['src']->textContent = request()->schemeAndHttpHost() . $src;
            }
        }
        return $dom->saveHTML();
    }
}
