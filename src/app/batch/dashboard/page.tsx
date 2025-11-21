import { DashboardLayout } from '@/components/dashboard-layout';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileCheck, Files, LayoutDashboard, CheckCircle } from 'lucide-react';
import { problemStatements, type ProblemStatement } from '@/lib/data';

const BatchSidebar = () => (
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton isActive>
        <LayoutDashboard />
        Dashboard
      </SidebarMenuButton>
    </SidebarMenuItem>
    <SidebarMenuItem>
      <SidebarMenuButton>
        <Files />
        All Statements
      </SidebarMenuButton>
    </SidebarMenuItem>
    <SidebarMenuItem>
      <SidebarMenuButton>
        <FileCheck />
        My Selection
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
);

const projectSelected = true; // Set to false to see the other state

export default function BatchDashboard() {
  const selectedProject = problemStatements[1];

  return (
    <DashboardLayout userRole="Batch" sidebarContent={<BatchSidebar />}>
      {projectSelected ? (
        <SelectedProjectView project={selectedProject} />
      ) : (
        <AvailableProjectsView />
      )}
    </DashboardLayout>
  );
}

function AvailableProjectsView() {
    return (
        <>
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-headline font-semibold">Available Problem Statements</h2>
                <p className="text-muted-foreground">You can select 1 project.</p>
            </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
            {problemStatements.map((ps) => (
              <ProblemStatementCard key={ps.id} ps={ps} />
            ))}
          </div>
        </>
    )
}

function SelectedProjectView({ project }: { project: ProblemStatement }) {
  return (
    <div>
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-8" role="alert">
            <div className="flex">
                <div className="py-1"><CheckCircle className="h-6 w-6 text-green-500 mr-4" /></div>
                <div>
                    <p className="font-bold">Project Selected!</p>
                    <p className="text-sm">You have successfully selected your final year project. You cannot change this selection.</p>
                </div>
            </div>
        </div>
      <h2 className="text-3xl font-headline font-bold mb-6">My Project Details</h2>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">{project.title}</CardTitle>
                    <CardDescription>Domain: {project.domain}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-6">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                        {project.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                    </div>
                </CardContent>
                 <CardFooter>
                    <Button asChild variant="link">
                        <a href="#" target="_blank" rel="noopener noreferrer">View Google Drive Link</a>
                    </Button>
                </CardFooter>
            </Card>
        </div>
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Project Coordinator</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-4">
                        <div className="text-3xl font-bold">{project.faculty}</div>
                    </div>
                     <p className="text-sm text-muted-foreground mt-4">Contact your coordinator for further guidance.</p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}

function ProblemStatementCard({ ps }: { ps: ProblemStatement }) {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300 border-2 border-transparent hover:border-primary">
      <CardHeader>
        <CardTitle className="line-clamp-2">{ps.title}</CardTitle>
        <CardDescription>By {ps.faculty} | Domain: {ps.domain}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {ps.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
            {ps.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" disabled={!ps.isAvailable}>
          {ps.isAvailable ? 'View & Select' : 'Unavailable'}
        </Button>
      </CardFooter>
    </Card>
  );
}