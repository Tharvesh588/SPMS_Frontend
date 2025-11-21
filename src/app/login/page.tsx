
import LoginForm from '@/components/login-form';
import Logo from '@/components/logo';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-4">
        <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo />
            </div>
          <h1 className="text-3xl font-bold font-headline">Login to ProjectVerse</h1>
          <p className="text-muted-foreground">Enter your credentials to access your dashboard</p>
        </div>
        <LoginForm />
         <p className="mt-8 px-8 text-center text-sm text-muted-foreground">
            <Link
              href="/"
              className="underline underline-offset-4 hover:text-primary"
            >
              Back to Home
            </Link>
          </p>
      </div>
    </div>
  );
}
