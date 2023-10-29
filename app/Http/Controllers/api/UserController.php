<?php

namespace App\Http\Controllers\api;

use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    private static $per_page = 20;
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
        $validated = $request->validate([
            'role' => ['required', 'string', 'in:student,teacher,admin'],
            'shortcode' => ['required', 'string', 'unique:users', 'max:255'],
            'email' => ['required', 'email', 'unique:users'],
            'name' => ['required', 'max:255'],
            'phone_numeber' => ['string', 'unique:users', 'max:10'],
            'gender' => ['required', 'in:male,female'],
            'address' => ['required', 'string', 'max:255'],
            'birth_date' => ['required', 'date_format:Y-m-d', 'before:today'],
            'class' => ['nullable'],
            // 'faculty'=>[],
            'password' => ['required', 'min:8']
        ]);
        DB::beginTransaction();
        try {
            User::create([
                'role_id' => Role::where('name', '=',  $validated['role'])->first()->id,
                'shortcode' => $validated['shortcode'],
                'email' => $validated['email'],
                'name' => $validated['name'],
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
        $validated = $request->validate([
            'role' => ['required', 'string', 'in:student,teacher,admin'],
            'per_page' => ['required', 'integer', 'in:10,20,30'],
            'page' => ['nullable', 'integer'],
        ]);
        $users = User::with('role')->whereHas('role', function ($query) use ($validated) {
            $query->where('name', '=', $validated['role']);
        })->latest('id')->paginate(UserController::$per_page);
        return $users;
    }
    public function importUsers(Request $request)
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
