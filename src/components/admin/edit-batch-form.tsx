
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
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateBatch } from '@/lib/api';
import type { Batch } from '@/types';

const formSchema = z.object({
  batchName: z.string().min(1, 'Batch name is required'),
  username: z.string().min(1, 'Username is required'),
});

type EditBatchFormProps = {
  batch: Batch;
  onBatchUpdated: (updatedBatch: Batch) => void;
};

export function EditBatchForm({ batch, onBatchUpdated }: EditBatchFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      batchName: batch.batchName,
      username: batch.username,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
        const { batch: updatedBatch } = await updateBatch(batch._id, values);
        toast({
            title: "Batch Account Updated",
            description: `Account for ${values.batchName} has been successfully updated.`,
        });
        onBatchUpdated(updatedBatch);
    } catch(error) {
        console.error('Failed to update batch:', error);
        toast({
            variant: "destructive",
            title: "Failed to update batch",
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
          name="batchName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Batch Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Computer Science 2024" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter a unique username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Update Batch Account
        </Button>
      </form>
    </Form>
  );
}
