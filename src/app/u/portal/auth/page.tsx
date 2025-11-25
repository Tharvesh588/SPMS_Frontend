
'use client';

import LoginForm from '@/components/login-form';
import Logo from '@/components/logo';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
        <div className="hidden bg-muted lg:block">
            <Image
                src="https://cdn.jsdelivr.net/gh/Tharvesh2026/Web-Source@main/engineering_college.webp?raw=true"
                alt="Image"
                width="1920"
                height="1080"
                className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                priority
            />
      </div>
        <div className="flex items-center justify-center py-12">
            <div className="mx-auto grid w-[350px] gap-6">
                <div className="grid gap-2 text-center">
                    <div className="flex justify-center mb-4">
                      <Logo />
                    </div>
                    <h1 className="text-3xl font-bold font-headline">Welcome Back</h1>
                    <p className="text-balance text-muted-foreground">
                        Welcome back to ProjectVerse — Continue your journey
                    </p>
                </div>
                <LoginForm />
                <div className="mt-4 text-center text-sm">
                  <Link href="/" className="underline">
                      Back to Home
                  </Link>
                </div>
            </div>
        </div>
    </div>
  );
}
