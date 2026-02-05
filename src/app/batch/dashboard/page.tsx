
'use client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileCheck, Files, LayoutDashboard, CheckCircle, Loader2, ArrowRight, Link as LinkIcon, Download, User } from 'lucide-react';
import { getBatchDetails, getAvailableProblemStatementsForBatch, chooseProblemStatement, generateBatchReport, getDomainsByDepartment, getProblemStatementsByDomain, uploadBatchFile, getBatchFiles, generateFileToken } from '@/lib/api';
import { Input } from '@/components/ui/input';
import type { ProblemStatement, Batch, Faculty } from '@/types';
import { useEffect, useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { SaveStudentsForm } from '@/components/batch/save-students-form';

const BatchSidebar = () => (
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton href="/u/portal/batch?page=dashboard" isActive>
        <LayoutDashboard className="h-4 w-4" />
        Dashboard
      </SidebarMenuButton>
    </SidebarMenuItem>
    <SidebarMenuItem>
      <SidebarMenuButton href="/u/portal/batch?page=profile">
        <User className="h-4 w-4" />
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
    const batchId = typeof window !== 'undefined' ? sessionStorage.getItem('userId') : null;
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
      <div className="flex flex-col gap-4">
        {batchDetails?.isLocked ? (
          <SelectedProjectView batch={batchDetails} />
        ) : (
          <AvailableProjectsView onProjectSelected={handleProjectSelection} batchDetails={batchDetails} />
        )}
      </div>
    </DashboardLayout>
  );
}

function AvailableProjectsView({ onProjectSelected, batchDetails }: { onProjectSelected: () => void, batchDetails: Batch }) {
  const [statements, setStatements] = useState<ProblemStatement[]>([]);
  const [availableDomains, setAvailableDomains] = useState<string[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [isLoadingDomains, setIsLoadingDomains] = useState(true);
  const [isLoadingPS, setIsLoadingPS] = useState(false);
  const [selectedStatement, setSelectedStatement] = useState<ProblemStatement | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const { toast } = useToast();

  const studentDept = batchDetails?.students?.[0]?.dept;

  // Fetch available domains on mount
  useEffect(() => {
    async function fetchDomains() {
      if (!studentDept) {
        setIsLoadingDomains(false);
        return;
      }

      try {
        setIsLoadingDomains(true);
        const { domains } = await getDomainsByDepartment(studentDept);
        setAvailableDomains(domains);
      } catch (error) {
        console.error("Failed to fetch domains:", error);
        toast({ variant: "destructive", title: "Failed to load domains", description: (error as Error).message });
      } finally {
        setIsLoadingDomains(false);
      }
    }
    fetchDomains();
  }, [studentDept, toast]);

  // Fetch PS when domain is selected
  useEffect(() => {
    async function fetchStatements() {
      if (!selectedDomain || !studentDept) return;

      try {
        setIsLoadingPS(true);
        const data = await getProblemStatementsByDomain(studentDept, selectedDomain);
        setStatements(data);
      } catch (error) {
        console.error("Failed to fetch problem statements:", error);
        toast({ variant: "destructive", title: "Failed to load projects", description: (error as Error).message });
      } finally {
        setIsLoadingPS(false);
      }
    }
    fetchStatements();
  }, [selectedDomain, studentDept, toast]);

  const handleSelectClick = (ps: ProblemStatement) => {
    setSelectedStatement(ps);
  }

  const handleConfirmSelection = async () => {
    const batchId = sessionStorage.getItem('userId');
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

  // Loading state for domains
  if (isLoadingDomains) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-4 text-muted-foreground">Loading Available Domains...</span>
      </div>
    )
  }

  // Domain selection view
  if (!selectedDomain) {
    return (
      <>
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold md:text-2xl">Choose Your Domain</h1>
          <Badge variant="outline">{studentDept} Department</Badge>
        </div>
        <p className="text-muted-foreground mb-6">
          Select a domain to view available projects. This will filter projects based on your area of interest.
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {availableDomains.length > 0 ? (
            availableDomains.map((domain) => (
              <Card
                key={domain}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-primary"
                onClick={() => setSelectedDomain(domain)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg">{domain}</span>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Click to view available projects in this domain
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="md:col-span-3 text-center text-muted-foreground py-12">
              <Files className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No domains available for your department at this time.</p>
            </div>
          )}
        </div>
      </>
    )
  }

  // PS list view (domain selected)
  if (isLoadingPS) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-4 text-muted-foreground">Loading Projects...</span>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl">Available Projects</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary">{studentDept}</Badge>
            <span className="text-muted-foreground">→</span>
            <Badge>{selectedDomain}</Badge>
          </div>
        </div>
        <Button variant="outline" onClick={() => setSelectedDomain(null)}>
          ← Back to Domains
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {statements.length > 0 ? (
          statements.map((ps) => (
            <ProblemStatementCard key={ps._id} ps={ps} onSelect={handleSelectClick} />
          ))
        ) : (
          <div className="md:col-span-3 text-center text-muted-foreground py-12">
            <Files className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No available projects found in this domain.</p>
            <Button variant="link" onClick={() => setSelectedDomain(null)} className="mt-4">
              Try another domain
            </Button>
          </div>
        )}
      </div>

      <Dialog open={!!selectedStatement} onOpenChange={(isOpen) => !isOpen && setSelectedStatement(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline">{selectedStatement?.title}</DialogTitle>
            <DialogDescription>Review the details below. This action is final.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex gap-2">
              <Badge variant="secondary">{selectedStatement?.department}</Badge>
              <Badge>{selectedStatement?.domain}</Badge>
            </div>
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


function DocumentsSection({ batchId }: { batchId: string }) {
  const [files, setFiles] = useState<{ fileId: string; name: string; url: string; uploadedAt: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const fetchFiles = useCallback(async () => {
    try {
      const { files } = await getBatchFiles(batchId);
      setFiles(files || []);
    } catch (error) {
      console.error("Failed to fetch files:", error);
    }
  }, [batchId]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    setUploading(true);
    try {
      await uploadBatchFile(batchId, file);
      toast({ title: "Upload Success", description: "File uploaded successfully." });
      fetchFiles();
    } catch (error) {
      console.error("Upload error:", error);
      toast({ variant: 'destructive', title: "Upload Failed", description: (error as Error).message });
    } finally {
      setUploading(false);
    }
  };

  const handleView = async (fileId: string) => {
    try {
      const { token } = await generateFileToken(fileId);
      // Open in new tab
      window.open(`/view-doc/${token}`, '_blank');
    } catch (error) {
      toast({ variant: 'destructive', title: "View Failed", description: "Could not generate access token." });
    }
  };

  return (
    <div className="mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Project Documents</CardTitle>
          <CardDescription>Manage your project-related documents here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Input type="file" onChange={handleUpload} disabled={uploading} className="max-w-xs" />
              {uploading && <Loader2 className="animate-spin h-4 w-4" />}
            </div>

            <div className="grid gap-2">
              {files.map(file => (
                <div key={file.fileId} className="flex items-center justify-between p-3 border rounded bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-4 w-4 text-primary" />
                    <span>{file.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleView(file.fileId)}>
                    View
                  </Button>
                </div>
              ))}
              {files.length === 0 && <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SelectedProjectView({ batch }: { batch: Batch }) {
  const project = batch.projectId as ProblemStatement;
  const coordinator = batch.coordinatorId as Faculty;
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  // ... (existing code for download report) ...
  // Wait, I need to include the existing handleDownloadReport logic?
  // I am replacing the WHOLE SelectedProjectFunction? No, just appending DocumentsSection.
  // Actually, I can replace the logic inside the return statement or add the component.
  // To be safe, I will re-implement SelectedProjectView with the addition, 
  // copying the logic from the view_file output but adding DocumentsSection usage.

  const handleDownloadReport = async () => {
    const batchId = sessionStorage.getItem('userId');
    if (!batchId) return;

    setIsDownloading(true);
    try {
      const { report } = await generateBatchReport(batchId);

      const reportContent = `
Batch Name: ${report.batchName}
Department: ${report.department}
Project: ${report.project}

Students:
${report.students.map((s: any, i: number) => `  ${i + 1}. ${s.nameInitial} (${s.rollNumber})`).join('\n')}
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
      <div className="bg-green-100 dark:bg-green-900/20 border-l-4 border-green-500 text-green-700 dark:text-green-300 p-4 rounded-md mb-8" role="alert">
        <div className="flex">
          <div className="py-1"><CheckCircle className="h-6 w-6 text-green-500 mr-4" /></div>
          <div>
            <p className="font-bold">Project Selected!</p>
            <p className="text-sm">You have successfully selected your final year project. You cannot change this selection.</p>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-semibold md:text-2xl">Project Details</h1>
        {/* <Button onClick={handleDownloadReport} disabled={isDownloading}>
          {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
          Download Report
        </Button> */}
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{project.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">{project.description}</p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="link" className="px-0">
                <a href={project.gDriveLink} target="_blank" rel="noopener noreferrer">View Google Drive Link</a>
              </Button>
            </CardFooter>
          </Card>

          <DocumentsSection batchId={batch._id} />

        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Project Supervisor</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">{coordinator.name}</p>
              <p className="text-sm text-muted-foreground">{coordinator.email}</p>
              <p className="text-sm text-muted-foreground mt-4">Contact your supervisor for further guidance.</p>
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
        <div className="flex items-start justify-between gap-2 mb-2">
          <CardTitle className="line-clamp-2 flex-1">{ps.title}</CardTitle>
          <Badge variant="secondary" className="shrink-0">{ps.domain}</Badge>
        </div>
        {/* <CardDescription>
          Faculty: {typeof ps.facultyId === 'object' ? ps.facultyId.name : 'N/A'}
        </CardDescription> */}
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

