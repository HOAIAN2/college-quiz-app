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
 * @property Carbon|null $deleted_at
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
        'updated_at',
        'deleted_at'
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
        $html_string = mb_convert_encoding($value, 'UTF-8', 'auto');
        $dom = new \DOMDocument();
        @$dom->loadHTML(mb_convert_encoding($html_string, 'HTML-ENTITIES', 'UTF-8'), LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
        libxml_clear_errors();
        $images = $dom->getElementsByTagName('img');

        // Replace token when command not run in console (throught api call, etc)
        $replace_token = app()->runningInConsole() ?
            '/uploads/'
            : request()->schemeAndHttpHost() . '/uploads/';

        foreach ($images as $img) {
            $src = $img->attributes['src']->textContent;
            if (Str::startsWith($src, $replace_token)) {
                $image_paths[] = Str::replace($replace_token, '', $src);
            }
        }
        
        return $dom->saveHTML();
    }
}
