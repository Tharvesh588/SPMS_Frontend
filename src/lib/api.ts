
import { Faculty, Batch, ProblemStatement } from "@/types";

const API_BASE_URL = "https://egspgoi-spms.onrender.com/api/v1";

// Universal fetch helper
async function fetcher<T>(url: string, options: RequestInit = {}): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        if (response.status === 204) { // Handle no content success
            return {} as T;
        }
        const err = await response.json().catch(() => ({}));
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

export async function login(credentials: LoginCredentials, role: string): Promise<{ token: string }> {
    const loginRole = role === 'admin' ? 'tadmin' : role;
    const response = await fetcher<{ token: string, user: any }>("/auth/login", {
        method: 'POST',
        body: JSON.stringify(credentials),
    });
    if (response.token && typeof window !== 'undefined') {
        localStorage.setItem('token', response.token);
    }
    return response;
}

// Faculty
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


// Batches
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


// Problem Statements - Returns mock data to prevent errors
export async function getProblemStatements(): Promise<ProblemStatement[]> {
  // const response = await fetcher<{
  //   success: boolean;
  //   count: number;
  //   problemStatements: ProblemStatement[];
  // }>("/admin/problem-statements");
  // return response.problemStatements;
  console.warn("Using mock data for getProblemStatements as the admin endpoint is not available.");
  return Promise.resolve([]);
}
