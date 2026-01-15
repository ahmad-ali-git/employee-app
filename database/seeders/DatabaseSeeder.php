<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Department;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Departments 🏢
        $this->call(DepartmentSeeder::class);
        
        // Fetch all departments (We need their IDs)
        $departments = Department::all();

        // 2. Create Super Admin (Assigned to the first department) 🦸‍♂️
        User::create([
            'name'      => 'Super Admin',
            'email'     => 'admin@example.com',
            'password'  => Hash::make('password'),
            'role'      => 'superadmin',
            // Safely assign the first department ID
            'department_id' => $departments->first()->id,
        ]);

        // 3. Create 50 Employees (The Robust Way) 👥
        // We manually force the department_id logic here.
        User::factory(50)->create([
            'role' => 'employee',
            'department_id' => fn () => $departments->random()->id,
        ]);
    }
}