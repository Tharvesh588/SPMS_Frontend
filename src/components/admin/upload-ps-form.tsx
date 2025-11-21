
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
import { createProblemStatement, getFaculties } from '@/lib/api';
import type { ProblemStatement, Faculty } from '@/types';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  gDriveLink: z.string().url('Must be a valid Google Drive link'),
  facultyId: z.string().min(1, 'You must select a faculty'),
});

type UploadProblemStatementFormProps = {
    onStatementCreated?: (newStatement: ProblemStatement) => void;
};


export function UploadProblemStatementForm({ onStatementCreated }: UploadProblemStatementFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchFaculties() {
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
    fetchFaculties();
  }, [toast]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      gDriveLink: '',
      facultyId: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
        const { ps } = await createProblemStatement(values);
        toast({
            title: "Problem Statement Uploaded",
            description: `"${values.title}" has been successfully uploaded.`,
        });
        form.reset();
        if(onStatementCreated) {
            // The API returns the created PS, but it might not be populated with faculty details.
            // We find the faculty from our list to provide a fully populated object.
            const faculty = faculties.find(f => f._id === ps.facultyId);
            const populatedPs = { ...ps, facultyId: faculty || ps.facultyId };
            onStatementCreated(populatedPs);
        }
    } catch(error) {
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
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Upload Problem Statement
        </Button>
      </form>
    </Form>
  );
}
