
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/logo';
import { getUnassignedProblemStatements } from '@/lib/api';
import type { ProblemStatement } from '@/types';
import { Badge } from '@/components/ui/badge';
import { ProblemStatementList } from '@/components/problem-statement-list';
import Image from 'next/image';

export default async function Home() {
    let problemStatements: ProblemStatement[] = [];
    let fetchError = false;
    try {
        const response = await getUnassignedProblemStatements();
        problemStatements = response.problemStatements;
    } catch (error) {
        console.error("Failed to fetch problem statements:", error);
        fetchError = true;
    }

    return (
        <div className="flex flex-col min-h-dvh bg-background">
            <header className="px-4 lg:px-6 h-16 flex items-center border-b sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
                <Logo />
                <nav className="ml-auto">
                    <Button asChild>
                        <Link href="/u/portal/auth">Login</Link>
                    </Button>
                </nav>
            </header>
            <main className="flex-1">
                <section className="relative w-full py-20 md:py-32 lg:py-40 flex items-center justify-center">
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="https://cdn.jsdelivr.net/gh/Tharvesh2026/Web-Source@main/engineering_college.webp?raw=true"
                            alt="Background"
                            fill
                            className="object-cover opacity-20"
                            priority
                        />
                        <div className="absolute inset-0 bg-background/50" />
                    </div>
                    <div className="container relative z-10 px-4 md:px-6">
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                                    Welcome to <span className="text-primary">ProjectVerse</span>
                                </h1>
                                <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl">
                                    Your central hub for managing, distributing, and selecting final year projects.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="w-full pb-12 md:pb-24 lg:pb-32 bg-secondary/50">
                    <div className="container px-4 md:px-6">
                        <div className="space-y-3 text-center mb-12">
                            <h2 className="text-3xl font-headline font-bold tracking-tighter md:text-4xl/tight">
                                Available Projects
                            </h2>
                            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                Browse the unassigned problem statements below. Login as a batch to make your selection.
                            </p>
                        </div>
                        {fetchError ? (
                             <div className="text-center text-destructive">
                                <p>Failed to load problem statements. Please try again later.</p>
                             </div>
                        ) : (
                           <ProblemStatementList statements={problemStatements} />
                        )}
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
