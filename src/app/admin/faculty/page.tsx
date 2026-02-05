
'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Users, BookCopy, FilePlus2, MoreHorizontal, UserPlus, Loader2, Upload, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCallback, useEffect, useState } from 'react';
import { getFaculties, deleteFaculty } from '@/lib/api';
import type { Faculty } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { CreateFacultyForm } from '@/components/admin/create-faculty-form';
import { EditFacultyForm } from '@/components/admin/edit-faculty-form';
import { ConfirmDeleteDialog } from '@/components/confirm-delete-dialog';
import { BulkUploadForm } from '@/components/admin/bulk-upload-form';
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
      <SidebarMenuButton href="/u/portal/admin?page=faculty" isActive>
        <Users className="h-4 w-4" />
        Manage Faculty
      </SidebarMenuButton>
    </SidebarMenuItem>
    <SidebarMenuItem>
      <SidebarMenuButton href="/u/portal/admin?page=batches">
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

export default function ManageFacultyPage() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);

  // Filtering & Selection
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const { toast } = useToast();

  const fetchFaculties = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getFaculties();
      setFaculties(data);
    } catch (error) {
      console.error('Failed to fetch faculties:', error);
      toast({
        variant: "destructive",
        title: "Failed to load faculties",
        description: (error as Error).message || "There was an error fetching the faculty data. Please try again later.",
      })
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchFaculties();
  }, [fetchFaculties]);

  // Derived state for filtering
  const filteredFaculties = faculties.filter(f => {
    if (departmentFilter === 'all') return true;
    return f.department === departmentFilter;
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
    if (selectedIds.size === filteredFaculties.length && filteredFaculties.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredFaculties.map(f => f._id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;

    if (!confirm(`Are you sure you want to delete ${selectedIds.size} faculties? This action cannot be undone.`)) {
      return;
    }

    setIsBulkDeleting(true);
    try {
      await Promise.all(Array.from(selectedIds).map(id => deleteFaculty(id)));

      setFaculties(current => current.filter(f => !selectedIds.has(f._id)));
      setSelectedIds(new Set());
      toast({ title: "Bulk Delete Successful", description: `Deleted ${selectedIds.size} faculties.` });
    } catch (error) {
      console.error("Bulk delete failed", error);
      toast({ variant: 'destructive', title: "Bulk Delete Failed", description: "Some deletions may have failed." });
      fetchFaculties(); // Sync state
    } finally {
      setIsBulkDeleting(false);
    }
  };


  const handleFacultyCreated = (newFaculty: Faculty) => {
    setFaculties(current => [...current, newFaculty]);
    setIsCreateFormOpen(false);
  }

  const handleFacultyUpdated = (updatedFaculty: Faculty) => {
    setFaculties(current => current.map(f => f._id === updatedFaculty._id ? updatedFaculty : f));
    setIsEditFormOpen(false);
    setSelectedFaculty(null);
  }

  const openEditDialog = (faculty: Faculty) => {
    setSelectedFaculty(faculty);
    setIsEditFormOpen(true);
  }

  const openDeleteDialog = (faculty: Faculty) => {
    setSelectedFaculty(faculty);
    setIsDeleteDialogOpen(true);
  }

  const handleDeleteConfirm = async () => {
    if (!selectedFaculty) return;

    try {
      await deleteFaculty(selectedFaculty._id);
      setFaculties(current => current.filter(f => f._id !== selectedFaculty._id));
      // Remove from selectedIds if present
      if (selectedIds.has(selectedFaculty._id)) {
        const newSelected = new Set(selectedIds);
        newSelected.delete(selectedFaculty._id);
        setSelectedIds(newSelected);
      }
      toast({ title: "Faculty Deleted", description: `Account for ${selectedFaculty.name} has been deleted.` });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to delete faculty",
        description: (error as Error).message || "An unexpected error occurred.",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedFaculty(null);
    }
  }

  const handleUploadComplete = () => {
    setIsBulkUploadOpen(false);
    fetchFaculties(); // Refresh the list
  }


  return (
    <DashboardLayout userRole="Admin" sidebarContent={<AdminSidebar />}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-lg font-semibold md:text-2xl">Manage Faculty</h1>
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
                <DialogTitle>Bulk Upload Faculty</DialogTitle>
                <DialogDescription>
                  Upload a CSV file with faculty data. The required columns are: name, email, password, department, quotaLimit.
                </DialogDescription>
              </DialogHeader>
              <BulkUploadForm entity="faculty" onUploadComplete={handleUploadComplete} />
            </DialogContent>
          </Dialog>

          <Dialog open={isCreateFormOpen} onOpenChange={setIsCreateFormOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Faculty
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Faculty Account</DialogTitle>
              </DialogHeader>
              <CreateFacultyForm onFacultyCreated={handleFacultyCreated} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Faculty Accounts</CardTitle>
          <CardDescription>View, edit, and manage faculty accounts.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-4 text-muted-foreground">Loading faculties...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={filteredFaculties.length > 0 && selectedIds.size === filteredFaculties.length}
                      onCheckedChange={toggleAllSelection}
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Quota</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFaculties.length > 0 ? (
                  filteredFaculties.map(faculty => (
                    <TableRow key={faculty._id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.has(faculty._id)}
                          onCheckedChange={() => toggleSelection(faculty._id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{faculty.name}</TableCell>
                      <TableCell className="hidden md:table-cell">{faculty.email}</TableCell>
                      <TableCell>{faculty.department}</TableCell>
                      <TableCell>
                        <Badge variant={faculty.quotaUsed >= faculty.quotaLimit ? "destructive" : "secondary"}>
                          {faculty.quotaUsed} / {faculty.quotaLimit}
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
                            <DropdownMenuItem onSelect={() => openEditDialog(faculty)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => openDeleteDialog(faculty)} className="text-destructive">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No faculties found matching the filter.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {selectedFaculty && (
        <Dialog open={isEditFormOpen} onOpenChange={(isOpen) => { setIsEditFormOpen(isOpen); if (!isOpen) setSelectedFaculty(null); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Faculty Account</DialogTitle>
            </DialogHeader>
            <EditFacultyForm faculty={selectedFaculty} onFacultyUpdated={handleFacultyUpdated} />
          </DialogContent>
        </Dialog>
      )}

      <ConfirmDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Are you sure you want to delete this faculty?"
        description="This action cannot be undone. This will permanently delete the faculty account."
      />

    </DashboardLayout>
  );
}

