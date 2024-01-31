<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CourseController extends Controller
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
	public function byUser(string $id)
	{
		// if ($data->user == null) return Reply::successWithData($data, '');
		// # Get course
		// switch ($data->user->role_id) {
		//     case Role::ROLES['student']:
		//         $data->courses = Course::whereHas('semester', function ($query) use ($now) {
		//             $query->whereDate('start_date', '<=', $now)
		//                 ->whereDate('end_date', '>=', $now);
		//         })->whereHas('enrollments', function ($query) use ($id) {
		//             $query->where('student_id', '=', $id);
		//         });
		//         break;
		//     case Role::ROLES['teacher']:
		//         $data->courses = Course::whereHas('semester', function ($query) use ($now) {
		//             $query->whereDate('start_date', '<=', $now)
		//                 ->whereDate('end_date', '>=', $now);
		//         })->where('teacher_id', '=', $data->user->id);
		//         break;
		//     default:
		//         $data->courses = [];
		//         break;
		// }
	}
}
