<?php

namespace App\Http\Controllers\Api;

use App\Enums\PermissionType;
use App\Enums\RoleType;
use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Http\Requests\Course\IndexRequest;
use App\Http\Requests\Course\StoreRequest;
use App\Http\Requests\Course\UpdateRequest;
use App\Http\Requests\Course\UpdateStudentsRequest;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Semester;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CourseController extends Controller
{
    public function index(IndexRequest $request)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission(PermissionType::COURSE_VIEW), 403);

        try {
            $data = Course::where('semester_id', '=', $request->semester_id);
            if ($request->search != null) {
                $data = $data->search($request->search);
            }
            $data = $data
                ->limit($this->defaultLimit)
                ->latest('id')
                ->get();
            return Reply::successWithData($data, '');
        } catch (\Exception $error) {
            return $this->handleException($error);
        }
    }

    public function store(StoreRequest $request)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission(PermissionType::COURSE_CREATE), 403);
        $data = $request->validated();

        DB::beginTransaction();
        try {
            $semester = Semester::findOrFail($request->semester_id);
            if ($semester->isOver()) {
                return Reply::error('app.errors.semester_end', [], 400);
            }
            User::where('role_id', '=', RoleType::TEACHER)
                ->select('id')->findOrFail($request->teacher_id);
            Course::create($data);
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
        abort_if(!$user->hasPermission(PermissionType::COURSE_VIEW), 403);

        try {
            $courses = Course::with([
                'teacher',
                'subject',
                'enrollments.user' => function ($query) {
                    $query->with(['role', 'school_class', 'faculty']);
                },
                'exams' => function ($query) {
                    $query->withCount(['questions']);
                },
            ])->findOrFail($id);
            return Reply::successWithData($courses, '');
        } catch (\Exception $error) {
            return $this->handleException($error);
        }
    }

    public function update(UpdateRequest $request, string $id)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission(PermissionType::COURSE_UPDATE), 403);
        $data = $request->validated();
        DB::beginTransaction();

        try {
            $target_course = Course::findOrFail($id);
            if ($target_course->semester->isOver()) {
                return Reply::error('app.errors.semester_end', [], 400);
            }
            User::where('role_id', '=', RoleType::TEACHER)
                ->select('id')->findOrFail($request->teacher_id);
            $target_course->update($data);
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
        abort_if(!$user->hasPermission(PermissionType::COURSE_DELETE), 403);

        DB::beginTransaction();
        try {
            Course::destroy($id);
            DB::commit();
            return Reply::successWithMessage('app.successes.record_delete_success');
        } catch (\Exception $error) {
            DB::rollBack();
            return $this->handleException($error);
        }
    }

    public function updateStudents(UpdateStudentsRequest $request, string $id)
    {
        $user = $this->getUser();
        abort_if(!$user->hasPermission(PermissionType::COURSE_UPDATE), 403);

        DB::beginTransaction();
        try {
            $target_course = Course::findOrFail($id);
            if ($target_course->semester->isOver()) {
                return Reply::error('app.errors.semester_end', [], 400);
            }
            $student_ids  = User::where('role_id', RoleType::STUDENT)
                ->whereIn('id', $request->student_ids)
                ->pluck('id')
                ->toArray();
            $target_course->students()->sync($student_ids);
            DB::commit();
            return Reply::successWithMessage('app.successes.record_save_success');
        } catch (\Exception $error) {
            DB::rollBack();
            return $this->handleException($error);
        }
    }
}
