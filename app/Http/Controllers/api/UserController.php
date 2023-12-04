<?php

namespace App\Http\Controllers\api;

use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\DeleteRequest;
use App\Http\Requests\User\GetByTypeRequest;
use App\Http\Requests\User\ImportRequest;
use App\Http\Requests\User\StoreRequest;
use App\Http\Requests\User\UpdateRequest;
use App\Models\Course;
use App\Models\Role;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;
use PhpOffice\PhpSpreadsheet\Shared\Date;

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
        $user = request()->user()->with('role')->first();
        return Reply::successWithData($user, '');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        $user = $this->getUser();
        if (!$user->isAdmin()) return Reply::error('permission.errors.403');

        DB::beginTransaction();
        try {
            User::create([
                'role_id' => Role::ROLES[$request->role],
                'shortcode' => $request->shortcode,
                'email' => $request->email,
                'first_name' => $request->first_name,
                'last_name' => $request->name,
                'phone_number' => $request->phone_number,
                'gender' => $request->gender,
                'address' => $request->address,
                'birth_date' => $request->birth_date,
                'class' => $request->class,
                'faculty' => $request->faculty,
                'password' => Hash::make($request->password)
            ]);
            DB::commit();
            return Reply::successWithMessage('app.successes.recordSaveSuccess');
        } catch (\Throwable $error) {
            Log::error($error->getMessage());
            DB::rollBack();
            return Reply::error('app.errors.failToSaveRecord');
        }
    }
    public function getUserByType(GetByTypeRequest $request)
    {
        $user = $this->getUser();
        if (!$user->isAdmin()) return Reply::error('permission.errors.403');

        $users = User::with('role')
            ->whereRoleId(Role::ROLES[$request->role]);

        if ($request->search != null) {
            $users = $users->where(function ($query) use ($request) {
                $query->where(DB::raw("CONCAT (last_name, ' ' , first_name)"), 'like', '%' . $request->search . '%')
                    ->orWhere('class', 'like', '%' . $request->search . '%')
                    ->orWhere('shortcode', 'like', '%' . $request->search . '%')
                    ->orWhere('phone_number', 'like', '%' . $request->search . '%');
            });
        }

        $users = $users->latest('id')->paginate($request->per_page);
        return Reply::successWithData($users, '');
    }
    public function importUsers(ImportRequest $request)
    {
        $user = $this->getUser();
        if (!$user->isAdmin()) return Reply::error('permission.errors.403');
        DB::beginTransaction();
        try {
            $file = $request->file('file');
            $role_id = Role::ROLES[$request->role];
            $sheets = Excel::toArray([], $file);
            $data = [];
            foreach ($sheets[0] as $index => $row) {
                if ($index == 0) continue;
                $record = [
                    'role_id' => $role_id,
                    'shortcode' => $row[1],
                    'first_name' => $row[3],
                    'last_name' => $row[2],
                    'gender' => $row[4],
                    'email' => $row[5],
                    'phone_number' => $row[6],
                    'address' => $row[7],
                    'birth_date' => Carbon::instance(Date::excelToDateTimeObject($row[8])),
                    'is_active' => true,
                    'password' => Hash::make($row[9])
                ];
                if ($request->role == 'student') $record['class'] = $row[0];
                if ($request->role == 'teacher') $record['faculty'] = $row[0];
                $data[] = $record;
            }
            User::insert($data);
            DB::commit();
            return Reply::successWithMessage('app.successes.recordSaveSuccess');
        } catch (\Throwable $error) {
            Log::error($error->getMessage());
            DB::rollBack();
            return Reply::error('app.errors.failToSaveRecord');
        }
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
            return Reply::successWithData($data, '');
        } catch (\Throwable $error) {
            Log::error($error->getMessage());
            return Reply::error('app.errors.serverError');
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, string $id)
    {
        $user = $this->getUser();
        $data = (object)[];
        if (!$user->isAdmin() && $id != $user->id) return Reply::error('permission.errors.403');
        DB::beginTransaction();
        try {
            $data->user = User::with('role')->findOrFail($id);
            $data->user->update([
                'shortcode' => $request->shortcode,
                'email' => $request->email,
                'first_name' => $request->first_name,
                'last_name' => $request->name,
                'phone_number' => $request->phone_number,
                'gender' => $request->gender,
                'address' => $request->address,
                'birth_date' => $request->birth_date,
                'class' => $request->class,
                'faculty' => $request->faculty,
                'password' => Hash::make($request->password)
            ]);
            $data->user = $data->user->fresh();
            DB::commit();
            return Reply::successWithMessage('app.successes.recordSaveSuccess');
        } catch (\Throwable $error) {
            Log::error($error->getMessage());
            DB::rollBack();
            return Reply::error('app.errors.serverError');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DeleteRequest $request)
    {
        $user = $this->getUser();
        if (!$user->isAdmin()) return Reply::error('permission.errors.403');
        try {
            User::destroy($request->ids);
            return Reply::successWithMessage('app.successes.recordDeleteSuccess');
        } catch (\Throwable $error) {
            Log::error($error->getMessage());
            return Reply::error('app.errors.serverError');
        }
    }
}
