
'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, MoreHorizontal, PlusCircle, Loader2, FileText } from 'lucide-react';
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
import { getMyProblemStatements, deleteProblemStatementAsFaculty } from '@/lib/api';
import type { ProblemStatement } from '@/types';

const FacultySidebar = () => (
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton href="/u/portal/dashboard/faculty" title="Dashboard">
        <LayoutDashboard />
      </SidebarMenuButton>
    </SidebarMenuItem>
    <SidebarMenuItem>
      <SidebarMenuButton href="/u/portal/dashboard/faculty/problem-statements" isActive title="My Statements">
        <FileText />
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
);

export default function ManageFacultyProblemStatementsPage() {
  const [statements, setStatements] = useState<ProblemStatement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStatement, setSelectedStatement] = useState<ProblemStatement | null>(null);
  const { toast } = useToast();

  const fetchStatements = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getMyProblemStatements();
      setStatements(data);
    } catch (error) {
      console.error('Failed to fetch statements:', error);
      toast({
        variant: "destructive",
        title: "Failed to load statements",
        description: (error as Error).message || "There was an error fetching the data.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchStatements();
  }, [fetchStatements]);

  const handleStatementCreated = (newStatement: ProblemStatement) => {
    setStatements(current => [...current, newStatement]);
    setIsCreateFormOpen(false);
    toast({ title: "Success", description: "New problem statement created." });
    // Refetch to ensure quota is updated on dashboard if we navigate back
    fetchStatements(); 
  }

  const openDeleteDialog = (statement: ProblemStatement) => {
    setSelectedStatement(statement);
    setIsDeleteDialogOpen(true);
  }

  const handleDeleteConfirm = async () => {
    if (!selectedStatement) return;
    try {
      await deleteProblemStatementAsFaculty(selectedStatement._id);
      setStatements(current => current.filter(s => s._id !== selectedStatement._id));
      toast({ title: "Statement Deleted", description: `Statement "${selectedStatement.title}" has been deleted.`});
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Failed to delete statement",
        description: (error as Error).message || "An unexpected error occurred.",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedStatement(null);
    }
  }

  return (
    <DashboardLayout userRole="Faculty" sidebarContent={<FacultySidebar />}>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Manage My Problem Statements</CardTitle>
                    <CardDescription>View, edit, and manage your uploaded project ideas.</CardDescription>
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
                    <UploadProblemStatementForm onStatementCreated={handleStatementCreated} asRole="faculty" />
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
                            <TableHead>Status</TableHead>
                            <TableHead><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {statements.map(statement => (
                            <TableRow key={statement._id}>
                                <TableCell className="font-medium">{statement.title}</TableCell>
                                <TableCell>
                                    <Badge variant={statement.isAssigned ? "destructive" : "secondary"}>
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
