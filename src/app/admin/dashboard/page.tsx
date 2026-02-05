
'use client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Users, UserPlus, LayoutDashboard, FilePlus2, BookCopy, CheckSquare, Loader2, FileText, ArrowUpRight, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CreateFacultyForm } from '@/components/admin/create-faculty-form';
import { CreateBatchForm } from '@/components/admin/create-batch-form';
import { UploadProblemStatementForm } from '@/components/admin/upload-ps-form';
import React, { useEffect, useState, useCallback } from 'react';
import { getFaculties, getBatches, getProblemStatementsForAdmin, downloadProjectAssignmentsCSV, getSystemSettings, updateSystemSettings } from '@/lib/api';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const AdminSidebar = () => (
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton href="/u/portal/admin?page=dashboard" isActive>
        <LayoutDashboard className="h-4 w-4" />
        Dashboard
      </SidebarMenuButton>
    </SidebarMenuItem>
    <SidebarMenuItem>
      <SidebarMenuButton href="/u/portal/admin?page=faculty">
        <Users className="h-4 w-4" />
        Manage Faculty
      </SidebarMenuButton>
    </SidebarMenuItem>
    <SidebarMenuItem>
      <SidebarMenuButton href="/u/portal/admin?page=batches">
        <BookCopy className="h-4 w-4" />
        Manage Batches
      </SidebarMenuButton>
    </SidebarMenuItem>
    <SidebarMenuItem>
      <SidebarMenuButton href="/u/portal/admin?page=problem-statements">
        <FilePlus2 className="h-4 w-4" />
        Problem Statements
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    faculties: 0,
    batches: 0,
    projectsSelected: 0,
    totalProblemStatements: 0,
    assignedProblemStatements: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const [psSelectionEnabled, setPsSelectionEnabled] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [faculties, batches, problemStatements, settingsRes] = await Promise.all([
        getFaculties(),
        getBatches(),
        getProblemStatementsForAdmin(),
        getSystemSettings(),
      ]);

      const projectsSelected = batches.filter(batch => batch.projectId).length;
      const assignedProblemStatements = problemStatements.filter(ps => ps.isAssigned).length;

      setStats({
        faculties: faculties.length,
        batches: batches.length,
        projectsSelected: projectsSelected,
        totalProblemStatements: problemStatements.length,
        assignedProblemStatements: assignedProblemStatements,
      });

      if (settingsRes.success && settingsRes.settings) {
        setPsSelectionEnabled(settingsRes.settings.psSelectionEnabled);
      }

    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleToggleSettings = async (checked: boolean) => {
    // Optimistic update
    setPsSelectionEnabled(checked);
    try {
      await updateSystemSettings(checked);
    } catch (error) {
      console.error("Failed to update settings:", error);
      setPsSelectionEnabled(!checked); // Revert
      alert("Failed to update settings.");
    }
  }


  const handleCreation = () => {
    // We wrap this in a timeout to allow the backend to process the change
    // before we refetch the data.
    setTimeout(() => {
      fetchData();
    }, 500);
  };

  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadCSV = async () => {
    try {
      setIsDownloading(true);
      await downloadProjectAssignmentsCSV();
    } catch (error) {
      console.error('Failed to download CSV:', error);
      alert('Failed to download CSV file. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };


  return (
    <DashboardLayout userRole="Admin" sidebarContent={<AdminSidebar />}>
      <div className="flex flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <StatCard title="Total Faculties" value={stats.faculties} icon={<Users className="h-4 w-4 text-muted-foreground" />} isLoading={isLoading} />
          <StatCard title="Total Batches" value={stats.batches} icon={<BookCopy className="h-4 w-4 text-muted-foreground" />} isLoading={isLoading} />
          <StatCard title="Total PS" value={stats.totalProblemStatements} icon={<FileText className="h-4 w-4 text-muted-foreground" />} isLoading={isLoading} />
          <StatCard title="PS Assigned" value={stats.assignedProblemStatements} icon={<CheckSquare className="h-4 w-4 text-muted-foreground" />} isLoading={isLoading} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>System Controls</CardTitle>
            <CardDescription>Global settings for the application.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 p-4 border rounded-lg bg-secondary/50">
              <Switch
                id="ps-selection-mode"
                checked={psSelectionEnabled}
                onCheckedChange={handleToggleSettings}
              />
              <div className="flex-1">
                <Label htmlFor="ps-selection-mode" className="text-base font-medium">
                  Problem Statement Selection Open
                </Label>
                <p className="text-sm text-muted-foreground">
                  When ON: All batches can login and select projects.<br />
                  When OFF: Only batches with assigned projects can login. Others are blocked.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage the system from one place.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full justify-start p-6 text-left h-auto">
                  <UserPlus className="mr-4 h-6 w-6" />
                  <div>
                    <p className="font-semibold">Create Faculty Account</p>
                    <p className="font-normal text-sm text-primary-foreground/80">Onboard new faculty members.</p>
                  </div>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Faculty Account</DialogTitle>
                </DialogHeader>
                <CreateFacultyForm onFacultyCreated={handleCreation} />
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full justify-start p-6 text-left h-auto">
                  <Users className="mr-4 h-6 w-6" />
                  <div>
                    <p className="font-semibold">Create Batch Account</p>
                    <p className="font-normal text-sm text-primary-foreground/80">Create accounts for student batches.</p>
                  </div>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Batch Account</DialogTitle>
                </DialogHeader>
                <CreateBatchForm onBatchCreated={handleCreation} />
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full justify-start p-6 text-left h-auto">
                  <Upload className="mr-4 h-6 w-6" />
                  <div>
                    <p className="font-semibold">Upload Problem Statement</p>
                    <p className="font-normal text-sm text-primary-foreground/80">Add a new project idea.</p>
                  </div>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Problem Statement</DialogTitle>
                </DialogHeader>
                <UploadProblemStatementForm onStatementCreated={handleCreation} />
              </DialogContent>
            </Dialog>

            <Button
              className="w-full justify-start p-6 text-left h-auto"
              onClick={handleDownloadCSV}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <Loader2 className="mr-4 h-6 w-6 animate-spin" />
              ) : (
                <Download className="mr-4 h-6 w-6" />
              )}
              <div>
                <p className="font-semibold">Download Project Assignments</p>
                <p className="font-normal text-sm text-primary-foreground/80">
                  {isDownloading ? 'Generating CSV...' : 'Export all project data to CSV.'}
                </p>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ title, value, icon, isLoading }: { title: string, value: number, icon: React.ReactNode, isLoading: boolean }) {
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
