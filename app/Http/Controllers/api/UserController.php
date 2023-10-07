<?php

namespace App\Http\Controllers\api;

use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
        $validated = $request->validate([
            'role_id' => ['required', 'integer', 'in:1,2,3'],
            'short_code' => ['required', 'string', 'unique:users', 'max:255'],
            'email' => ['required', 'email', 'unique:users'],
            'phone_numeber' => ['string', 'unique:users', 'max:10'],
            'gender' => ['required', 'in:male,female'],
            'address' => ['required', 'string', 'max:255'],
            'birth_date' => ['required', 'date_format:Y-m-d', 'before:today'],
            // 'class'=>[],
            // 'faculty'=>[],
            'password' => ['required', 'min:8']
        ]);
        DB::beginTransaction();
        try {
            User::create($validated);
            DB::commit();
            return Reply::successWithMessage('app.successes.recordSaveSuccess');
        } catch (\Throwable $error) {
            DB::rollBack();
            return Reply::error('app.errors.failToSaveRecord');
        }
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
