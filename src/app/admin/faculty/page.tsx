import { DashboardLayout } from '@/components/dashboard-layout';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Users, BookCopy, FilePlus2, MoreHorizontal, UserPlus } from 'lucide-react';
import { problemStatements } from '@/lib/data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const AdminSidebar = () => (
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton href="/admin/dashboard">
        <LayoutDashboard />
        Dashboard
      </SidebarMenuButton>
    </SidebarMenuItem>
    <SidebarMenuItem>
      <SidebarMenuButton href="/admin/faculty" isActive>
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

const facultyData = [...new Set(problemStatements.map(p => p.faculty))].map((name, index) => ({ 
    id: `faculty-${index+1}`, 
    name,
    email: `${name.toLowerCase().replace(/ /g, '.').replace('dr.', '')}@university.edu`,
    username: name.toLowerCase().replace(/ /g, '').replace('dr.', ''),
    quota: 5,
    assigned: Math.floor(Math.random() * 5) + 1
}));


export default function ManageFacultyPage() {
  return (
    <DashboardLayout userRole="Admin" sidebarContent={<AdminSidebar />}>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Manage Faculty</CardTitle>
                    <CardDescription>View, edit, and manage faculty accounts.</CardDescription>
                </div>
                <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Faculty
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead className="hidden md:table-cell">Email</TableHead>
                            <TableHead>Username</TableHead>
                            <TableHead>Quota</TableHead>
                            <TableHead><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {facultyData.map(faculty => (
                            <TableRow key={faculty.id}>
                                <TableCell className="font-medium">{faculty.name}</TableCell>
                                <TableCell className="hidden md:table-cell">{faculty.email}</TableCell>
                                <TableCell>{faculty.username}</TableCell>
                                <TableCell>
                                    <Badge variant={faculty.assigned >= faculty.quota ? "destructive" : "secondary"}>
                                        {faculty.assigned} / {faculty.quota}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                     <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                        <Button
                                            aria-haspopup="true"
                                            size="icon"
                                            variant="ghost"
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">Toggle menu</span>
                                        </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                        <DropdownMenuItem>Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </DashboardLayout>
  );
}