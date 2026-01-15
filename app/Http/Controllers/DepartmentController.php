<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class DepartmentController extends Controller
{
    public function index()
    {
        $departments = Department::select('id', 'name', 'description')
            ->latest()
            ->paginate(10);

        return Inertia::render('Departments/Index', [
            'departments' => $departments
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:departments,name',
            'description' => 'nullable|string|max:500',
        ]);
        Department::create($validated);
        return redirect()->back()->with('message', 'Department created successfully!');
    }


    public function update(Request $request, Department $department)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('departments', 'name')->ignore($department->id)],
            'description' => 'nullable|string|max:500',
        ]);

        $department->update($validated);

        return redirect()->back()->with('message', 'Department updated successfully!');
    }
    public function show(Department $department){
        $department->load(['users.designation']);

    return Inertia::render('Departments/Show', [
        'department' => $department,
        'employees' => $department->users,
    ]);
    }

    public function destroy(Department $department)
    {
        $department->delete();

        return redirect()->back()->with('message', 'Department deleted successfully!');
    }
}
