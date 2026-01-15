import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";

export default function Index({ auth, designations }) {
    const [open, setOpen] = useState(false);
    const [editingDesig, setEditingDesig] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
    });

    const handleCreate = () => {
        setEditingDesig(null);
        reset();
        setOpen(true);
    };

    const handleEdit = (desig) => {
        setEditingDesig(desig);
        setData({ name: desig.name });
        setOpen(true);
    };

    const handleDelete = (desig) => {
        if (confirm(`Delete ${desig.name}?`)) {
            router.delete(route('designations.destroy', desig.id));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingDesig) {
            put(route('designations.update', editingDesig.id), {
                onSuccess: () => setOpen(false),
            });
        } else {
            post(route('designations.store'), {
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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Designations</h2>}
        >
            <Head title="Designations" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-medium text-gray-900">Job Titles</h3>
                        <Button onClick={handleCreate}>+ Create Designation</Button>
                    </div>

                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>{editingDesig ? 'Edit Title' : 'Add New Title'}</DialogTitle>
                                <DialogDescription>Manage job titles.</DialogDescription>
                            </DialogHeader>

                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Title Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="mt-1"
                                    />
                                    {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
                                </div>

                                <DialogFooter>
                                    <Button type="submit" disabled={processing}>Save</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">ID</TableHead>
                                    <TableHead>Designation Name</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {designations.data.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.id}</TableCell>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleEdit(item)}>
                                                        <Pencil className="mr-2 h-4 w-4" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem 
                                                        className="text-red-600 cursor-pointer" 
                                                        onClick={() => handleDelete(item)}
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