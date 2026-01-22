
import { Faculty, Batch, ProblemStatement, Student } from "@/types";

const API_BASE_URL = "https://egspgoi-spms.onrender.com/api/v1";

// Universal fetch helper
async function fetcher<T>(url: string, options: RequestInit = {}): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    const isProtectedRoute = url.startsWith('/admin') || url.startsWith('/faculty') || url.startsWith('/batch');

    if (isProtectedRoute) {
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        } else {
            // Immediately throw an error if a protected route is accessed without a token.
            throw new Error("Not authorized for this role.");
        }
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        if (options.method === 'DELETE' && (response.status === 200 || response.status === 204)) {
            return {} as T;
        }
        
        const contentType = response.headers.get("content-type");
        let errMessage = `Request failed with status: ${response.status}`;

        if (contentType && contentType.indexOf("application/json") !== -1) {
            try {
                const err = await response.json();
                errMessage = err.message || JSON.stringify(err);
            } catch (e) {
                errMessage = `Failed to parse JSON error response. Status: ${response.status} ${response.statusText}`;
            }
        } else {
            errMessage = response.statusText || 'Failed to fetch from API';
        }
        
        throw new Error(errMessage);
    }
    
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
    }
    
    return {} as T;
}


// Auth
type LoginCredentials = {
  email?: string;
  username?: string;
  password?: string;
};

type LoginResponse = {
    token: string;
    user: {
        id: string;
        role: 'admin' | 'faculty' | 'batch';
    }
}

export async function login(credentials: LoginCredentials, role: string): Promise<LoginResponse> {
    const response = await fetcher<LoginResponse>(`/auth/login?role=${role}`, {
        method: 'POST',
        body: JSON.stringify({
            ...credentials,
            apiKey: 'temp-key'
        }),
    });
    if (response.token && typeof window !== 'undefined') {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.user.id);
        localStorage.setItem('userRole', response.user.role);
    }
    return response;
}

// Admin - Faculty
export async function getFaculties(): Promise<Faculty[]> {
  const response = await fetcher<{
    success: boolean;
    count: number;
    faculties: Faculty[];
  }>("/admin/faculties");
  return response.faculties;
}

type CreateFacultyData = {
    name: string;
    email: string;
    password: string;
    department: string;
    quotaLimit: number;
};

export async function createFaculty(facultyData: CreateFacultyData): Promise<{success: boolean, faculty: Faculty}> {
    return fetcher("/admin/faculties", {
        method: 'POST',
        body: JSON.stringify(facultyData)
    });
}

type UpdateFacultyData = {
    name?: string;
    email?: string;
    department?: string;
    quotaLimit?: number;
};
export async function updateFaculty(id: string, facultyData: UpdateFacultyData): Promise<{success: boolean, faculty: Faculty}> {
    return fetcher(`/admin/faculties/${id}`, {
        method: 'PUT',
        body: JSON.stringify(facultyData)
    });
}

export async function deleteFaculty(id: string): Promise<void> {
    await fetcher(`/admin/faculties/${id}`, {
        method: 'DELETE',
    });
}


// Admin - Batches
export async function getBatchDetailsAsAdmin(batchId: string): Promise<{success: boolean, batch: Batch}> {
    return fetcher(`/admin/batches/${batchId}`);
}

export async function getBatches(): Promise<Batch[]> {
    const { batches } = await fetcher<{ success: boolean; count: number; batches: Batch[] }>("/admin/batches");
    return batches;
}


type CreateBatchData = {
    batchName: string;
    username: string;
    password: string;
};

export async function createBatch(batchData: CreateBatchData): Promise<{success: boolean, batch: Batch}> {
    const response = await fetcher<{success: boolean, batch: Batch}>("/admin/batches", {
        method: 'POST',
        body: JSON.stringify(batchData)
    });
    return response;
}

type UpdateBatchData = {
    batchName?: string;
    username?: string;
};

export async function updateBatch(id: string, batchData: UpdateBatchData): Promise<{success: boolean, batch: Batch}> {
    return fetcher(`/admin/batches/${id}`, {
        method: 'PUT',
        body: JSON.stringify(batchData)
    });
}

export async function deleteBatch(id: string): Promise<void> {
    await fetcher(`/admin/batches/${id}`, {
        method: 'DELETE',
    });
}


// Problem Statements (Public / Admin)
export async function getUnassignedProblemStatements(): Promise<ProblemStatement[]> {
    const response = await fetcher<{ success: boolean, count: number, problemStatements: ProblemStatement[] }>("/problem-statements/unassigned");
    return response.problemStatements;
}

export async function getProblemStatementsForAdmin(department?: string): Promise<ProblemStatement[]> {
  const url = department ? `/admin/problem-statements?department=${department}` : "/admin/problem-statements";
  const response = await fetcher<{
    success: boolean;
    count: number;
    problemStatements: ProblemStatement[];
  }>(url);
  return response.problemStatements;
}

type AdminCreateProblemStatementData = {
    title: string;
    description: string;
    department: string;
    gDriveLink: string;
    facultyId: string;
};

export async function createProblemStatement(psData: AdminCreateProblemStatementData): Promise<{success: boolean, ps: ProblemStatement}> {
    return fetcher('/admin/problem-statements', {
        method: 'POST',
        body: JSON.stringify(psData)
    });
}

export async function deleteProblemStatement(id: string): Promise<void> {
    await fetcher(`/admin/problem-statements/${id}`, {
        method: 'DELETE',
    });
}


// Faculty Endpoints
export type FacultyDashboardData = {
    facultyDetails: {
        name: string;
        email: string;
        department: string;
        quotaLimit: number;
        quotaUsed: number;
    };
    totalProblemStatements: number;
    assignedBatches: {
        _id: string;
        batchName: string;
        projectId: {
            _id: string;
            title: string;
        } | null;
    }[];
};

export async function getFacultyDashboard(): Promise<{success: boolean, dashboard: FacultyDashboardData}> {
    return fetcher('/faculty/dashboard');
}

export async function getMyProblemStatements(): Promise<ProblemStatement[]> {
    const response = await fetcher<{success: boolean, list: ProblemStatement[]}>('/faculty/problem-statements');
    return response.list;
}

type FacultyCreateProblemStatementData = {
    title: string;
    description: string;
    gDriveLink: string;
};

export async function createProblemStatementAsFaculty(psData: FacultyCreateProblemStatementData): Promise<{success: boolean, ps: ProblemStatement}> {
    return fetcher('/faculty/problem-statements', {
        method: 'POST',
        body: JSON.stringify(psData)
    });
}

export async function deleteProblemStatementAsFaculty(id: string): Promise<void> {
    await fetcher(`/faculty/problem-statements/${id}`, {
        method: 'DELETE',
    });
}

// Batch Endpoints

export async function getAvailableProblemStatementsForBatch(department?: string): Promise<ProblemStatement[]> {
    const url = department ? `/batch/problem-statements?department=${department}` : '/batch/problem-statements';
    const response = await fetcher<{success: boolean, ps: ProblemStatement[]}>(url);
    return response.ps;
}

export async function getBatchDetails(batchId: string): Promise<{success: boolean, batch: Batch}> {
    return fetcher(`/batch/${batchId}/details`);
}

export async function chooseProblemStatement(batchId: string, psId: string): Promise<{success: boolean, message: string, batch: Batch}> {
    return fetcher(`/batch/${batchId}/choose-ps`, {
        method: 'PUT',
        body: JSON.stringify({ psId })
    });
}

export async function saveStudentsForBatch(batchId: string, students: Student[]): Promise<{success: boolean, batch: Batch}> {
    return fetcher(`/batch/${batchId}/students`, {
        method: 'POST',
        body: JSON.stringify({ students })
    });
}

export async function generateBatchReport(batchId: string): Promise<{success: boolean, report: any}> {
    return fetcher(`/batch/${batchId}/report`);
}

// Bulk Upload
export async function bulkUpload(
  entity: 'faculty' | 'batch' | 'problem-statements',
  file: File
): Promise<any> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
        throw new Error("Not authorized for this role.");
    }
    
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/${entity}/bulk-upload`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || `Upload failed with status: ${response.status}`);
    }

    return result;
}
