<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use App\Traits\Searchable;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Question
 *
 * @property int $id
 * @property int|null $created_by
 * @property int $subject_id
 * @property int|null $chapter_id
 * @property string $level
 * @property string $content
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
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
	use Searchable;
	protected $table = 'questions';

	protected $searchable = [
		'content',
		'question_options.content'
	];

	protected $casts = [
		'created_by' => 'int',
		'subject_id' => 'int',
		'chapter_id' => 'int'
	];

	protected $fillable = [
		'created_by',
		'subject_id',
		'chapter_id',
		'level',
		'content'
	];

	public function chapter()
	{
		return $this->belongsTo(Chapter::class);
	}

	public function user()
	{
		return $this->belongsTo(User::class, 'created_by');
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

	public function hasOption($id)
	{
		return $this->id == QuestionOption::find($id)->question_id;
	}
}
