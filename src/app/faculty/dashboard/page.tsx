
'use client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, LayoutDashboard, FilePlus2, Users, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getProblemStatements, getFaculties } from '@/lib/api';
import type { ProblemStatement, Faculty } from '@/types';
import { useToast } from '@/hooks/use-toast';

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
  const [myStatements, setMyStatements] = useState<ProblemStatement[]>([]);
  const [faculty, setFaculty] = useState<Faculty | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // This would be replaced with actual logged-in faculty data from context/session
  const loggedInFacultyId = "66a01235171e21262a562854"; 

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [allStatements, allFaculties] = await Promise.all([
          getProblemStatements(),
          getFaculties()
        ]);
        
        const currentFaculty = allFaculties.find(f => f._id === loggedInFacultyId);
        setFaculty(currentFaculty || null);

        const filtered = allStatements.filter(p => {
            if (typeof p.facultyId === 'object' && p.facultyId !== null) {
                return p.facultyId._id === loggedInFacultyId;
            }
            return p.facultyId === loggedInFacultyId;
        });
        setMyStatements(filtered);

      } catch (error) {
        console.error("Failed to fetch faculty data", error);
        toast({
            variant: "destructive",
            title: "Failed to load dashboard",
            description: "Could not fetch the necessary data. Please try again later."
        })
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [loggedInFacultyId, toast]);


  return (
    <DashboardLayout userRole="Faculty" sidebarContent={<FacultySidebar />}>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <StatCard title="My Uploaded PS" value={myStatements.length} isLoading={isLoading} />
            <StatCard title="Assigned PS" value={myStatements.filter(s => s.isAssigned).length} isLoading={isLoading} />
            <StatCard 
                title="My Quota" 
                value={faculty ? `${faculty.quotaUsed} / ${faculty.quotaLimit}` : '...'}
                isLoading={isLoading} 
            />
        </div>
        
        <div className="mt-8">
             <Card>
              <CardHeader>
                <CardTitle>Manage My Problem Statements</CardTitle>
                <CardDescription>Contribute new project ideas and manage your existing ones.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="group">
                  <Link href="/faculty/problem-statements">
                    <FileText className="mr-2 h-4 w-4" />
                    Upload & Manage Statements
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
        </div>

        <div className="mt-8">
            <h2 className="text-2xl font-headline font-semibold mb-4">My Uploaded Statements</h2>
            {isLoading ? (
                 <div className="flex justify-center items-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : myStatements.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {myStatements.slice(0, 3).map(ps => (
                        <Card key={ps._id}>
                            <CardHeader>
                                <CardTitle className="truncate">{ps.title}</CardTitle>
                                 <CardDescription>
                                    <span className={ps.isAssigned ? 'font-semibold text-destructive' : 'font-semibold text-green-600'}>
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
            ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">You haven't uploaded any problem statements yet.</p>
                </div>
            )}
        </div>
    </DashboardLayout>
  );
}


function StatCard({ title, value, isLoading }: { title: string, value: string | number, isLoading: boolean }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
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
