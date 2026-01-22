
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { bulkUpload } from '@/lib/api';
import { Loader2, UploadCloud, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '../ui/separator';

const formSchema = z.object({
  file: z.instanceof(File, { message: 'A file is required.' }).refine(file => file.type === 'text/csv' || file.name.endsWith('.csv'), 'File must be a CSV.'),
});

type BulkUploadFormProps = {
  entity: 'faculty' | 'batch' | 'problem-statements';
  onUploadComplete: () => void;
};

type UploadResult = {
  success: boolean;
  message: string;
  results: {
    successCount: number;
    failureCount: number;
    errors: { row: number; message: string; data: any }[];
  }
};

export function BulkUploadForm({ entity, onUploadComplete }: BulkUploadFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  
  const { handleSubmit } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await bulkUpload(entity, values.file);
      setResult(response);
      toast({
        title: 'Upload Processed',
        description: `${response.results.successCount} records created, ${response.results.failureCount} failed.`,
      });
      onUploadComplete();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: (error as Error).message || 'An unexpected error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CSV File</FormLabel>
                <FormControl>
                  <div className="relative">
                    <UploadCloud className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="file"
                      className="pl-10"
                      accept=".csv"
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      onChange={(e) => {
                        field.onChange(e.target.files?.[0]);
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading || !form.watch('file')}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Upload and Process File
          </Button>
        </form>
      </Form>
      
      {result && (
        <Card className="mt-6">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Upload Results</h3>
            <div className="space-y-4">
               <div className="flex items-center gap-2 text-sm">
                 <CheckCircle className="h-5 w-5 text-green-500" /> 
                 <span className="font-medium">{result.results.successCount} rows</span> successfully imported.
               </div>
               <div className="flex items-center gap-2 text-sm">
                 <XCircle className="h-5 w-5 text-red-500" />
                 <span className="font-medium">{result.results.failureCount} rows</span> failed to import.
               </div>

              {result.results.errors && result.results.errors.length > 0 && (
                <>
                <Separator className="my-4" />
                <div>
                  <h4 className="font-semibold mb-2">Error Details:</h4>
                  <div className="max-h-40 overflow-y-auto bg-muted/50 p-3 rounded-lg text-sm border">
                    <ul className="space-y-2">
                      {result.results.errors.map((error, index) => (
                        <li key={index} className="border-b pb-2 last:border-0 last:pb-0">
                          <span className="font-semibold">Row {error.row}:</span> {error.message}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
