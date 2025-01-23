<?php

namespace App\Http\Controllers\Api;

use App\Enums\PermissionType;
use App\Helper\DOMStringHelper;
use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Http\Requests\Question\ImportRequest;
use App\Http\Requests\Question\IndexRequest;
use App\Http\Requests\Question\StoreRequest;
use App\Http\Requests\Question\UpdateRequest;
use App\Models\Chapter;
use App\Models\Question;
use App\Models\QuestionOption;
use App\Models\Subject;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpWord\IOFactory;

class QuestionController extends Controller
{
    public function index(IndexRequest $request)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission(PermissionType::QUESTION_VIEW), 403);

        try {
            $data = Question::where('subject_id', '=', $request->subject_id);
            if ($request->chapter_id != null) {
                $data = $data->where('chapter_id', '=', $request->chapter_id);
            }
            if ($request->search != null) {
                $data = $data->whereFullText(Question::FULLTEXT, $request->search);
            }
            $data = $data
                ->limit($this->defaultLimit)
                ->get();
            return Reply::successWithData($data, '');
        } catch (\Exception $error) {
            return $this->handleException($error);
        }
    }

    public function store(StoreRequest $request)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission(PermissionType::QUESTION_CREATE), 403);

        $question_data = collect($request->validated())->except([
            'options',
            'true_option'
        ])->toArray();
        $question_data['created_by_user_id'] = $user->id;

        DB::beginTransaction();
        try {
            $is_chapter_exists = Chapter::where('subject_id', $question_data['subject_id'])
                ->where('id', $question_data['chapter_id'])
                ->exists();
            if (!$is_chapter_exists) {
                return Reply::error(trans('app.errors.404'), 404);
            }
            $question_data['content'] = DOMStringHelper::processImagesFromDOM($question_data['content']);
            $question = Question::create($question_data);

            $question_options = $request->options;
            foreach ($question_options as $key => $value) {
                QuestionOption::create([
                    'question_id' => $question->id,
                    'content' => DOMStringHelper::processImagesFromDOM($value),
                    'is_correct' => $request->true_option == $key
                ]);
            }
            DB::commit();
            return Reply::successWithMessage(trans('app.successes.record_save_success'));
        } catch (\Exception $error) {
            DB::rollBack();
            return $this->handleException($error);
        }
    }

    public function show(string $id)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission(PermissionType::QUESTION_VIEW), 403);

        try {
            $data = Question::with(['question_options'])->findOrFail($id);
            return Reply::successWithData($data, '');
        } catch (\Exception $error) {
            return $this->handleException($error);
        }
    }

    public function update(UpdateRequest $request, string $id)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission(PermissionType::QUESTION_UPDATE), 403);

        $data = collect($request->validated())
            ->except([
                'options',
                'true_option',
            ])->toArray();

        $data['last_updated_by_user_id'] = $user->id;

        DB::beginTransaction();
        try {
            $data['content'] = DOMStringHelper::processImagesFromDOM($data['content']);

            $target_question = Question::findOrFail($id);

            $is_chapter_exists = Chapter::where('subject_id', $target_question->subject_id)
                ->where('id', $data['chapter_id'])
                ->exists();
            if (!$is_chapter_exists) {
                return Reply::error(trans('app.errors.404'), 404);
            }

            $target_question->update($data);
            $question_options = $target_question->question_options;

            $new_option_keys = collect($request->options)->keys();
            $ids_to_delete = [];

            foreach ($question_options as $key => $existing_option) {
                if (!$new_option_keys->has($key)) {
                    $ids_to_delete[] = $existing_option->id;
                }
            }

            if (count($ids_to_delete) != 0) {
                QuestionOption::whereIn('id', $ids_to_delete)->delete();
            }

            foreach ($request->options as $key => $option) {
                if ($question_options->has($key)) {
                    $question_options[$key]->update([
                        'content' => DOMStringHelper::processImagesFromDOM($option),
                        'is_correct' => $request->true_option == $key
                    ]);
                } else QuestionOption::create([
                    'question_id' => $target_question->id,
                    'content' => DOMStringHelper::processImagesFromDOM($option),
                    'is_correct' => $request->true_option == $key
                ]);
            }

            DB::commit();
            return Reply::successWithMessage(trans('app.successes.record_save_success'));
        } catch (\Exception $error) {
            DB::rollBack();
            return $this->handleException($error);
        }
    }

    public function destroy(string $id)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission(PermissionType::QUESTION_DELETE), 403);

        DB::beginTransaction();
        try {
            Question::destroy($id);
            DB::commit();
            return Reply::successWithMessage(trans('app.successes.record_delete_success'));
        } catch (\Exception $error) {
            DB::rollBack();
            return $this->handleException($error);
        }
    }

    public function import(ImportRequest $request)
    {
        $file = $request->file('file');
        $file_path = $file->getPathname();

        DB::beginTransaction();
        try {
            $subject = Subject::findOrFail($request->subject_id);
            $chapter = $subject->chapters()->findOrFail($request->chapter_id);

            $php_word = IOFactory::load($file_path);
            $parsed_data = [];
            $current_question = null;
            foreach ($php_word->getSections() as $section) {
                // Element is a line;
                foreach ($section->getElements() as $element) {
                    $text = '';
                    $is_correct = false;

                    if ($element instanceof \PhpOffice\PhpWord\Element\TextRun) {
                        foreach ($element->getElements() as $text_element) {
                            if ($text_element instanceof \PhpOffice\PhpWord\Element\Text) {
                                $sub_text = $text_element->getText();
                                $style = $text_element->getFontStyle();

                                // Text begin with 'ans' and underline is a correct answer
                                if (!$text && $style->getUnderline() != 'none' && $sub_text == 'ans') {
                                    $is_correct = true;
                                }

                                if ($style->isBold() && $style->isItalic()) {
                                    $text = $text . "<b><i>$sub_text</i></b>";
                                } elseif ($style->isBold()) {
                                    $text = $text . "<b>$sub_text</b>";
                                } elseif ($style->isItalic()) {
                                    $text = $text . "<i>$sub_text</i>";
                                } else {
                                    $text = $text . $sub_text;
                                }
                            } elseif ($text_element instanceof \PhpOffice\PhpWord\Element\Image) {
                                $image_data = $this->processWordImage($text_element);
                                if ($image_data) {
                                    $text .= "<img src=\"$image_data\">";
                                }
                            }
                        }
                    } elseif ($element instanceof \PhpOffice\PhpWord\Element\Text) {
                        $sub_text = $element->getText();
                        $style = $element->getFontStyle();

                        // Text begin with 'ans' and underline is a correct answer
                        if (!$text && $style->getUnderline() != 'none' && $sub_text == 'ans') {
                            $is_correct = true;
                        }

                        if ($style->isBold() && $style->isItalic()) {
                            $text = $text . "<b><i>$sub_text</i></b>";
                        } elseif ($style->isBold()) {
                            $text = $text . "<b>$sub_text</b>";
                        } elseif ($style->isItalic()) {
                            $text = $text . "<i>$sub_text</i>";
                        } else {
                            $text = $text . $sub_text;
                        }
                    } elseif ($element instanceof \PhpOffice\PhpWord\Element\Image) {
                        $image_data = $this->processWordImage($element);
                        if ($image_data) {
                            $text .= "<img src=\"$image_data\">";
                        }
                    }
                    if (empty(trim($text))) {
                        // Push line break to current question content or answer
                        // if ($current_question) {
                        //     if (count($current_question['answers']) == 0) {
                        //         $current_question['content'] = $current_question['content'] . '<br>';
                        //     } else {
                        //         $last_answer_index = count($current_question['answers']) - 1;
                        //         $current_question['answers'][$last_answer_index]['content'] = $current_question['answers'][$last_answer_index]['content'] . '<br>';
                        //     }
                        // }
                        continue;
                    };

                    if (str_starts_with($text, '#') || str_starts_with($text, '//')) {
                        continue;
                    }

                    if (preg_match('/^(easy|medium|hard|expert)\s+quest\s*(.+)$/i', $text, $question_match)) {
                        // If a new question is found, push last question and init new one.
                        if ($current_question !== null) {
                            // Ensure question have atleast one correct answer
                            $already_have_correct = count(array_filter($current_question['answers'], function ($answer) {
                                return $answer['is_correct'];
                            })) != 0;
                            if ($already_have_correct) $parsed_data[] = $current_question;
                        }
                        $current_question = [
                            'content' => trim($question_match[2]),
                            'level' => $question_match[1],
                            'subject_id' => $subject->id,
                            'chapter_id' => $chapter->id,
                            'answers' => [],
                        ];
                    } elseif (preg_match('/^ans\s*(.+)$/i', $text, $answer_match)) {
                        // Add answers to the current question
                        if ($current_question !== null) {
                            $already_have_correct = count(array_filter($current_question['answers'], function ($answer) {
                                return $answer['is_correct'];
                            })) != 0;
                            $current_question['answers'][] = [
                                'content' => trim($answer_match[1]),
                                'is_correct' => $already_have_correct == false ? $is_correct : false
                            ];
                        }
                    } else {
                        // Push current text to current question content or answer
                        if ($current_question) {
                            if (count($current_question['answers']) == 0) {
                                $current_question['content'] = $current_question['content'] . "<br>$text";
                            } else {
                                $last_answer_index = count($current_question['answers']) - 1;
                                $current_question['answers'][$last_answer_index]['content'] = $current_question['answers'][$last_answer_index]['content'] . "<br>$text";
                            }
                        }
                    }
                }
            }

            // Push last question
            if ($current_question !== null) {
                $parsed_data[] = $current_question;
            }
            foreach ($parsed_data as $question_data) {
                $question_data['content'] = DOMStringHelper::processImagesFromDOM($question_data['content']);
                $question = Question::create($question_data);
                foreach ($question_data['answers'] as $answer) {
                    $answer['content'] = DOMStringHelper::processImagesFromDOM($answer['content']);
                    $answer['question_id'] = $question->id;
                    QuestionOption::create($answer);
                }
            }
            DB::commit();
            return Reply::successWithMessage(trans('app.successes.record_save_success'));
        } catch (\Exception $error) {
            DB::rollBack();
            return $this->handleException($error);
        }
    }

    private function processWordImage($image_element)
    {
        try {
            $image_data = $image_element->getImageString();
            $mime_type = $image_element->getImageType();
            return 'data:' . $mime_type . ';base64,' . base64_encode($image_data);
        } catch (\Exception $e) {
            return null;
        }
    }
}
