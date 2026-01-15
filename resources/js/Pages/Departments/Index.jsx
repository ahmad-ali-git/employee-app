import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react'; // Added router
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash, Eye } from "lucide-react";

export default function Index({ auth, departments }) {
    const [open, setOpen] = useState(false);
    const [editingDept, setEditingDept] = useState(null); // 👈 Track edit state

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        description: '',
    });

    // 1. Open "Create" Modal
    const handleCreate = () => {
        setEditingDept(null);
        reset();
        setOpen(true);
    };

    // 2. Open "Edit" Modal
    const handleEdit = (dept) => {
        setEditingDept(dept);
        setData({
            name: dept.name,
            description: dept.description || '',
        });
        setOpen(true);
    };

    // 3. Handle Delete
    const handleDelete = (dept) => {
        if (confirm(`Are you sure you want to delete ${dept.name}?`)) {
            router.delete(route('departments.destroy', dept.id));
        }
    };

    // 4. Submit Form (Create or Update)
    const submit = (e) => {
        e.preventDefault();

        if (editingDept) {
            put(route('departments.update', editingDept.id), {
                onSuccess: () => setOpen(false),
            });
        } else {
            post(route('departments.store'), {
                onSuccess: () => {
                    setOpen(false);
                    reset();
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Departments</h2>}
        >
            <Head title="Departments" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-medium text-gray-900">Department List</h3>
                        <Button onClick={handleCreate}>+ Create Department</Button>
                    </div>

                    {/* MODAL */}
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>{editingDept ? 'Edit Department' : 'Add New Department'}</DialogTitle>
                                <DialogDescription>
                                    Manage your organization's departments here.
                                </DialogDescription>
                            </DialogHeader>

                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g. IT, HR"
                                        className="mt-1"
                                    />
                                    {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
                                </div>

                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="mt-1"
                                    />
                                    {errors.description && <span className="text-red-500 text-sm">{errors.description}</span>}
                                </div>

                                <DialogFooter>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Saving...' : 'Save Department'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* TABLE */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {departments.data.map((dept) => (
                                    <TableRow key={dept.id}>
                                        <TableCell className="font-medium">{dept.id}</TableCell>
                                        <TableCell>{dept.name}</TableCell>
                                        <TableCell>{dept.description || '-'}</TableCell>
                                        <TableCell className="text-right">

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={route('departments.show', dept.id)} className="cursor-pointer flex items-center w-full">
                                                            <Eye className="mr-2 h-4 w-4" /> View Details
                                                        </Link>
                                                    </DropdownMenuItem>

                                                    {/* 👇 THE FIX IS HERE */}
                                                    <DropdownMenuItem
                                                        className="cursor-pointer"
                                                        onClick={(e) => {
                                                            handleEdit(dept);
                                                        }}
                                                    >
                                                        <Pencil className="mr-2 h-4 w-4" /> Edit
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem
                                                        className="text-red-600 focus:text-red-600 cursor-pointer"
                                                        onClick={() => handleDelete(dept)}
                                                    >
                                                        <Trash className="mr-2 h-4 w-4" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>

                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}