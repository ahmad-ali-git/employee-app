<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Department;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard', [
            // 1. Top Cards Data
            'totalEmployees' => User::where('role', '!=', 'superadmin')->count(),
            'totalDepartments' => Department::count(),
            
            // 2. Recent Activity (Last 5 Hires)
            // specific fields only to save bandwidth
            'recentHires' => User::with('department')
                ->where('role', '!=', 'superadmin')
                ->latest()
                ->take(5)
                ->get(['id', 'name', 'email', 'created_at', 'department_id']),

            // 3. Department Distribution (Name + Count)
            // This is a "Group By" query magic
            'deptStats' => Department::withCount('users')->get(),
        ]);
    }
}