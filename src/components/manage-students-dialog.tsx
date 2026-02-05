'use client';

import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Plus, Loader2, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { updateBatchStudentsAsAdmin, updateBatchStudentsAsFaculty } from '@/lib/api';
import type { Batch } from '@/types';
import { departments } from '@/lib/constants'; // Assuming departments are constant

const studentSchema = z.object({
    nameInitial: z.string().min(1, 'Name is required'),
    rollNumber: z.string().min(1, 'Roll Number is required'),
    dept: z.string().min(1, 'Department is required'),
    section: z.string().min(1, 'Section is required'),
    year: z.string().min(1, 'Year is required'),
    mailId: z.string().email('Invalid email address'),
    phone: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits'),
});

const formSchema = z.object({
    students: z.array(studentSchema).max(7, 'Maximum 7 students allowed'),
});

type ManageStudentsDialogProps = {
    batch: Batch | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userRole: 'Admin' | 'Faculty';
    onBatchUpdated: (updatedBatch: Batch) => void;
};

export function ManageStudentsDialog({ batch, open, onOpenChange, userRole, onBatchUpdated }: ManageStudentsDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            students: [],
        },
    });

    const { fields, append, remove, replace } = useFieldArray({
        control: form.control,
        name: "students",
    });

    // Load students when dialog opens or batch changes
    useEffect(() => {
        if (batch && open) {
            if (batch.students && batch.students.length > 0) {
                replace(batch.students);
            } else {
                // If no students (rare but possible), start with one empty? Or just empty.
                replace([]);
            }
        }
    }, [batch, open, replace]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!batch) return;
        setIsLoading(true);
        try {
            let result;
            if (userRole === 'Admin') {
                result = await updateBatchStudentsAsAdmin(batch._id, values.students);
            } else {
                result = await updateBatchStudentsAsFaculty(batch._id, values.students);
            }

            toast({
                title: "Students Updated",
                description: result.message || "Batch students have been successfully updated.",
            });
            onBatchUpdated(result.batch);
            onOpenChange(false);
        } catch (error) {
            console.error('Failed to update students:', error);
            toast({
                variant: "destructive",
                title: "Update Failed",
                description: (error as Error).message || "An unexpected error occurred.",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl h-[90vh]">
                <DialogHeader>
                    <DialogTitle>Manage Student Details</DialogTitle>
                    <DialogDescription>
                        Add, modify, or remove students for batch: <span className="font-semibold text-foreground">{batch?.batchName}</span>.
                        Max 7 students.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
                        <ScrollArea className="flex-1 pr-4 -mr-4 mb-4">
                            <div className="space-y-4 p-1">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border rounded-lg bg-slate-50 dark:bg-slate-900 relative group">
                                        <div className="md:col-span-12 flex justify-between items-center mb-2">
                                            <h4 className="font-medium text-sm text-muted-foreground">Student {index + 1}</h4>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={() => remove(index)}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>

                                        {/* Name */}
                                        <div className="md:col-span-3">
                                            <FormField
                                                control={form.control}
                                                name={`students.${index}.nameInitial`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs">Name</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Name" className="h-8" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        {/* Roll No */}
                                        <div className="md:col-span-3">
                                            <FormField
                                                control={form.control}
                                                name={`students.${index}.rollNumber`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs">Roll No.</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Roll No" className="h-8" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        {/* Email */}
                                        <div className="md:col-span-3">
                                            <FormField
                                                control={form.control}
                                                name={`students.${index}.mailId`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs">Email</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Email" className="h-8" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        {/* Phone */}
                                        <div className="md:col-span-3">
                                            <FormField
                                                control={form.control}
                                                name={`students.${index}.phone`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs">Phone</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Phone" className="h-8" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        {/* Dept */}
                                        <div className="md:col-span-2">
                                            <FormField
                                                control={form.control}
                                                name={`students.${index}.dept`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs">Dept</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="h-8">
                                                                    <SelectValue placeholder="Dept" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {departments.map(d => (
                                                                    <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        {/* Section */}
                                        <div className="md:col-span-1">
                                            <FormField
                                                control={form.control}
                                                name={`students.${index}.section`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs">Sec</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="h-8">
                                                                    <SelectValue placeholder="Sec" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {['A', 'B', 'C', 'D'].map(sec => (
                                                                    <SelectItem key={sec} value={sec}>{sec}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        {/* Year */}
                                        <div className="md:col-span-1">
                                            <FormField
                                                control={form.control}
                                                name={`students.${index}.year`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs">Year</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="h-8">
                                                                    <SelectValue placeholder="Year" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {['I', 'II', 'III', 'IV'].map(y => (
                                                                    <SelectItem key={y} value={y}>{y}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                    </div>
                                ))}

                                {fields.length < 7 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full border-dashed"
                                        onClick={() => append({
                                            nameInitial: '',
                                            rollNumber: '',
                                            dept: 'AIDS', // Default
                                            section: 'A',
                                            year: 'IV',
                                            mailId: '',
                                            phone: ''
                                        })}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Student
                                    </Button>
                                )}
                            </div>
                        </ScrollArea>

                        <div className="flex justify-end gap-2 pt-4 border-t mt-auto">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
