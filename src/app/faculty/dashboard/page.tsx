
'use client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, LayoutDashboard, ArrowRight, Loader2, Users, FolderKanban } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getFacultyDashboard, type FacultyDashboardData } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const FacultySidebar = () => (
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton href="/faculty/dashboard" isActive title="Dashboard">
        <LayoutDashboard />
      </SidebarMenuButton>
    </SidebarMenuItem>
    <SidebarMenuItem>
      <SidebarMenuButton href="/faculty/problem-statements" title="My Statements">
        <FileText />
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
);

export default function FacultyDashboard() {
  const [dashboardData, setDashboardData] = useState<FacultyDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getFacultyDashboard();
        setDashboardData(response.dashboard);
      } catch (error) {
        console.error("Failed to fetch faculty data", error);
        toast({
            variant: "destructive",
            title: "Failed to load dashboard",
            description: (error as Error).message || "Could not fetch the necessary data. Please try again later."
        })
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  const { facultyDetails, totalProblemStatements, assignedBatches } = dashboardData || {};
  const quotaValue = facultyDetails ? `${facultyDetails.quotaUsed} / ${facultyDetails.quotaLimit}` : '...';

  return (
    <DashboardLayout userRole="Faculty" sidebarContent={<FacultySidebar />}>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <StatCard title="My Uploaded PS" value={totalProblemStatements ?? '...'} />
              <StatCard title="My Quota" value={quotaValue} />
              <StatCard title="Assigned Batches" value={assignedBatches?.length ?? '...'} />
          </div>
          
          <div className="grid gap-8 mt-8 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Manage My Problem Statements</CardTitle>
                  <CardDescription>Contribute new project ideas and manage your existing ones.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="group">
                    <Link href="/faculty/problem-statements">
                      <FileText className="mr-2 h-4 w-4" />
                      Upload & Manage Statements
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                    <CardTitle>Assigned Batches</CardTitle>
                    <CardDescription>These are the student batches assigned to you.</CardDescription>
                </CardHeader>
                <CardContent>
                    {assignedBatches && assignedBatches.length > 0 ? (
                        <div className="space-y-4">
                            {assignedBatches.map(batch => (
                                <div key={batch._id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                                    <div>
                                        <p className="font-semibold">{batch.batchName}</p>
                                        <p className="text-sm text-muted-foreground">{batch.projectId?.title || 'Project not yet selected'}</p>
                                    </div>
                                    <Users className="h-5 w-5 text-muted-foreground" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground">No batches have been assigned to you yet.</p>
                        </div>
                    )}
                </CardContent>
              </Card>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}


function StatCard({ title, value }: { title: string, value: string | number }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {title === "My Uploaded PS" && <FileText className="h-4 w-4 text-muted-foreground" />}
        {title === "My Quota" && <FolderKanban className="h-4 w-4 text-muted-foreground" />}
        {title === "Assigned Batches" && <Users className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
          <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}
