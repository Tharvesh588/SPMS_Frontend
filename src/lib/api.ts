
import { Faculty, Batch, ProblemStatement } from "@/types";

const API_BASE_URL = "https://egspgoi-spms.onrender.com/api/v1";

// Universal fetch helper
async function fetcher<T>(url: string, options: RequestInit = {}): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token && !options.headers?.hasOwnProperty('Authorization')) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        // For DELETE requests, a 200 or 204 status is often success with no content.
        if (options.method === 'DELETE' && (response.status === 200 || response.status === 204)) {
            return {} as T;
        }
        const err = await response.json().catch(() => ({ message: response.statusText || 'Failed to fetch from API' }));
        throw new Error(err.message || 'Failed to fetch from API');
    }
    
    // Handle responses that might not have a body (like DELETE)
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
    }
    
    return {} as T; // Return empty object for non-json responses
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
        role: 'tadmin' | 'faculty' | 'batch';
        // other user properties...
    }
}

export async function login(credentials: LoginCredentials, role: string): Promise<LoginResponse> {
    const response = await fetcher<LoginResponse>(`/auth/login?role=${role}`, {
        method: 'POST',
        body: JSON.stringify(credentials),
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
export async function getBatches(): Promise<Batch[]> {
  const response = await fetcher<{
    success: boolean;
    count: number;
    batches: Batch[];
  }>("/admin/batches");
  return response.batches;
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
  const response = await fetcher<{
    success: boolean;
    count: number;
    problemStatements: ProblemStatement[];
  }>("/problem-statements/unassigned", { headers: { 'Authorization': '' } }); // Public endpoint
  return response.problemStatements;
}


export async function getProblemStatements(): Promise<ProblemStatement[]> {
  const response = await fetcher<{
    success: boolean;
    count: number;
    problemStatements: ProblemStatement[];
  }>("/admin/problem-statements");
  return response.problemStatements;
}

type AdminCreateProblemStatementData = {
    title: string;
    description: string;
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

export async function getAvailableProblemStatementsForBatch(): Promise<ProblemStatement[]> {
    const response = await fetcher<{success: boolean, ps: ProblemStatement[]}>('/batch/problem-statements');
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
