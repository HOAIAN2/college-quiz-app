<?php

namespace App\Http\Controllers\Api;

use App\Enums\PermissionType;
use App\Helper\DOMStringHelper;
use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Http\Requests\Question\IndexRequest;
use App\Http\Requests\Question\StoreRequest;
use App\Http\Requests\Question\UpdateRequest;
use App\Models\Question;
use App\Models\QuestionOption;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

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
        $question_data['created_by'] = $user->id;

        DB::beginTransaction();
        try {
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
            return Reply::successWithMessage('app.successes.record_save_success');
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

        $data['last_updated_by'] = $user->id;

        DB::beginTransaction();
        try {
            $data['content'] = DOMStringHelper::processImagesFromDOM($data['content']);
            $target_question = Question::findOrFail($id);
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
            return Reply::successWithMessage('app.successes.record_save_success');
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
            return Reply::successWithMessage('app.successes.record_delete_success');
        } catch (\Exception $error) {
            DB::rollBack();
            return $this->handleException($error);
        }
    }
}
