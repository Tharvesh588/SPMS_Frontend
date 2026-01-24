
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createProblemStatement, getFaculties, createProblemStatementAsFaculty } from '@/lib/api';
import type { ProblemStatement, Faculty } from '@/types';
import { departments, departmentValues } from '@/lib/constants';

const formSchemaAsAdmin = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  gDriveLink: z.string().url('Must be a valid Google Drive link'),
  department: z.string().refine((val) => departmentValues.includes(val), {
    message: 'Please select a valid department',
  }),
  domain: z.string().min(1, 'Domain is required'),
  facultyId: z.string().min(1, 'You must select a faculty'),
});

const formSchemaAsFaculty = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  gDriveLink: z.string().url('Must be a valid Google Drive link'),
  domain: z.string().min(1, 'Domain is required'),
});


type UploadProblemStatementFormProps = {
  onStatementCreated?: (newStatement: ProblemStatement) => void;
  // If running as faculty, we don't need faculty selection.
  asRole?: 'admin' | 'faculty';
};


export function UploadProblemStatementForm({ onStatementCreated, asRole = 'admin' }: UploadProblemStatementFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const { toast } = useToast();

  const isFacultyRole = asRole === 'faculty';
  const formSchema = isFacultyRole ? formSchemaAsFaculty : formSchemaAsAdmin;

  useEffect(() => {
    async function fetchFaculties() {
      if (!isFacultyRole) { // Only fetch faculties if we're in admin role
        try {
          const data = await getFaculties();
          setFaculties(data);
        } catch (error) {
          toast({
            variant: 'destructive',
            title: 'Failed to load faculties',
            description: 'Could not fetch the list of faculties for selection.',
          });
        }
      }
    }
    fetchFaculties();
  }, [toast, isFacultyRole]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      gDriveLink: '',
      domain: '',
      ...(!isFacultyRole && { facultyId: '', department: '' }),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      let newPs: ProblemStatement;
      if (isFacultyRole) {
        const result = await createProblemStatementAsFaculty(values);
        newPs = result.ps;
      } else {
        const adminValues = values as z.infer<typeof formSchemaAsAdmin>;
        const result = await createProblemStatement(adminValues);
        newPs = result.ps;
      }

      toast({
        title: "Problem Statement Uploaded",
        description: `"${values.title}" has been successfully uploaded.`,
      });
      form.reset();

      if (onStatementCreated) {
        let populatedPs = newPs;
        if (!isFacultyRole) {
          const adminValues = values as z.infer<typeof formSchemaAsAdmin>;
          const faculty = faculties.find(f => f._id === adminValues.facultyId);
          if (faculty) {
            populatedPs = { ...newPs, facultyId: faculty };
          }
        }
        onStatementCreated(populatedPs);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: (error as Error).message || "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter the project title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the problem statement in detail" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gDriveLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Google Drive Link</FormLabel>
              <FormControl>
                <Input placeholder="https://docs.google.com/..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="domain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Domain *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., AGENTIC AI, MACHINE LEARNING, IMAGE PROCESSING" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!isFacultyRole && (
          <>
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
              name="facultyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Faculty</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a faculty to assign this to" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {faculties.map(faculty => (
                        <SelectItem key={faculty._id} value={faculty._id}>{faculty.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Upload Problem Statement
        </Button>
      </form>
    </Form>
  );
}
