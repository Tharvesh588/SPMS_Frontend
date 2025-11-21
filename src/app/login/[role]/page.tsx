import { notFound } from 'next/navigation';
import LoginForm from '@/components/login-form';
import Logo from '@/components/logo';
import Link from 'next/link';

type LoginPageProps = {
  params: {
    role: string;
  };
};

const validRoles = ['admin', 'faculty', 'batch'];

export default function LoginPage({ params }: LoginPageProps) {
  const { role } = params;

  if (!validRoles.includes(role)) {
    notFound();
  }

  const roleTitle = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-8">
        <div className="text-center">
            <div className="flex justify-center mb-4">
              <Logo />
            </div>
          <h1 className="text-3xl font-bold font-headline">{roleTitle} Login</h1>
          <p className="text-muted-foreground">Enter your credentials to access your dashboard</p>
        </div>
        <LoginForm role={role} />
         <p className="px-8 text-center text-sm text-muted-foreground">
            <Link
              href="/"
              className="underline underline-offset-4 hover:text-primary"
            >
              Back to role selection
            </Link>
          </p>
      </div>
    </div>
  );
}
