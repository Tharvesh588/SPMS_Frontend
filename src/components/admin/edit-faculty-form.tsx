
'use client';

import { useForm } from 'react-hook-form';
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
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateFaculty } from '@/lib/api';
import type { Faculty } from '@/types';
import { departments, departmentValues } from '@/lib/constants';

const formSchema = z.object({
  name: z.string().min(1, 'Faculty name is required'),
  email: z.string().email('Invalid email address'),
  department: z.string().refine((val) => departmentValues.includes(val), {
    message: 'Please select a valid department',
  }),
  quotaLimit: z.coerce.number().min(0, 'Quota must be 0 or more'),
});

type EditFacultyFormProps = {
  faculty: Faculty;
  onFacultyUpdated: (updatedFaculty: Faculty) => void;
};

export function EditFacultyForm({ faculty, onFacultyUpdated }: EditFacultyFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: faculty.name,
      email: faculty.email,
      department: faculty.department,
      quotaLimit: faculty.quotaLimit,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const { faculty: updatedFaculty } = await updateFaculty(faculty._id, values);
      toast({
        title: "Faculty Account Updated",
        description: `Account for ${values.name} has been successfully updated.`,
      });
      onFacultyUpdated(updatedFaculty);
    } catch (error) {
        const err = error as Error;
        console.error('Failed to update faculty:', error);
        toast({
            variant: "destructive",
            title: "Failed to update faculty",
            description: err.message || "An unexpected error occurred.",
        });
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Dr. Alan Turing" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="e.g., alan.turing@university.edu" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.value} value={dept.value}>{dept.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quotaLimit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Quota</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Update Faculty Account
        </Button>
      </form>
    </Form>
  );
}
