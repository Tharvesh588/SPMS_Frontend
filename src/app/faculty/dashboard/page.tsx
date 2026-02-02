
'use client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, LayoutDashboard, ArrowRight, Loader2, Users, FolderKanban, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getFacultyDashboard, type FacultyDashboardData } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const FacultySidebar = () => (
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton href="/u/portal/faculty?page=dashboard" isActive>
        <LayoutDashboard className="h-4 w-4" />
        Dashboard
      </SidebarMenuButton>
    </SidebarMenuItem>
    <SidebarMenuItem>
      <SidebarMenuButton href="/u/portal/faculty?page=problem-statements">
        <FileText className="h-4 w-4" />
        My Statements
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
        <div className="flex flex-col gap-4">
          {facultyDetails && (
            <Card>
              <CardHeader>
                <CardTitle>Welcome, {facultyDetails.name}</CardTitle>
                <CardDescription>Department of {facultyDetails.department}</CardDescription>
              </CardHeader>
            </Card>
          )}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <StatCard title="My Uploaded PS" value={totalProblemStatements ?? '...'} icon={<FileText className="h-4 w-4 text-muted-foreground" />} isLoading={isLoading} />
            <StatCard title="My Quota" value={quotaValue} icon={<FolderKanban className="h-4 w-4 text-muted-foreground" />} isLoading={isLoading} />
            <StatCard title="Assigned Batches" value={assignedBatches?.length ?? '...'} icon={<Users className="h-4 w-4 text-muted-foreground" />} isLoading={isLoading} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Assigned Batches</CardTitle>
              <CardDescription>These are the student batches assigned to you for project coordination.</CardDescription>
            </CardHeader>
            <CardContent>
              {assignedBatches && assignedBatches.length > 0 ? (
                <div className="space-y-4">
                  {assignedBatches.map(batch => (
                    <Link
                      key={batch._id}
                      href={`/faculty/batch/${batch._id}`}
                      className="flex items-center justify-between p-3 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors cursor-pointer group"
                    >
                      <div>
                        <p className="font-semibold group-hover:text-primary transition-colors">{batch.batchName}</p>
                        <p className="text-sm text-muted-foreground">{batch.projectId?.title || 'Project not yet selected'}</p>
                      </div>
                      <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
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
      )}
    </DashboardLayout>
  );
}


function StatCard({ title, value, icon, isLoading }: { title: string, value: string | number, icon: React.ReactNode, isLoading: boolean }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-8 flex items-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  )
}
