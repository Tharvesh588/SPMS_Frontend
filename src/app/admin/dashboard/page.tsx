import { DashboardLayout } from '@/components/dashboard-layout';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Users, UserPlus, LayoutDashboard, FilePlus2, BookCopy, ArrowRight } from 'lucide-react';

const AdminSidebar = () => (
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton isActive title="Dashboard">
        <LayoutDashboard />
      </SidebarMenuButton>
    </SidebarMenuItem>
    <SidebarMenuItem>
      <SidebarMenuButton title="Manage Faculty">
        <Users />
      </SidebarMenuButton>
    </SidebarMenuItem>
    <SidebarMenuItem>
      <SidebarMenuButton title="Manage Batches">
        <BookCopy />
      </SidebarMenuButton>
    </SidebarMenuItem>
    <SidebarMenuItem>
      <SidebarMenuButton title="Problem Statements">
        <FilePlus2 />
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
);

export default function AdminDashboard() {
  return (
    <DashboardLayout userRole="Admin" sidebarContent={<AdminSidebar />}>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-1 lg:col-span-3">
                <CardHeader>
                    <CardTitle>Welcome, Admin</CardTitle>
                    <CardDescription>Manage the entire project allocation system from here.</CardDescription>
                </CardHeader>
            </Card>
            <DashboardActionCard 
                title="Create Faculty Account"
                description="Onboard new faculty members by creating their accounts."
                icon={<UserPlus className="h-8 w-8 text-accent" />}
                actionText="Create Account"
            />
            <DashboardActionCard 
                title="Create Batch Account"
                description="Create accounts for new student batches."
                icon={<Users className="h-8 w-8 text-accent" />}
                actionText="Create Account"
            />
            <DashboardActionCard 
                title="Upload Problem Statement"
                description="Add a new problem statement on behalf of any faculty."
                icon={<Upload className="h-8 w-8 text-accent" />}
                actionText="Upload Now"
            />
        </div>
    </DashboardLayout>
  );
}

function DashboardActionCard({ title, description, icon, actionText }: { title: string, description: string, icon: React.ReactNode, actionText: string }) {
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
                 <Button className="w-full group">
                    {actionText}
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
            </CardContent>
        </Card>
    )
}
