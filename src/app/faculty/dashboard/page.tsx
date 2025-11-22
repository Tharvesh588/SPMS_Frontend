
'use client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, LayoutDashboard, FilePlus2, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getProblemStatements } from '@/lib/api';
import type { ProblemStatement } from '@/types';

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
  // NOTE: This component assumes a logged-in faculty context is available
  // to determine which statements belong to "me". For this example, we'll
  // filter by a hardcoded name, but in a real app, this would use the
  // logged-in user's ID.
  const [myStatements, setMyStatements] = useState<ProblemStatement[]>([]);
  const [facultyName, setFacultyName] = useState('Dr. Ada Lovelace'); // Example name

  useEffect(() => {
    const fetchStatements = async () => {
      try {
        const allStatements = await getProblemStatements();
        // This is a mock filter. In reality, you'd filter by faculty ID from the session
        const filtered = allStatements.filter(p => typeof p.facultyId === 'object' && p.facultyId.name === facultyName);
        setMyStatements(filtered);
      } catch (error) {
        console.error("Failed to fetch problem statements", error);
      }
    };
    fetchStatements();
  }, [facultyName]);


  return (
    <DashboardLayout userRole="Faculty" sidebarContent={<FacultySidebar />}>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Upload New Problem Statement</CardTitle>
                <CardDescription>Contribute a new project idea for the students to select.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="group">
                  <Link href="/faculty/problem-statements">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload & Manage Statements
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
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
                    <Card key={ps._id}>
                        <CardHeader>
                            <CardTitle className="truncate">{ps.title}</CardTitle>
                             <CardDescription>
                                <span className={ps.isAssigned ? 'text-destructive' : 'text-green-600'}>
                                    {ps.isAssigned ? 'Assigned' : 'Available'}
                                </span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground line-clamp-2">{ps.description}</p>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/faculty/problem-statements">View Details</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    </DashboardLayout>
  );
}
