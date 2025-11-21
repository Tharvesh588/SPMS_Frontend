
'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Users, BookCopy, FilePlus2, MoreHorizontal, UserPlus, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCallback, useEffect, useState } from 'react';
import { getBatches, deleteBatch } from '@/lib/api';
import type { Batch } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CreateBatchForm } from '@/components/admin/create-batch-form';
import { EditBatchForm } from '@/components/admin/edit-batch-form';
import { ConfirmDeleteDialog } from '@/components/confirm-delete-dialog';


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
      <SidebarMenuButton href="/admin/batches" isActive>
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

export default function ManageBatchesPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const { toast } = useToast();

  const fetchBatches = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getBatches();
      setBatches(data);
    } catch (error) {
      console.error('Failed to fetch batches:', error);
      toast({
        variant: "destructive",
        title: "Failed to load batches",
        description: (error as Error).message || "There was an error fetching the batch data. Please try again later.",
      })
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchBatches();
  }, [fetchBatches]);

  const handleBatchCreated = (newBatch: Batch) => {
    setBatches(currentBatches => [...currentBatches, newBatch]);
    setIsCreateFormOpen(false);
  }

  const handleBatchUpdated = (updatedBatch: Batch) => {
    setBatches(current => current.map(b => b._id === updatedBatch._id ? updatedBatch : b));
    setIsEditFormOpen(false);
    setSelectedBatch(null);
  }

  const openEditDialog = (batch: Batch) => {
    setSelectedBatch(batch);
    setIsEditFormOpen(true);
  }

  const openDeleteDialog = (batch: Batch) => {
    setSelectedBatch(batch);
    setIsDeleteDialogOpen(true);
  }

  const handleDeleteConfirm = async () => {
    if (!selectedBatch) return;

    try {
      await deleteBatch(selectedBatch._id);
      setBatches(current => current.filter(b => b._id !== selectedBatch._id));
      toast({ title: "Batch Deleted", description: `Account for ${selectedBatch.batchName} has been deleted.`});
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Failed to delete batch",
        description: (error as Error).message || "An unexpected error occurred.",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedBatch(null);
    }
  }

  return (
    <DashboardLayout userRole="Admin" sidebarContent={<AdminSidebar />}>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Manage Batches</CardTitle>
                    <CardDescription>View, edit, and manage student batch accounts.</CardDescription>
                </div>
                 <Dialog open={isCreateFormOpen} onOpenChange={setIsCreateFormOpen}>
                  <DialogTrigger asChild>
                    <Button>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add Batch
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Batch Account</DialogTitle>
                    </DialogHeader>
                    <CreateBatchForm onBatchCreated={handleBatchCreated} />
                  </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-4 text-muted-foreground">Loading batches...</span>
                </div>
              ): (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Batch Name</TableHead>
                            <TableHead className="hidden md:table-cell">Username</TableHead>
                            <TableHead>Project Selected</TableHead>
                            <TableHead><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {batches.map(batch => (
                            <TableRow key={batch._id}>
                                <TableCell className="font-medium">{batch.batchName}</TableCell>
                                <TableCell className="hidden md:table-cell">{batch.username}</TableCell>
                                <TableCell>{batch.project || 'Not Selected'}</TableCell>
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
                                        <DropdownMenuItem onSelect={() => openEditDialog(batch)}>Edit</DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => openDeleteDialog(batch)} className="text-destructive">Delete</DropdownMenuItem>
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

        {selectedBatch && (
          <Dialog open={isEditFormOpen} onOpenChange={(isOpen) => { setIsEditFormOpen(isOpen); if (!isOpen) setSelectedBatch(null); }}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Batch Account</DialogTitle>
              </DialogHeader>
              <EditBatchForm batch={selectedBatch} onBatchUpdated={handleBatchUpdated} />
            </DialogContent>
          </Dialog>
        )}

        <ConfirmDeleteDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleDeleteConfirm}
          title="Are you sure you want to delete this batch?"
          description="This action cannot be undone. This will permanently delete the batch account."
        />

    </DashboardLayout>
  );
}
