
'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Users, BookCopy, FilePlus2, MoreHorizontal, UserPlus, Loader2, Upload, FileCheck, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCallback, useEffect, useState } from 'react';
import { getBatches, deleteBatch, getBatchFiles, generateFileToken, resetBatchProjectAsAdmin } from '@/lib/api';
import type { Batch, ProblemStatement, Faculty } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { CreateBatchForm } from '@/components/admin/create-batch-form';
import { EditBatchForm } from '@/components/admin/edit-batch-form';
import { ManageStudentsDialog } from '@/components/manage-students-dialog';
import { ConfirmDeleteDialog } from '@/components/confirm-delete-dialog';
import { BulkUploadForm } from '@/components/admin/bulk-upload-form';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { departments } from '@/lib/constants';


const AdminSidebar = () => (
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton href="/u/portal/admin?page=dashboard">
        <LayoutDashboard className="h-4 w-4" />
        Dashboard
      </SidebarMenuButton>
    </SidebarMenuItem>
    <SidebarMenuItem>
      <SidebarMenuButton href="/u/portal/admin?page=faculty">
        <Users className="h-4 w-4" />
        Manage Faculty
      </SidebarMenuButton>
    </SidebarMenuItem>
    <SidebarMenuItem>
      <SidebarMenuButton href="/u/portal/admin?page=batches" isActive>
        <BookCopy className="h-4 w-4" />
        Manage Batches
      </SidebarMenuButton>
    </SidebarMenuItem>
    <SidebarMenuItem>
      <SidebarMenuButton href="/u/portal/admin?page=problem-statements">
        <FilePlus2 className="h-4 w-4" />
        Problem Statements
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
);


function BatchDocumentsDialog({ batch, open, onOpenChange }: { batch: Batch | null, open: boolean, onOpenChange: (open: boolean) => void }) {
  const [files, setFiles] = useState<{ fileId: string; name: string; url: string; uploadedAt: string }[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchFiles() {
      if (!batch) return;
      try {
        const { files } = await getBatchFiles(batch._id);
        setFiles(files || []);
      } catch (error) {
        console.error("Failed to fetch files:", error);
      }
    }
    if (open) fetchFiles();
  }, [batch, open]);

  const handleView = async (fileId: string) => {
    try {
      const { token } = await generateFileToken(fileId);
      window.open(`/view-doc/${token}`, '_blank');
    } catch (error) {
      toast({ variant: 'destructive', title: "View Failed", description: "Could not generate access token." });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Documents for {batch?.batchName}</DialogTitle>
          <DialogDescription>View files uploaded by this batch.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="grid gap-2">
            {files.map(file => (
              <div key={file.fileId} className="flex items-center justify-between p-3 border rounded bg-slate-50 dark:bg-slate-800">
                <div className="flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-primary" />
                  <span className="truncate max-w-[180px]">{file.name}</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleView(file.fileId)}>
                  View
                </Button>
              </div>
            ))}
            {files.length === 0 && <p className="text-center text-muted-foreground">No documents found.</p>}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ManageBatchesPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isManageStudentsOpen, setIsManageStudentsOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);

  // Filtering & Selection
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

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

  // Derived state for filtering
  const filteredBatches = batches.filter(b => {
    if (departmentFilter === 'all') return true;

    // Check students first
    if (b.students && b.students.length > 0) {
      return b.students[0].dept === departmentFilter;
    }

    // Fallback? If no students, maybe we can't filter by dept easily.
    // Or we could check project department if assigned.
    if (b.projectId && typeof b.projectId === 'object' && 'department' in b.projectId) {
      return (b.projectId as any).department === departmentFilter;
    }

    return false; // If no dept info, exclude from filtered view? Or include? Excluding makes "filter" strict.
  });


  // Selection Logic
  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleAllSelection = () => {
    if (selectedIds.size === filteredBatches.length && filteredBatches.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredBatches.map(b => b._id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;

    if (!confirm(`Are you sure you want to delete ${selectedIds.size} batches? This action cannot be undone.`)) {
      return;
    }

    setIsBulkDeleting(true);
    try {
      await Promise.all(Array.from(selectedIds).map(id => deleteBatch(id)));

      setBatches(current => current.filter(b => !selectedIds.has(b._id)));
      setSelectedIds(new Set());
      toast({ title: "Bulk Delete Successful", description: `Deleted ${selectedIds.size} batches.` });
    } catch (error) {
      console.error("Bulk delete failed", error);
      toast({ variant: 'destructive', title: "Bulk Delete Failed", description: "Some deletions may have failed." });
      fetchBatches(); // Sync state
    } finally {
      setIsBulkDeleting(false);
    }
  };

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

  const openDocsDialog = (batch: Batch) => {
    setSelectedBatch(batch);
    setIsDocsOpen(true);
  }

  const openManageStudentsDialog = (batch: Batch) => {
    setSelectedBatch(batch);
    setIsManageStudentsOpen(true);
  }

  const handleResetProject = async (batch: Batch) => {
    if (!confirm(`Are you sure you want to reset the project selection for ${batch.batchName}? This will unlock the batch.`)) return;

    try {
      const result = await resetBatchProjectAsAdmin(batch._id);
      toast({ title: "Project Reset", description: result.message });
      // Refresh batches
      fetchBatches();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to reset project",
        description: (error as Error).message,
      });
    }
  }


  const handleDeleteConfirm = async () => {
    if (!selectedBatch) return;

    try {
      await deleteBatch(selectedBatch._id);
      setBatches(current => current.filter(b => b._id !== selectedBatch._id));
      if (selectedIds.has(selectedBatch._id)) {
        const newSelected = new Set(selectedIds);
        newSelected.delete(selectedBatch._id);
        setSelectedIds(newSelected);
      }
      toast({ title: "Batch Deleted", description: `Account for ${selectedBatch.batchName} has been deleted.` });
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

  const getCoordinatorName = (coordinator: Faculty | string | undefined) => {
    if (typeof coordinator === 'object' && coordinator !== null && 'name' in coordinator) {
      return coordinator.name;
    }
    return 'Not Selected';
  }

  const handleUploadComplete = () => {
    setIsBulkUploadOpen(false);
    fetchBatches(); // Refresh the list
  }

  return (
    <DashboardLayout userRole="Admin" sidebarContent={<AdminSidebar />}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-lg font-semibold md:text-2xl">Manage Batches</h1>
        <div className="flex flex-wrap items-center gap-2">
          {/* Bulk Delete Button */}
          {selectedIds.size > 0 && (
            <Button variant="destructive" size="sm" onClick={handleBulkDelete} disabled={isBulkDeleting}>
              {isBulkDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              Delete ({selectedIds.size})
            </Button>
          )}

          {/* Department Filter */}
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.value} value={dept.value}>{dept.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog open={isBulkUploadOpen} onOpenChange={setIsBulkUploadOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Bulk Upload
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Bulk Upload Batches</DialogTitle>
                <DialogDescription>
                  Upload a CSV file with batch data. The required columns are: batchName, username, password.
                </DialogDescription>
              </DialogHeader>
              <BulkUploadForm entity="batch" onUploadComplete={handleUploadComplete} />
            </DialogContent>
          </Dialog>
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
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Batch Accounts</CardTitle>
          <CardDescription>View, edit, and manage student batch accounts.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-4 text-muted-foreground">Loading batches...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={filteredBatches.length > 0 && selectedIds.size === filteredBatches.length}
                      onCheckedChange={toggleAllSelection}
                    />
                  </TableHead>
                  <TableHead>Batch Name</TableHead>
                  <TableHead className="hidden md:table-cell">Username</TableHead>
                  <TableHead>Assigned Coordinator</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBatches.length > 0 ? (
                  filteredBatches.map(batch => (
                    <TableRow key={batch._id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.has(batch._id)}
                          onCheckedChange={() => toggleSelection(batch._id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{batch.batchName}</TableCell>
                      <TableCell className="hidden md:table-cell">{batch.username}</TableCell>
                      <TableCell>{getCoordinatorName(batch.coordinatorId)}</TableCell>
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
                            <DropdownMenuItem onSelect={() => openDocsDialog(batch)}>View Documents</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => openManageStudentsDialog(batch)}>Manage Students</DropdownMenuItem>
                            {batch.projectId && (
                              <DropdownMenuItem onSelect={() => handleResetProject(batch)} className="text-orange-600">
                                Reset Project
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onSelect={() => openEditDialog(batch)}>Edit Account</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => openDeleteDialog(batch)} className="text-destructive">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No batches found matching the filter.
                    </TableCell>
                  </TableRow>
                )}
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

      <BatchDocumentsDialog
        batch={selectedBatch}
        open={isDocsOpen}
        onOpenChange={(isOpen) => { setIsDocsOpen(isOpen); if (!isOpen) setSelectedBatch(null); }}
      />

      <ManageStudentsDialog
        batch={selectedBatch}
        open={isManageStudentsOpen}
        onOpenChange={(isOpen) => { setIsManageStudentsOpen(isOpen); if (!isOpen) setSelectedBatch(null); }}
        userRole="Admin"
        onBatchUpdated={(updatedBatch) => {
          // Update the list locally
          setBatches(current => current.map(b => b._id === updatedBatch._id ? updatedBatch : b));
        }}
      />


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

