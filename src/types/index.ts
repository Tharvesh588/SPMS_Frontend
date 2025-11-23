
export type Faculty = {
  _id: string;
  name: string;
  email: string;
  quotaLimit: number;
  quotaUsed: number;
  createdAt: string;
  updatedAt: string;
};

export type Student = {
    nameInitial: string;
    rollNumber: string;
    dept: string;
    section: string;
    year: string;
    mailId: string;
    phone: string;
}

export type Batch = {
    _id: string;
    batchName: string;
    username: string;
    coordinatorId?: Faculty | string;
    projectId?: ProblemStatement | string;
    students: Student[];
    isLocked: boolean;
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
