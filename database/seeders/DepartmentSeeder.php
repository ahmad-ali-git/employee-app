<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $departments = [
        [
            'name' => 'IT',
            'description' => 'Information Technology and Systems',
        ],
        [
            'name' => 'HR',
            'description' => 'Human Resources and Talent Acquisition',
        ],
        [
            'name' => 'Sales',
            'description' => 'Global Sales and Outreach',
        ],
        [
            'name' => 'Marketing',
            'description' => 'Branding and Advertisement',
        ],
        [
            'name' => 'Operations',
            'description' => 'Daily Business Operations',
        ],
    ];

    foreach ($departments as $dept) {
        Department::create($dept);
    }
    }
}
