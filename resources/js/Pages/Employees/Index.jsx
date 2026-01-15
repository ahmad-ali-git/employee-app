import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { router } from '@inertiajs/react';
// We removed DataTable and columns imports to gain full control here
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
    Card,
} from "@/components/ui/card";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
// Import Dropdown for the Edit/Delete actions
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

export default function Index({ auth, employees, filters, departments, designations }) {
    const [open, setOpen] = useState(false);

    const [editingUser, setEditingUser] = useState(null);

    // Form Hook (Added 'put' for updates)
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        email: '',
        role: 'employee',
        department_id: '',
        designation_id: '',
    });

    // 🧠 2. NEW FUNCTION: Open Modal in "Create Mode"
    const handleCreate = () => {
        setEditingUser(null); // Reset mode to "Create"
        reset();              // Clear form
        setOpen(true);        // Open modal
    };

    // 🧠 3. NEW FUNCTION: Open Modal in "Edit Mode"
    const handleEdit = (user) => {
        setEditingUser(user); // Switch mode to "Edit"

        // Pre-fill the form with the user's existing data
        setData({
            name: user.name,
            email: user.email,
            role: user.role,
            // Convert numbers to strings for Select components to work
            department_id: user.department_id ? user.department_id.toString() : '',
            designation_id: user.designation_id ? user.designation_id.toString() : '',
        });

        setOpen(true); // Open modal
    };

    const submit = (e) => {
        e.preventDefault();

        // 🧠 4. CONDITIONAL SUBMIT: Are we Creating or Updating?
        if (editingUser) {
            // EDIT MODE: Send PUT request to 'update' route
            put(route('employees.update', editingUser.id), {
                onSuccess: () => {
                    setOpen(false);
                    reset();
                    setEditingUser(null);
                },
            });
        } else {
            // CREATE MODE: Send POST request to 'store' route
            post(route('employees.store'), {
                onSuccess: () => {
                    setOpen(false);
                    reset();
                },
            });
        }
    };

    const handleSearch = (e) => {
        router.get(
            route('employees.index'),
            { search: e.target.value },
            { preserveState: true, replace: true }
        );
    };
    const handleDelete = (user) => {
        if (confirm(`Are you sure you want to delete ${user.name}?`)) {
            router.delete(route('employees.destroy', user.id), {
                preserveScroll: true,
                onSuccess: () => {
                }
            });
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Employees" />

            <div className="py-10 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Employee List</h1>
                        <p className="text-gray-500 mt-1">Manage your team members and permissions.</p>
                    </div>

                    {/* Change Button to use our custom handler */}
                    <Button onClick={handleCreate} className="bg-gray-900 hover:bg-gray-800 text-white">
                        + Create Employee
                    </Button>
                </div>

                {/* MODAL SECTION */}
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            {/* Dynamic Title based on mode */}
                            <DialogTitle>{editingUser ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
                        </DialogHeader>

                        <form onSubmit={submit} className="space-y-4 mt-4">
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
                            </div>

                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                            </div>

                            {/* DEPARTMENTS */}
                            <div>
                                <Label>Department</Label>
                                <Select value={data.department_id} onValueChange={(val) => setData('department_id', val)}>
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Select Department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {departments.map(dept => (
                                            <SelectItem key={dept.id} value={dept.id.toString()}>{dept.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.department_id && <span className="text-red-500 text-sm">{errors.department_id}</span>}
                            </div>

                            {/* DESIGNATIONS */}
                            <div>
                                <Label>Designation</Label>
                                <Select value={data.designation_id} onValueChange={(val) => setData('designation_id', val)}>
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Select Designation" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {designations.map(desig => (
                                            <SelectItem key={desig.id} value={desig.id.toString()}>{desig.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.designation_id && <span className="text-red-500 text-sm">{errors.designation_id}</span>}
                            </div>

                            <DialogFooter>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* MAIN TABLE CARD */}
                <Card className="shadow-sm border-gray-200">
                    <div className="p-4 flex flex-col sm:flex-row justify-between gap-4 border-b border-gray-100 bg-white rounded-t-lg">
                        <div className="w-full sm:w-1/3">
                            <Input
                                placeholder="Search employees..."
                                className="w-full"
                                defaultValue={filters.search}
                                onChange={handleSearch}
                            />
                        </div>
                    </div>

                    {/* 🧠 5. MANUAL TABLE IMPLEMENTATION */}
                    {/* We replaced <DataTable /> with this manual table to easily access 'handleEdit' */}
                    <div className="bg-white overflow-hidden sm:rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead>Designation</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {employees.data.map((employee) => (
                                    <TableRow key={employee.id}>
                                        <TableCell className="font-medium">{employee.name}</TableCell>
                                        <TableCell>{employee.email}</TableCell>
                                        <TableCell>{employee.department ? employee.department.name : '-'}</TableCell>
                                        <TableCell>{employee.designation ? employee.designation.name : '-'}</TableCell>
                                        <TableCell className="text-right">

                                            {/* Action Dropdown */}
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>

                                                    {/* EDIT BUTTON: Triggers our new function */}
                                                    <DropdownMenuItem onClick={() => handleEdit(employee)}>
                                                        Edit Employee
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem
                                                        className="text-red-600 focus:text-red-600 cursor-pointer"
                                                        onClick={() => handleDelete(employee)}
                                                    >
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>

                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination Footer */}
                    <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <div className="text-sm text-gray-500">
                            Showing {employees.from} to {employees.to} of {employees.total} results
                        </div>
                        <div className="flex gap-2">
                            {/* Standard pagination links logic here if needed */}
                        </div>
                    </div>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}