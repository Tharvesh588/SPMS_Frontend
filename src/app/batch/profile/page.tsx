
'use client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { LayoutDashboard, User, Loader2 } from 'lucide-react';
import { getBatchDetails } from '@/lib/api';
import type { Batch, ProblemStatement } from '@/types';
import { useEffect, useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

const BatchSidebar = () => (
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton href="/u/portal/batch?page=dashboard">
        <LayoutDashboard className="h-4 w-4" />
        Dashboard
      </SidebarMenuButton>
    </SidebarMenuItem>
    <SidebarMenuItem>
      <SidebarMenuButton href="/u/portal/batch?page=profile" isActive>
        <User className="h-4 w-4" />
        Profile
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
);

export default function BatchProfilePage() {
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

  if (isLoading) {
    return (
      <DashboardLayout userRole="Batch" sidebarContent={<BatchSidebar />}>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-4 text-muted-foreground">Loading Your Profile...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (!batchDetails) {
    return (
      <DashboardLayout userRole="Batch" sidebarContent={<BatchSidebar />}>
        <div className="text-center">Could not load your batch profile.</div>
      </DashboardLayout>
    );
  }
  
  const project = batchDetails.projectId as ProblemStatement;

  return (
    <DashboardLayout userRole="Batch" sidebarContent={<BatchSidebar />}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Batch Profile</CardTitle>
            <CardDescription>Your batch, project, and student details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
                <Badge variant="secondary">Batch Name</Badge>
                <p className="font-semibold">{batchDetails.batchName}</p>
            </div>
             <div className="flex items-center space-x-4">
                <Badge variant="secondary">Batch ID</Badge>
                <p className="font-mono text-sm">{batchDetails._id}</p>
            </div>
            {project && (
                 <div className="space-y-2 pt-4">
                    <h3 className="text-lg font-semibold">Selected Project</h3>
                    <div className="p-4 border rounded-lg bg-muted/50">
                        <p className="font-bold text-primary">{project.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                    </div>
                </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Student Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Name with Initial</TableHead>
                        <TableHead>Roll Number</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Section</TableHead>
                        <TableHead>Year</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {batchDetails.students.map((student, index) => (
                        <TableRow key={student.rollNumber}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{student.nameInitial}</TableCell>
                            <TableCell>{student.rollNumber}</TableCell>
                            <TableCell>{student.dept}</TableCell>
                            <TableCell>{student.section}</TableCell>
                            <TableCell>{student.year}</TableCell>
                            <TableCell>{student.mailId}</TableCell>
                            <TableCell>{student.phone}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
