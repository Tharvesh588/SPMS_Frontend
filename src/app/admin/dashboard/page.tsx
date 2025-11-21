import { DashboardLayout } from '@/components/dashboard-layout';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Users, UserPlus, LayoutDashboard, FilePlus2, BookCopy, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CreateFacultyForm } from '@/components/admin/create-faculty-form';
import { CreateBatchForm } from '@/components/admin/create-batch-form';
import { UploadProblemStatementForm } from '@/components/admin/upload-ps-form';
import Link from 'next/link';

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
      <SidebarMenuButton href="#">
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
  return (
    <DashboardLayout userRole="Admin" sidebarContent={<AdminSidebar />}>
        <div className="flex flex-col gap-6">
            <Card className="col-span-1 lg:col-span-3">
                <CardHeader>
                    <CardTitle>Welcome, Admin</CardTitle>
                    <CardDescription>Manage the entire project allocation system from here.</CardDescription>
                </CardHeader>
            </Card>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Dialog>
                    <DashboardActionCard 
                        title="Create Faculty Account"
                        description="Onboard new faculty members by creating their accounts."
                        icon={<UserPlus className="h-8 w-8 text-accent" />}
                        actionText="Create Account"
                        asTrigger
                    />
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create Faculty Account</DialogTitle>
                        </DialogHeader>
                        <CreateFacultyForm />
                    </DialogContent>
                </Dialog>
                
                <Dialog>
                    <DashboardActionCard 
                        title="Create Batch Account"
                        description="Create accounts for new student batches."
                        icon={<Users className="h-8 w-8 text-accent" />}
                        actionText="Create Account"
                        asTrigger
                    />
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create Batch Account</DialogTitle>
                        </DialogHeader>
                        <CreateBatchForm />
                    </DialogContent>
                </Dialog>

                <Dialog>
                    <DashboardActionCard 
                        title="Upload Problem Statement"
                        description="Add a new problem statement on behalf of any faculty."
                        icon={<Upload className="h-8 w-8 text-accent" />}
                        actionText="Upload Now"
                        asTrigger
                    />
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Upload Problem Statement</DialogTitle>
                        </DialogHeader>
                        <UploadProblemStatementForm />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    </DashboardLayout>
  );
}

function DashboardActionCard({ title, description, icon, actionText, asTrigger = false }: { title: string, description: string, icon: React.ReactNode, actionText: string, asTrigger?: boolean }) {
    const ButtonComponent = asTrigger ? DialogTrigger : Button;
    return (
        <Card className="flex flex-col">
            <CardHeader className="flex-grow">
                <div className="mb-4 flex justify-center items-center h-16 w-16 rounded-full bg-accent/10">
                    {icon}
                </div>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                 <Button asChild className="w-full group">
                    <ButtonComponent>
                        {actionText}
                        <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </ButtonComponent>
                </Button>
            </CardContent>
        </Card>
    )
}