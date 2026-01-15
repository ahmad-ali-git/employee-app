import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge"; // Optional: for the role/designation
import { ArrowLeft, Users } from "lucide-react";

export default function Show({ auth, department, employees }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Department Details</h2>}
        >
            <Head title={`Department: ${department.name}`} />

            <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                
                {/* 1. BACK BUTTON & HEADER */}
                <div className="mb-6">
                    <Link href={route('departments.index')} className="flex items-center text-gray-500 hover:text-gray-700">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to List
                    </Link>
                </div>

                <div className="grid gap-7 md:grid-cols-3">
                    
                    {/* 2. LEFT SIDE: Department Info Card */}
                    <div className="md:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl">{department.name}</CardTitle>
                                <CardDescription>Created on: {new Date(department.created_at).toLocaleDateString()}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Description</h4>
                                    <p className="text-gray-900 mt-1">
                                        {department.description || "No description provided."}
                                    </p>
                                </div>
                                
                                {/* Stats Widget */}
                                <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="p-3 bg-blue-100 rounded-full text-blue-600 mr-4">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Total Employees</p>
                                        <p className="text-2xl font-bold">{employees.length}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* 3. RIGHT SIDE: Employee List */}
                    <div className="md:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Team Members</CardTitle>
                                <CardDescription>Staff currently assigned to {department.name}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Email</TableHead>
                                                <TableHead>Designation</TableHead>
                                                <TableHead className="text-right">Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {employees.length > 0 ? (
                                                employees.map((employee) => (
                                                    <TableRow key={employee.id}>
                                                        <TableCell className="font-medium">{employee.name}</TableCell>
                                                        <TableCell>{employee.email}</TableCell>
                                                        <TableCell>
                                                            {employee.designation ? (
                                                                <Badge variant="outline">{employee.designation.name}</Badge>
                                                            ) : (
                                                                <span className="text-gray-400 text-sm">-</span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                Active
                                                            </span>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="h-24 text-center text-gray-500">
                                                        No employees found in this department.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}