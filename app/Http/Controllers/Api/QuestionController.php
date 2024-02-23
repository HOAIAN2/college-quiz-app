<?php

namespace App\Http\Controllers\Api;

use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Http\Requests\Question\GetAllRequest;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class QuestionController extends Controller
{
	/**
	 * Display a listing of the resource.
	 */
	public function index(GetAllRequest $request)
	{
		$user = $this->getUser();
		abort_if(!$user->hasPermission('question_view'), 403);

		try {
			$data = Question::with(['question_options'])
				->where('subject_id', '=', $request->subject_id);
			if ($request->chapter_id != null) {
				$data = $data->where('chapter_id', '=', $request->chapter_id);
			}
			if ($request->search != null) {
				$data = $data->search($request->search);
			}
			return Reply::successWithData($data->get());
		} catch (\Throwable $error) {
			Log::error($error->getMessage());
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.somethingWentWrong', [], 500);
		}
	}

	/**
	 * Store a newly created resource in storage.
	 */
	public function store(Request $request)
	{
		//
	}

	/**
	 * Display the specified resource.
	 */
	public function show(string $id)
	{
		//
	}

	/**
	 * Update the specified resource in storage.
	 */
	public function update(Request $request, string $id)
	{
		//
	}

	/**
	 * Remove the specified resource from storage.
	 */
	public function destroy(string $id)
	{
		//
	}
}
