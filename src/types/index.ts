
export type Faculty = {
  _id: string;
  name: string;
  email: string;
  quotaLimit: number;
  quotaUsed: number;
  createdAt: string;
  updatedAt: string;
};

export type Batch = {
    _id: string;
    batchName: string; // Changed from name to batchName to match backend
    username: string;
    project?: string; // or a more detailed project type
    createdAt: string;
    updatedAt: string;
}

export type ProblemStatement = {
  _id: string;
  title: string;
  description: string;
  gDriveLink: string;
  facultyId: Faculty | string;
  uploadedBy: 'admin' | 'faculty';
  isAssigned: boolean;
  createdAt: string;
  updatedAt: string;
};
