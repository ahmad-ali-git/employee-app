import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, UserPlus, TrendingUp } from "lucide-react";

export default function Dashboard({ auth, totalEmployees, totalDepartments, recentHires, deptStats }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* 1. TOP STATS CARDS */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                        
                        {/* Total Employees */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalEmployees}</div>
                                <p className="text-xs text-muted-foreground">+2 from last month</p>
                            </CardContent>
                        </Card>

                        {/* Total Departments */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Departments</CardTitle>
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalDepartments}</div>
                                <p className="text-xs text-muted-foreground">Active Operational Units</p>
                            </CardContent>
                        </Card>

                        {/* Example Static Card */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
                                <UserPlus className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">3</div>
                                <p className="text-xs text-muted-foreground">Hiring active</p>
                            </CardContent>
                        </Card>

                         {/* Example Static Card */}
                         <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">98%</div>
                                <p className="text-xs text-muted-foreground">+5% from last year</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* 2. SPLIT VIEW: RECENT ACTIVITY & DEPT STATS */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        
                        {/* Left Side: Recent Hires (Takes up 4 columns) */}
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Recent Hires</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-8">
                                    {recentHires.map((user) => (
                                        <div key={user.id} className="flex items-center">
                                            {/* Avatar Fallback Circle */}
                                            <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold mr-4">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div className="ml-4 space-y-1">
                                                <p className="text-sm font-medium leading-none">{user.name}</p>
                                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                            </div>
                                            <div className="ml-auto font-medium text-sm text-gray-500">
                                                {user.department ? user.department.name : 'No Dept'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Department Stats</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {deptStats.map((dept) => (
                                        <div key={dept.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none">{dept.name}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="font-bold text-sm">{dept.users_count}</div>
                                                <Users className="h-3 w-3 text-muted-foreground" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}