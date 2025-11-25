
'use client';

import { useRouter } from 'next/navigation';
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
import { Loader2, Mail, Lock, Users, User, Building } from 'lucide-react';
import { login } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from './ui/checkbox';
import Link from 'next/link';

const formSchema = z.object({
  role: z.enum(['admin', 'faculty', 'batch']),
  identifier: z.string().min(1, 'Email or Username is required'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof formSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: 'batch',
      identifier: '',
      password: '',
      rememberMe: false,
    },
  });

  const selectedRole = form.watch('role');

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);
    
    const credentials: { email?: string; username?: string; password?: string } = {
        password: values.password,
    };

    if (values.role === 'batch') {
        credentials.username = values.identifier;
    } else {
        credentials.email = values.identifier;
    }

    try {
      const response = await login(credentials, values.role);
      const uid = response.user.id;
      if (typeof window !== 'undefined') {
        localStorage.setItem('userId', uid);
        localStorage.setItem('userRole', values.role);
      }
      router.push(`/u/portal/${values.role}?page=dashboard`);
    } catch (error) {
      console.error("Login failed:", error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: (error as Error).message || "Invalid credentials. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const getRoleIcon = () => {
    switch (selectedRole) {
        case 'admin': return <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />;
        case 'faculty': return <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />;
        case 'batch': return <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />;
        default: return <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />;
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Login as</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="faculty">Faculty</SelectItem>
                    <SelectItem value="batch">Batch</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
            )}
        />
        
        <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
            <FormItem>
                <FormLabel>{selectedRole === 'batch' ? 'Username' : 'Email'}</FormLabel>
                <FormControl>
                  <div className="relative">
                    {getRoleIcon()}
                    <Input 
                        className="pl-10"
                        placeholder={selectedRole === 'batch' ? 'Enter your batch username' : 'name@example.com'} 
                        {...field} />
                  </div>
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
        
        <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
            <FormItem>
                <div className="flex items-center">
                    <FormLabel>Password</FormLabel>
                    <Link
                        href="#"
                        className="ml-auto inline-block text-sm underline"
                    >
                        Forgot your password?
                    </Link>
                </div>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-10" type="password" placeholder="Enter your password" {...field} required />
                  </div>
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
        </Button>
      </form>
    </Form>
  );
}
