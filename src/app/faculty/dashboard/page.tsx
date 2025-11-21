import { DashboardLayout } from '@/components/dashboard-layout';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, LayoutDashboard, FilePlus2, Users, ArrowRight } from 'lucide-react';
import { problemStatements } from '@/lib/data';

const FacultySidebar = () => (
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton isActive title="Dashboard">
        <LayoutDashboard />
      </SidebarMenuButton>
    </SidebarMenuItem>
    <SidebarMenuItem>
      <SidebarMenuButton title="Upload Statement">
        <FilePlus2 />
      </SidebarMenuButton>
    </SidebarMenuItem>
    <SidebarMenuItem>
      <SidebarMenuButton title="My Statements">
        <FileText />
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
);

export default function FacultyDashboard() {
  const myStatements = problemStatements.filter(p => p.faculty === 'Dr. Ada Lovelace');

  return (
    <DashboardLayout userRole="Faculty" sidebarContent={<FacultySidebar />}>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Upload New Problem Statement</CardTitle>
                <CardDescription>Contribute a new project idea for the students to select.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="group">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Statement
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
            <Card className="flex flex-col justify-center items-center text-center bg-accent/20">
                <CardHeader>
                    <CardTitle>My Quota</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-5xl font-bold text-accent">3 / 5</div>
                    <p className="text-xs text-muted-foreground mt-2">Batches Selected</p>
                </CardContent>
            </Card>
        </div>
        <div className="mt-8">
            <h2 className="text-2xl font-headline font-semibold mb-4">My Uploaded Statements</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {myStatements.map(ps => (
                    <Card key={ps.id}>
                        <CardHeader>
                            <CardTitle className="truncate">{ps.title}</CardTitle>
                            <CardDescription>Domain: {ps.domain}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground line-clamp-2">{ps.description}</p>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" size="sm">View Details</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    </DashboardLayout>
  );
}
