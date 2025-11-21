import { DashboardLayout } from '@/components/dashboard-layout';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, LayoutDashboard, FilePlus2 } from 'lucide-react';

const FacultySidebar = () => (
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton isActive>
        <LayoutDashboard />
        Dashboard
      </SidebarMenuButton>
    </SidebarMenuItem>
    <SidebarMenuItem>
      <SidebarMenuButton>
        <FilePlus2 />
        Upload Statement
      </SidebarMenuButton>
    </SidebarMenuItem>
    <SidebarMenuItem>
      <SidebarMenuButton>
        <FileText />
        My Statements
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
);

export default function FacultyDashboard() {
  return (
    <DashboardLayout userRole="Faculty" sidebarContent={<FacultySidebar />}>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Upload New Problem Statement</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Contribute a new project idea for the students.</p>
            <Button className="mt-4">
              <Upload className="mr-2 h-4 w-4" />
              Upload Statement
            </Button>
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>My Uploaded Statements</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">
                    Total problem statements uploaded
                </p>
            </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
