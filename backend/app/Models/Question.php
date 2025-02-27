<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Question
 *
 * @property int $id
 * @property int|null $created_by_user_id
 * @property int|null $last_updated_by_user_id
 * @property int $subject_id
 * @property int|null $chapter_id
 * @property string $level
 * @property string $content
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 *
 * @property Chapter|null $chapter
 * @property User|null $user
 * @property Subject $subject
 * @property Collection|Exam[] $exams
 * @property Collection|QuestionOption[] $question_options
 *
 * @package App\Models
 */
class Question extends Model
{
    use SoftDeletes;

    const FULLTEXT = ['content'];

    protected $table = 'questions';

    protected function casts()
    {
        return [
            'created_by_user_id' => 'int',
            'last_updated_by_user_id' => 'int',
            'subject_id' => 'int',
            'chapter_id' => 'int'
        ];
    }

    protected $fillable = [
        'created_by_user_id',
        'last_updated_by_user_id',
        'subject_id',
        'chapter_id',
        'level',
        'content'
    ];

    public function chapter()
    {
        return $this->belongsTo(Chapter::class);
    }

    public function created_by()
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }

    public function last_updated_by()
    {
        return $this->belongsTo(User::class, 'last_updated_by_user_id');
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function exams()
    {
        return $this->belongsToMany(Exam::class, 'exam_questions')
            ->withPivot('id')
            ->withTimestamps();
    }

    public function question_options()
    {
        return $this->hasMany(QuestionOption::class);
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

    public function getImages()
    {
        libxml_use_internal_errors(true);
        $html_string = mb_convert_encoding($this->content, 'UTF-8', 'auto');
        $dom = new \DOMDocument();
        @$dom->loadHTML(mb_convert_encoding($html_string, 'HTML-ENTITIES', 'UTF-8'), LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
        libxml_clear_errors();
        $images = $dom->getElementsByTagName('img');

        // Replace token when command not run in console (throught api call, etc)
        $replace_token = app()->runningInConsole() ?
            '/uploads/'
            : request()->schemeAndHttpHost() . '/uploads/';

        $image_paths = [];

        foreach ($images as $img) {
            $src = $img->attributes['src']->textContent;
            if (Str::startsWith($src, $replace_token)) {
                $image_paths[] = Str::replace($replace_token, '', $src);
            }
        }

        return $image_paths;
    }
}
