'use client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Users, UserPlus, LayoutDashboard, FilePlus2, BookCopy, ArrowRight, Loader2, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CreateFacultyForm } from '@/components/admin/create-faculty-form';
import { CreateBatchForm } from '@/components/admin/create-batch-form';
import { UploadProblemStatementForm } from '@/components/admin/upload-ps-form';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { getFaculties, getBatches, getProblemStatements } from '@/lib/api';

const AdminSidebar = () => (
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton href="/admin/dashboard" isActive>
        <LayoutDashboard />
        Dashboard
      </SidebarMenuButton>
    </SidebarMenuItem>
    <SidebarMenuItem>
      <SidebarMenuButton href="/admin/faculty">
        <Users />
        Manage Faculty
      </SidebarMenuButton>
    </SidebarMenuItem>
    <SidebarMenuItem>
      <SidebarMenuButton href="/admin/batches">
        <BookCopy />
        Manage Batches
      </SidebarMenuButton>
    </SidebarMenuItem>
    <SidebarMenuItem>
      <SidebarMenuButton href="#">
        <FilePlus2 />
        Problem Statements
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    faculties: 0,
    batches: 0,
    problemStatements: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        // Fetch only faculties as other endpoints are not available for admin
        const faculties = await getFaculties();
        setStats({
          faculties: faculties.length,
          batches: 0, // Mocked to 0
          problemStatements: 0, // Mocked to 0
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <DashboardLayout userRole="Admin" sidebarContent={<AdminSidebar />}>
        <div className="flex flex-col gap-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <StatCard title="Total Faculties" value={stats.faculties} icon={<Users className="h-6 w-6 text-muted-foreground" />} isLoading={isLoading} />
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Batches</CardTitle>
                  <BookCopy className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">N/A</div>
                   <p className="text-xs text-muted-foreground">Endpoint not available for admin</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Problem Statements</CardTitle>
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">N/A</div>
                  <p className="text-xs text-muted-foreground">Endpoint not available for admin</p>
                </CardContent>
              </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Manage the system from here.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                            <CreateFacultyForm />
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
                            <CreateBatchForm />
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
                            <UploadProblemStatementForm />
                        </DialogContent>
                    </Dialog>
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
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  )
}
