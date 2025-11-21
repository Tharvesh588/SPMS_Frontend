
'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Users, BookCopy, FilePlus2, MoreHorizontal, PlusCircle, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCallback, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UploadProblemStatementForm } from '@/components/admin/upload-ps-form';
import { ConfirmDeleteDialog } from '@/components/confirm-delete-dialog';
import { problemStatements as mockProblemStatements, type ProblemStatement as MockProblemStatement } from '@/lib/data';

// This is a temporary type, will be replaced with the real one from src/types
type ProblemStatement = MockProblemStatement & { _id: string; isAssigned: boolean; faculty: { name: string } };

const AdminSidebar = () => (
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton href="/admin/dashboard">
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
      <SidebarMenuButton href="/admin/problem-statements" isActive>
        <FilePlus2 />
        Problem Statements
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
);

export default function ManageProblemStatementsPage() {
  const [statements, setStatements] = useState<ProblemStatement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStatement, setSelectedStatement] = useState<ProblemStatement | null>(null);
  const { toast } = useToast();

  const fetchStatements = useCallback(async () => {
    setIsLoading(true);
    // Replace with actual API call
    setTimeout(() => {
      const formattedData = mockProblemStatements.map((ps, index) => ({
        ...ps,
        _id: ps.id,
        isAssigned: index % 2 === 0, // Mock data for assigned status
        faculty: { name: ps.faculty },
      }));
      setStatements(formattedData);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    fetchStatements();
  }, [fetchStatements]);

  const handleStatementCreated = (newStatement: ProblemStatement) => {
    // This will be implemented when API is ready
    toast({ title: "Success", description: "New problem statement created." });
    setIsCreateFormOpen(false);
    fetchStatements(); // Refetch to show the new data
  }

  const openDeleteDialog = (statement: ProblemStatement) => {
    setSelectedStatement(statement);
    setIsDeleteDialogOpen(true);
  }

  const handleDeleteConfirm = async () => {
    if (!selectedStatement) return;
    // Replace with actual API call
    toast({ title: "Dummy Delete", description: `Statement "${selectedStatement.title}" would be deleted.`});
    setIsDeleteDialogOpen(false);
    setSelectedStatement(null);
  }

  return (
    <DashboardLayout userRole="Admin" sidebarContent={<AdminSidebar />}>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Manage Problem Statements</CardTitle>
                    <CardDescription>View, edit, and manage all project problem statements.</CardDescription>
                </div>
                 <Dialog open={isCreateFormOpen} onOpenChange={setIsCreateFormOpen}>
                  <DialogTrigger asChild>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Statement
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Problem Statement</DialogTitle>
                    </DialogHeader>
                    {/* When API is ready, we might need a specific onStatementCreated prop */}
                    <UploadProblemStatementForm />
                  </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-4 text-muted-foreground">Loading statements...</span>
                </div>
              ): (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Assigned Faculty</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {statements.map(statement => (
                            <TableRow key={statement._id}>
                                <TableCell className="font-medium">{statement.title}</TableCell>
                                <TableCell>{statement.faculty.name}</TableCell>
                                <TableCell>
                                    <Badge variant={statement.isAssigned ? "secondary" : "default"}>
                                        {statement.isAssigned ? 'Assigned' : 'Available'}
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
                                        <DropdownMenuItem onSelect={() => toast({title: "Coming Soon", description: "Edit functionality will be added."})}>Edit</DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => openDeleteDialog(statement)} className="text-destructive">Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
              )}
            </CardContent>
        </Card>

        <ConfirmDeleteDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleDeleteConfirm}
          title="Are you sure you want to delete this statement?"
          description="This action cannot be undone. This will permanently delete the problem statement."
        />

    </DashboardLayout>
  );
}
