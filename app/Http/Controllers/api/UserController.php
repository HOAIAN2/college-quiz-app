<?php

namespace App\Http\Controllers\api;

use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    function __construct()
    {
        parent::__construct();
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return request()->user()->with('role')->first();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = $this->getUser();
        if (!$user->isAdmin()) return Reply::error('permission.errors.403');

        $validated = $request->validate([
            'role' => ['required', 'string', 'in:student,teacher,admin'],
            'shortcode' => ['required', 'string', 'unique:users', 'max:255'],
            'email' => ['required', 'email', 'unique:users'],
            'first_name' => ['required', 'max:255'],
            'last_name' => ['required', 'max:255'],
            'phone_numeber' => ['string', 'unique:users', 'max:10'],
            'gender' => ['required', 'in:male,female'],
            'address' => ['required', 'string', 'max:255'],
            'birth_date' => ['required', 'date_format:Y-m-d', 'before:today'],
            'class' => ['required_if:role,student'],
            // 'faculty'=>[],
            'password' => ['required', 'min:8']
        ]);
        DB::beginTransaction();
        try {
            User::create([
                'role_id' => Role::where('name', '=',  $validated['role'])->first()->id,
                'shortcode' => $validated['shortcode'],
                'email' => $validated['email'],
                'first_name' => $validated['first_name'],
                'last_name' => $validated['name'],
                'phone_numeber' => $validated['phone_number'],
                'gender' => $validated['gender'],
                'address' => $validated['address'],
                'birth_date' => $validated['birth_date'],
                'class' => $validated['class'],
                // 'faculty'=>[],
                'password' => Hash::make($validated['password'])
            ]);
            DB::commit();
            return Reply::successWithMessage('app.successes.recordSaveSuccess');
        } catch (\Throwable $error) {
            DB::rollBack();
            return Reply::error('app.errors.failToSaveRecord');
        }
    }
    public function getUserByType(Request $request)
    {
        $user = $this->getUser();
        if (!$user->isAdmin()) return Reply::error('permission.errors.403');

        $validated = $request->validate([
            'role' => ['required', 'string', 'in:student,teacher,admin'],
            'per_page' => ['required', 'integer', 'in:10,20,30,40,50'],
            'page' => ['nullable', 'integer'],
            'search' => ['nullable', 'string'],
        ]);
        $users = User::with('role')
            ->whereRoleId(Role::ROLES[$validated['role']]);
        if ($request->search != null) {
            $users = $users->where(function ($query) use ($validated) {
                $query->where(DB::raw("CONCAT (last_name, ' ' , first_name)"), 'like', '%' . $validated['search'] . '%')
                    ->orWhere('class', 'like', '%' . $validated['search'] . '%')
                    ->orWhere('shortcode', 'like', '%' . $validated['search'] . '%')
                    ->orWhere('phone_number', 'like', '%' . $validated['search'] . '%');
            });
        }
        $users = $users->latest('id')->paginate($validated['per_page']);
        return $users;
    }
    public function importUsers(Request $request)
    {
        //
    }
    /**
     * Display the specified resource.
     */
    public function show(Request $request, string $id)
    {
        $user = $this->getUser();
        $now = now();

        if (!$user->isAdmin() && $id != $user->id) return Reply::error('permission.errors.403');
        $data = (object)[];
        try {
            $data->user = User::with('role')->find($id);
            if ($data->user == null) return $data;
            # Get course
            switch ($data->user->role_id) {
                case Role::ROLES['student']:
                    $data->courses = Course::whereHas('semester', function ($query) use ($now) {
                        $query->whereDate('start_date', '<=', $now)
                            ->whereDate('end_date', '>=', $now);
                    })->whereHas('enrollments', function ($query) use ($id) {
                        $query->where('student_id', '=', $id);
                    });
                    break;
                case Role::ROLES['teacher']:
                    $data->courses = Course::whereHas('semester', function ($query) use ($now) {
                        $query->whereDate('start_date', '<=', $now)
                            ->whereDate('end_date', '>=', $now);
                    })->where('teacher_id', '=', $data->user->id);
                    break;
                default:
                    $data->courses = [];
                    break;
            }
        } catch (\Throwable $th) {
            return Reply::error('app.errors.serverError');
        }
        return $data;
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
