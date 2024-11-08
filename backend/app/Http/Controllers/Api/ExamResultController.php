<?php

namespace App\Http\Controllers\Api;

use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Http\Requests\ExamResult\CancelRequest;
use App\Http\Requests\ExamResult\RemarkRequest;
use App\Models\ExamResult;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class ExamResultController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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

    public function remark(RemarkRequest $request, string $id)
    {
        $user = $this->getUser();
        abort_if(!$user->isAdmin(), 403);
        // abort_if(!$user->hasPermission('exam_view'), 403);

        DB::beginTransaction();
        try {
            if (!Hash::check($request->password, $user->password)) {
                return Reply::error('auth.errors.password_incorrect');
            }
            $target_exam_result = ExamResult::findOrFail($id);
            if (!$user->isAdmin()) {
                return Reply::error('', [], 403);
            }
            $answers = $target_exam_result
                ->exam()
                ->exam_questions_answers()
                ->where('user_id', $target_exam_result->user_id)
                ->get();
            $correct_count = 0;
            foreach ($answers as $answer) {
                $current_is_correct = $answer->is_correct;
                $new_is_correct = $answer->question_option()->is_correct;
                if ($new_is_correct) $correct_count++;
                if ($current_is_correct != $new_is_correct) {
                    $answer->update([
                        'is_correct' => $new_is_correct
                    ]);
                }
            }
            $target_exam_result->update([
                'correct_count' => $correct_count
            ]);
            DB::commit();
            return Reply::successWithMessage('app.successes.success');
        } catch (\Exception $error) {
            DB::rollBack();
            return $this->handleException($error);
        }
    }

    public function cancel(CancelRequest $request, string $id)
    {
        $user = $this->getUser();
        abort_if(!$user->isAdmin(), 403);
        // abort_if(!$user->hasPermission('exam_view'), 403);

        DB::beginTransaction();
        try {
            if (!Hash::check($request->password, $user->password)) {
                return Reply::error('auth.errors.password_incorrect');
            }
            $target_exam_result = ExamResult::findOrFail($id);
            $target_exam_result->update([
                'cancellation_reason' => $request->cancellation_reason,
                'cancelled_at' => Carbon::now()
            ]);
            DB::commit();
            return Reply::successWithMessage('app.successes.success');
        } catch (\Exception $error) {
            DB::rollBack();
            return $this->handleException($error);
        }
    }
}
