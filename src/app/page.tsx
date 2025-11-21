
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/logo';
import { getUnassignedProblemStatements } from '@/lib/api';
import type { ProblemStatement } from '@/types';
import { Badge } from '@/components/ui/badge';

export default async function Home() {
    let problemStatements: ProblemStatement[] = [];
    let fetchError = false;
    try {
        problemStatements = await getUnassignedProblemStatements();
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
                        <Link href="/login">Login</Link>
                    </Button>
                </nav>
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
                            <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {problemStatements.map((ps) => (
                                    <ProblemStatementCard key={ps._id} ps={ps} />
                                ))}
                            </div>
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

function ProblemStatementCard({ ps }: { ps: ProblemStatement }) {
    const facultyName = (typeof ps.facultyId === 'object' && ps.facultyId.name) ? ps.facultyId.name : 'N/A';
    
    return (
        <Card className="flex flex-col h-full bg-card">
            <CardHeader>
                 <div className="flex items-start justify-between">
                    <CardTitle className="font-headline text-xl line-clamp-2">{ps.title}</CardTitle>
                    <Badge variant="secondary">Available</Badge>
                </div>
                <CardDescription>By: {facultyName}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-4">
                    {ps.description}
                </p>
            </CardContent>
            <CardFooter>
                 <Button asChild className="w-full">
                    <Link href="/login">View &amp; Choose Project <ArrowRight className="ml-2 w-4 h-4" /></Link>
                 </Button>
            </CardFooter>
        </Card>
    );
}
