import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, Shield, User, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/logo';

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh">
      <header className="px-4 lg:px-6 h-16 flex items-center">
        <Logo />
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                  Welcome to <span className="text-primary">ProjectVerse</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Your central hub for managing, distributing, and selecting final year projects.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full pb-12 md:pb-24 lg:pb-32">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-headline font-bold tracking-tighter md:text-4xl/tight">
                Select Your Role
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Login to your dedicated portal to access your tools and information.
              </p>
            </div>
            <div className="grid w-full grid-cols-1 md:grid-cols-3 gap-8 pt-8">
              <LoginCard
                role="Admin"
                description="Manage users, quotas, and system settings."
                href="/login/admin"
                icon={<Shield className="w-8 h-8 text-primary" />}
              />
              <LoginCard
                role="Faculty"
                description="Upload and manage project problem statements."
                href="/login/faculty"
                icon={<User className="w-8 h-8 text-primary" />}
              />
              <LoginCard
                role="Batch"
                description="View and select your final year project."
                href="/login/batch"
                icon={<Users className="w-8 h-8 text-primary" />}
              />
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 ProjectVerse. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}

function LoginCard({ role, description, href, icon }: { role: string; description: string; href: string; icon: React.ReactNode }) {
  return (
    <Link href={href} className="group">
      <Card className="w-full h-full transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-2 hover:border-primary bg-card">
        <CardHeader className="flex flex-col items-center justify-center p-6 space-y-4">
          <div className="p-3 rounded-full bg-primary/10">
            {icon}
          </div>
          <CardTitle className="font-headline text-2xl">{role}</CardTitle>
          <CardDescription className="text-center">{description}</CardDescription>
          <Button variant="ghost" className="mt-4">
            Login <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </CardHeader>
      </Card>
    </Link>
  );
}
