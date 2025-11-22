
'use client';

import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useState } from 'react';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { saveStudentsForBatch } from '@/lib/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const studentSchema = z.object({
  nameInitial: z.string().min(1, 'Name with initial is required'),
  rollNumber: z.string().min(1, 'Roll number is required'),
  dept: z.string().min(1, 'Department is required'),
  section: z.string().min(1, 'Section is required'),
  year: z.string().min(1, 'Year is required'),
  mailId: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Must be a valid phone number'),
});

const formSchema = z.object({
  students: z.array(studentSchema).min(1, 'At least one student is required').max(7, 'You can add a maximum of 7 students'),
});

type SaveStudentsFormProps = {
  onStudentsSaved: () => void;
};

export function SaveStudentsForm({ onStudentsSaved }: SaveStudentsFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      students: [{ nameInitial: '', rollNumber: '', dept: '', section: '', year: 'IV', mailId: '', phone: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'students',
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const batchId = localStorage.getItem('userId');
    if (!batchId) {
      toast({ variant: 'destructive', title: 'Error', description: 'Batch ID not found.' });
      return;
    }
    
    setIsLoading(true);
    try {
      await saveStudentsForBatch(batchId, values.students);
      toast({
        title: "Student Details Saved",
        description: "Your team details have been successfully saved.",
      });
      onStudentsSaved();
    } catch(error) {
      console.error('Failed to save student details:', error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: (error as Error).message || "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Enter Your Team Details</CardTitle>
        <CardDescription>
          Welcome! Before you can select a project, please provide the details for each member of your batch.
          You can add up to 7 members.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
                <p className="font-semibold">Student {index + 1}</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField control={form.control} name={`students.${index}.nameInitial`} render={({ field }) => (
                    <FormItem><FormLabel>Name with Initial</FormLabel><FormControl><Input placeholder="e.g., John D." {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name={`students.${index}.rollNumber`} render={({ field }) => (
                    <FormItem><FormLabel>Roll Number</FormLabel><FormControl><Input placeholder="e.g., 7377211..." {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                 <div className="grid md:grid-cols-3 gap-4">
                     <FormField control={form.control} name={`students.${index}.dept`} render={({ field }) => (
                        <FormItem><FormLabel>Department</FormLabel><FormControl><Input placeholder="e.g., CSE" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name={`students.${index}.section`} render={({ field }) => (
                        <FormItem><FormLabel>Section</FormLabel><FormControl><Input placeholder="e.g., A" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField
                        control={form.control}
                        name={`students.${index}.year`}
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Year</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select year" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                <SelectItem value="I">I</SelectItem>
                                <SelectItem value="II">II</SelectItem>
                                <SelectItem value="III">III</SelectItem>
                                <SelectItem value="IV">IV</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField control={form.control} name={`students.${index}.mailId`} render={({ field }) => (
                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="e.g., student@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name={`students.${index}.phone`} render={({ field }) => (
                    <FormItem><FormLabel>Phone</FormLabel><FormControl><Input placeholder="e.g., 9876543210" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>

                {fields.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive" onClick={() => remove(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
             {form.formState.errors.students && !form.formState.errors.students.root && (
                 <p className="text-sm font-medium text-destructive">{form.formState.errors.students.message}</p>
             )}

            {fields.length < 7 && (
              <Button type="button" variant="outline" onClick={() => append({ nameInitial: '', rollNumber: '', dept: '', section: '', year: 'IV', mailId: '', phone: '' })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Another Member
              </Button>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save and Continue
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
