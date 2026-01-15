<?php

namespace App\Http\Controllers;

use App\Jobs\SendWelcomeEmail;
use App\Models\Department;
use App\Models\Designation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with(['department', 'designation']);

        // 1. Handle Search
        $query->search($request->search, ['name', 'email']);
        
        if ($request->has('role') && $request->role !== 'all') {
            $query->where('role', $request->role);
        }

        $employees = $query->paginate(10)->appends($request->query());
        $departments = Department::select('id', 'name')->get();
        $designations = Designation::select('id', 'name')->get();


        return Inertia::render('Employees/Index', [
            'employees' => $employees,
            'filters' => $request->only(['search', 'role']),
            'designations' => $designations,
            'departments' => $departments,
        ]);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'department_id' => 'required|exists:departments,id',
            'designation_id' => 'required|exists:designations,id',
            'role' => 'required|in:admin,employee,manager',
        ]);
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'department_id' => $validated['department_id'],
            'password' => Hash::make('password123'),
            'designation_id' => $validated['designation_id'],

        ]);
        SendWelcomeEmail::dispatch($user);
        return Redirect::route('employees.index');
    }

    public function update(Request $request, User $employee)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            // "Rule::unique" tells DB: Check users table, check email column, but IGNORE this $employee->id
            'email' => ['required', 'email', Rule::unique('users', 'email')->ignore($employee->id)],
            'department_id' => 'required|exists:departments,id',
            'designation_id' => 'required|exists:designations,id',
        ]);

        $employee->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'department_id' => $validated['department_id'],
            'designation_id' => $validated['designation_id'],
        ]);

        return redirect()->back()->with('message', 'Employee updated successfully');
    }

    public function destroy(User $employee)
    {
        if ($employee->id === auth()->id()) {
            return back()->withErrors(['error' => 'You cannot delete your own account.']);
        }
        $employee->delete();

        return back();
    }
}
