'use client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, LayoutDashboard, Loader2, Users, ArrowLeft, ExternalLink, Lock, Unlock, FileCheck } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getBatchDetailsAsFaculty, getBatchFiles, generateFileToken, resetBatchProjectAsFaculty, type Batch } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useParams, useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { ManageStudentsDialog } from '@/components/manage-students-dialog';
import { Users as UsersIcon, RefreshCw, Settings } from 'lucide-react';

const FacultySidebar = () => (
    <SidebarMenu>
        <SidebarMenuItem>
            <SidebarMenuButton href="/u/portal/faculty?page=dashboard">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
            </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
            <SidebarMenuButton href="/u/portal/faculty?page=problem-statements">
                <FileText className="h-4 w-4" />
                <FileCheck className="h-4 w-4" />
                My Statements
            </SidebarMenuButton>
        </SidebarMenuItem>
    </SidebarMenu>
);


function DocumentsList({ batchId }: { batchId: string }) {
    const [files, setFiles] = useState<{ fileId: string; name: string; url: string; uploadedAt: string }[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        async function fetchFiles() {
            try {
                const { files } = await getBatchFiles(batchId);
                setFiles(files || []);
            } catch (error) {
                console.error("Failed to fetch files:", error);
            }
        }
        fetchFiles();
    }, [batchId]);

    const handleView = async (fileId: string) => {
        try {
            const { token } = await generateFileToken(fileId);
            window.open(`/view-doc/${token}`, '_blank');
        } catch (error) {
            toast({ variant: 'destructive', title: "View Failed", description: "Could not generate access token." });
        }
    };

    if (files.length === 0) return null;

    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>Batch Documents</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-2">
                    {files.map(file => (
                        <div key={file.fileId} className="flex items-center justify-between p-3 border rounded bg-slate-50 dark:bg-slate-800">
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
                </div>
            </CardContent>
        </Card>
    );
}

export default function BatchDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const batchId = params?.batchId as string;
    const [batch, setBatch] = useState<Batch | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchBatchDetails = async () => {
            if (!batchId) return;

            setIsLoading(true);
            try {
                const response = await getBatchDetailsAsFaculty(batchId);
                setBatch(response.batch);
            } catch (error) {
                console.error("Failed to fetch batch details", error);
                toast({
                    variant: "destructive",
                    title: "Failed to load batch details",
                    description: (error as Error).message || "Could not fetch the batch information. Please try again later."
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchBatchDetails();
        fetchBatchDetails();
    }, [batchId, toast]);

    const [isManageStudentsOpen, setIsManageStudentsOpen] = useState(false);

    const handleBatchUpdated = (updatedBatch: Batch) => {
        setBatch(updatedBatch);
    };

    const handleResetProject = async () => {
        if (!confirm("Are you sure you want to reset the project selection for this batch? This action cannot be undone.")) return;

        try {
            const result = await resetBatchProjectAsFaculty(batchId);
            toast({ title: "Project Reset", description: result.message });
            // Refresh batch details
            const { batch: newBatch } = await getBatchDetailsAsFaculty(batchId);
            setBatch(newBatch);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: "Reset Failed",
                description: (error as Error).message
            });
        }
    };


    const coordinator = batch?.coordinatorId && typeof batch.coordinatorId !== 'string'
        ? batch.coordinatorId
        : null;

    const project = batch?.projectId && typeof batch.projectId !== 'string'
        ? batch.projectId
        : null;

    return (
        <DashboardLayout userRole="Faculty" sidebarContent={<FacultySidebar />}>
            <div className="flex flex-col gap-4">
                {/* Back Button */}
                <div>
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/u/portal/faculty?page=dashboard')}
                        className="gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </Button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : batch ? (
                    <>
                        {/* Batch Header */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-2xl">{batch.batchName}</CardTitle>
                                        <CardDescription className="mt-1">
                                            Username: {batch.username}
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {batch.isLocked ? (
                                            <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-md">
                                                <Lock className="h-4 w-4" />
                                                <span className="text-sm font-medium">Locked</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-md">
                                                <Unlock className="h-4 w-4" />
                                                <span className="text-sm font-medium">Active</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>

                        {/* Project Information */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Project Information</CardTitle>
                                    {project && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleResetProject}
                                            className="text-destructive hover:text-destructive"
                                        >
                                            <RefreshCw className="mr-2 h-4 w-4" />
                                            Reset Project
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                {project ? (
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Title</p>
                                            <p className="font-semibold">{project.title}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Description</p>
                                            <p className="text-sm">{project.description}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-muted-foreground">Department</p>
                                                <p className="font-medium">{project.department}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Domain</p>
                                                <p className="font-medium">{project.domain}</p>
                                            </div>
                                        </div>
                                        {project.gDriveLink && (
                                            <div>
                                                <Button
                                                    variant="outline"
                                                    asChild
                                                    className="gap-2"
                                                >
                                                    <a href={project.gDriveLink} target="_blank" rel="noopener noreferrer">
                                                        <ExternalLink className="h-4 w-4" />
                                                        View Project Document
                                                    </a>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 border-2 border-dashed rounded-lg">
                                        <p className="text-muted-foreground">No project selected yet</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Batch Documents */}
                        <DocumentsList batchId={batchId} />

                        {/* Coordinator Information */}
                        {coordinator && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Coordinator</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Name</p>
                                            <p className="font-semibold">{coordinator.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Email</p>
                                            <p className="text-sm">{coordinator.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Department</p>
                                            <p className="text-sm">{coordinator.department}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Students List */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        Students ({batch.students?.length || 0})
                                    </div>
                                    <Button size="sm" variant="outline" onClick={() => setIsManageStudentsOpen(true)}>
                                        <Settings className="mr-2 h-4 w-4" />
                                        Manage Students
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {batch.students && batch.students.length > 0 ? (
                                    <div className="space-y-3">
                                        {batch.students.map((student, index) => (
                                            <div
                                                key={index}
                                                className="p-4 bg-secondary rounded-lg grid grid-cols-1 md:grid-cols-2 gap-3"
                                            >
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Name</p>
                                                    <p className="font-semibold">{student.nameInitial}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Roll Number</p>
                                                    <p className="font-medium">{student.rollNumber}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Email</p>
                                                    <p className="text-sm">{student.mailId}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Phone</p>
                                                    <p className="text-sm">{student.phone}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Department / Section</p>
                                                    <p className="text-sm">{student.dept} - {student.section}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Year</p>
                                                    <p className="text-sm">{student.year}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 border-2 border-dashed rounded-lg">
                                        <p className="text-muted-foreground">No students added yet</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <ManageStudentsDialog
                            batch={batch}
                            open={isManageStudentsOpen}
                            onOpenChange={setIsManageStudentsOpen}
                            userRole="Faculty"
                            onBatchUpdated={handleBatchUpdated}
                        />

                    </>
                ) : (
                    <Card>
                        <CardContent className="py-8">
                            <p className="text-center text-muted-foreground">Batch not found</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    );
}
