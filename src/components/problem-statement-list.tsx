
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ArrowRight, Link as LinkIcon } from 'lucide-react';
import type { ProblemStatement } from '@/types';

function ProblemStatementCard({ ps, onSelect }: { ps: ProblemStatement; onSelect: (ps: ProblemStatement) => void; }) {
    const isAssigned = ps.isAssigned;
    return (
        <Card className="flex flex-col h-full bg-card">
            <CardHeader>
                 <div className="flex items-start justify-between">
                    <CardTitle className="font-headline text-xl line-clamp-2">{ps.title}</CardTitle>
                    <Badge variant={isAssigned ? "destructive" : "secondary"}>{isAssigned ? 'Assigned' : 'Open'}</Badge>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-4">
                    {ps.description}
                </p>
            </CardContent>
            <CardFooter>
                 <Button onClick={() => onSelect(ps)} className="w-full" disabled={isAssigned}>
                    {isAssigned ? 'Project Unavailable' : 'View & Choose Project'}
                    {!isAssigned && <ArrowRight className="ml-2 w-4 h-4" />}
                 </Button>
            </CardFooter>
        </Card>
    );
}


export function ProblemStatementList({ statements }: { statements: ProblemStatement[] }) {
    const [selectedStatement, setSelectedStatement] = useState<ProblemStatement | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleSelectStatement = (ps: ProblemStatement) => {
        setSelectedStatement(ps);
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setSelectedStatement(null);
    };

    return (
        <>
            <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {statements.map((ps) => (
                    <ProblemStatementCard key={ps._id} ps={ps} onSelect={handleSelectStatement} />
                ))}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
                <DialogContent className="sm:max-w-[525px]">
                    {selectedStatement && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-headline">{selectedStatement.title}</DialogTitle>
                                <DialogDescription>
                                    Review the details below. To select this project, you must log in as a batch.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-4 space-y-4">
                                <div>
                                    <h3 className="font-semibold mb-2">Description</h3>
                                    <p className="text-sm text-muted-foreground">{selectedStatement.description}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">Resources</h3>
                                    <Button asChild variant="outline" size="sm">
                                        <a href={selectedStatement.gDriveLink} target="_blank" rel="noopener noreferrer">
                                            <LinkIcon className="mr-2 h-4 w-4" />
                                            View Google Drive Folder
                                        </a>
                                    </Button>
                                </div>
                            </div>
                            <Button asChild className="w-full">
                                <Link href="/u/portal/auth">Choose Project & Login</Link>
                            </Button>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
