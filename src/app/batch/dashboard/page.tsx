import { DashboardLayout } from '@/components/dashboard-layout';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileCheck, Files, LayoutDashboard } from 'lucide-react';
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

export default function BatchDashboard() {
  return (
    <DashboardLayout userRole="Batch" sidebarContent={<BatchSidebar />}>
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-headline font-semibold">Available Problem Statements</h2>
            <p className="text-muted-foreground">Quota: 1 selection remaining</p>
        </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
        {problemStatements.map((ps) => (
          <ProblemStatementCard key={ps.id} ps={ps} />
        ))}
      </div>
    </DashboardLayout>
  );
}

function ProblemStatementCard({ ps }: { ps: ProblemStatement }) {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle>{ps.title}</CardTitle>
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
          {ps.isAvailable ? 'Select Project' : 'Unavailable'}
        </Button>
      </CardFooter>
    </Card>
  );
}
