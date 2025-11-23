
'use client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileCheck, Files, LayoutDashboard, CheckCircle, Loader2, ArrowRight, Link as LinkIcon, Download, User } from 'lucide-react';
import { getBatchDetails, getAvailableProblemStatementsForBatch, chooseProblemStatement, generateBatchReport } from '@/lib/api';
import type { ProblemStatement, Batch, Faculty } from '@/types';
import { useEffect, useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { SaveStudentsForm } from '@/components/batch/save-students-form';

const BatchSidebar = () => (
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton href="/u/portal/dashboard/batch" isActive title="Dashboard">
        <LayoutDashboard />
        Dashboard
      </SidebarMenuButton>
    </SidebarMenuItem>
    <SidebarMenuItem>
      <SidebarMenuButton href="/u/portal/dashboard/batch/profile" title="Profile">
        <User />
        Profile
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
);


export default function BatchDashboard() {
  const [batchDetails, setBatchDetails] = useState<Batch | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchDetails = useCallback(async () => {
    setIsLoading(true);
    const batchId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    if (!batchId) {
      toast({ variant: 'destructive', title: 'Authentication Error', description: 'Could not find batch ID.' });
      setIsLoading(false);
      return;
    }
    try {
      const { batch } = await getBatchDetails(batchId);
      setBatchDetails(batch);
    } catch (error) {
      console.error("Failed to fetch batch details:", error);
      toast({ variant: 'destructive', title: 'Failed to load data', description: (error as Error).message });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);
  
  const handleStudentsSaved = () => {
    fetchDetails();
    toast({ title: 'Student Details Saved', description: 'You can now select a project.' });
  }

  const handleProjectSelection = async () => {
    // This function is called after a project is selected from the dialog
    // It simply refetches the batch details to update the UI
    await fetchDetails();
  };

  if (isLoading) {
    return (
      <DashboardLayout userRole="Batch" sidebarContent={<BatchSidebar />}>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-4 text-muted-foreground">Loading Your Dashboard...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (!batchDetails) {
    return (
       <DashboardLayout userRole="Batch" sidebarContent={<BatchSidebar />}>
         <div className="text-center">Could not load batch details.</div>
       </DashboardLayout>
    )
  }

  if (batchDetails.students.length === 0) {
    return (
       <DashboardLayout userRole="Batch" sidebarContent={<BatchSidebar />}>
          <SaveStudentsForm onStudentsSaved={handleStudentsSaved} />
       </DashboardLayout>
    )
  }


  return (
    <DashboardLayout userRole="Batch" sidebarContent={<BatchSidebar />}>
      {batchDetails?.isLocked ? (
        <SelectedProjectView batch={batchDetails} />
      ) : (
        <AvailableProjectsView onProjectSelected={handleProjectSelection} />
      )}
    </DashboardLayout>
  );
}

function AvailableProjectsView({ onProjectSelected }: { onProjectSelected: () => void }) {
    const [statements, setStatements] = useState<ProblemStatement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedStatement, setSelectedStatement] = useState<ProblemStatement | null>(null);
    const [isConfirming, setIsConfirming] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
      async function fetchStatements() {
        try {
          setIsLoading(true);
          const data = await getAvailableProblemStatementsForBatch();
          setStatements(data);
        } catch (error) {
          console.error("Failed to fetch problem statements:", error);
          toast({ variant: "destructive", title: "Failed to load projects", description: (error as Error).message });
        } finally {
          setIsLoading(false);
        }
      }
      fetchStatements();
    }, [toast]);

    const handleSelectClick = (ps: ProblemStatement) => {
        setSelectedStatement(ps);
    }

    const handleConfirmSelection = async () => {
        const batchId = localStorage.getItem('userId');
        if (!selectedStatement || !batchId) {
            toast({ variant: 'destructive', title: 'Error', description: 'No statement or batch ID found.' });
            return;
        }

        setIsConfirming(true);
        try {
            await chooseProblemStatement(batchId, selectedStatement._id);
            toast({ title: 'Project Selected!', description: `You have successfully chosen "${selectedStatement.title}".` });
            setSelectedStatement(null);
            onProjectSelected(); // Callback to refresh dashboard
        } catch (error) {
            console.error("Failed to select project:", error);
            toast({ variant: 'destructive', title: 'Selection Failed', description: (error as Error).message });
        } finally {
            setIsConfirming(false);
        }
    }


    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-4 text-muted-foreground">Loading Available Projects...</span>
            </div>
        )
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-headline font-semibold">Available Problem Statements</h2>
                <p className="text-muted-foreground">You can select 1 project.</p>
            </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
            {statements.map((ps) => (
              <ProblemStatementCard key={ps._id} ps={ps} onSelect={handleSelectClick} />
            ))}
          </div>

          <Dialog open={!!selectedStatement} onOpenChange={(isOpen) => !isOpen && setSelectedStatement(null)}>
              <DialogContent>
                  <DialogHeader>
                      <DialogTitle className="text-2xl font-headline">{selectedStatement?.title}</DialogTitle>
                      <DialogDescription>Review the details below. This action is final.</DialogDescription>
                  </DialogHeader>
                  <div className="py-4 space-y-4">
                      <p className="text-sm text-muted-foreground">{selectedStatement?.description}</p>
                      <Button asChild variant="outline">
                        <a href={selectedStatement?.gDriveLink} target="_blank" rel="noopener noreferrer">
                            <LinkIcon className="mr-2 h-4 w-4" />
                            View Google Drive
                        </a>
                      </Button>
                  </div>
                  <DialogFooter>
                      <Button variant="ghost" onClick={() => setSelectedStatement(null)} disabled={isConfirming}>Cancel</Button>
                      <Button onClick={handleConfirmSelection} disabled={isConfirming}>
                          {isConfirming && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Confirm Selection
                      </Button>
                  </DialogFooter>
              </DialogContent>
          </Dialog>
        </>
    )
}

function SelectedProjectView({ batch }: { batch: Batch }) {
    const project = batch.projectId as ProblemStatement;
    const coordinator = batch.coordinatorId as Faculty;
    const { toast } = useToast();
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownloadReport = async () => {
        const batchId = localStorage.getItem('userId');
        if (!batchId) return;

        setIsDownloading(true);
        try {
            const { report } = await generateBatchReport(batchId);
            
            const reportContent = `
Batch Name: ${report.batchName}
Department: ${report.department}
Project: ${report.project}

Students:
${report.students.map((s: any, i: number) => `  ${i+1}. ${s.nameInitial} (${s.rollNumber})`).join('\n')}
            `;

            const blob = new Blob([reportContent.trim()], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `report-${report.batchName.replace(/\s+/g, '-')}.txt`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            toast({ title: 'Report Downloaded', description: 'The report has been saved to your device.' });
        } catch (error) {
            console.error("Failed to generate report:", error);
            toast({ variant: 'destructive', title: 'Download Failed', description: (error as Error).message });
        } finally {
            setIsDownloading(false);
        }
    };
    
    if (!project || !coordinator) {
        return (
             <div className="text-center py-10">
                <h2 className="text-2xl font-bold">Loading Project Details...</h2>
                <p className="text-muted-foreground">Please wait a moment.</p>
            </div>
        )
    }

  return (
    <div>
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-8" role="alert">
            <div className="flex">
                <div className="py-1"><CheckCircle className="h-6 w-6 text-green-500 mr-4" /></div>
                <div>
                    <p className="font-bold">Project Selected!</p>
                    <p className="text-sm">You have successfully selected your final year project. You cannot change this selection.</p>
                </div>
            </div>
        </div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-headline font-bold">My Project Details</h2>
        <Button onClick={handleDownloadReport} disabled={isDownloading}>
            {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            Download Report
        </Button>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">{project.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-6">{project.description}</p>
                </CardContent>
                 <CardFooter>
                    <Button asChild variant="link">
                        <a href={project.gDriveLink} target="_blank" rel="noopener noreferrer">View Google Drive Link</a>
                    </Button>
                </CardFooter>
            </Card>
        </div>
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Project Coordinator</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-lg font-semibold">{coordinator.name}</p>
                    <p className="text-sm text-muted-foreground">{coordinator.email}</p>
                     <p className="text-sm text-muted-foreground mt-4">Contact your coordinator for further guidance.</p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}

function ProblemStatementCard({ ps, onSelect }: { ps: ProblemStatement, onSelect: (ps: ProblemStatement) => void }) {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300 border-2 border-transparent hover:border-primary">
      <CardHeader>
        <CardTitle className="line-clamp-2">{ps.title}</CardTitle>
         <CardDescription>
            Faculty: {typeof ps.facultyId === 'object' ? ps.facultyId.name : 'N/A'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {ps.description}
        </p>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => onSelect(ps)}>
          View & Select
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
