<?php

namespace App\Http\Controllers;

use App\Models\Designation;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class DesignationController extends Controller
{
    public function index()
    {
        $designations = Designation::select('id', 'name')
            ->latest()
            ->paginate(10);

        return Inertia::render('Designations/Index', [
            'designations' => $designations
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:designations,name',
        ]);

        Designation::create($validated);

        return redirect()->back()->with('message', 'Designation created successfully!');
    }
    public function update(Request $request, Designation $designation)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('designations', 'name')->ignore($designation->id)],
        ]);

        $designation->update($validated);

        return redirect()->back()->with('message', 'Designation updated successfully!');
    }

    public function destroy(Designation $designation)
    {
        $designation->delete();

        return redirect()->back()->with('message', 'Designation deleted successfully!');
    }
}
