
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
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to fetch from API');
    }
    
    const data = await response.json();
    return data;
}

// Auth
type LoginCredentials = {
  email?: string;
  username?: string;
  password?: string;
};

export async function login(credentials: LoginCredentials): Promise<{ token: string }> {
    const response = await fetcher<{ token: string, user: any }>("/auth/login", {
        method: 'POST',
        body: JSON.stringify(credentials),
    });
    if (response.token && typeof window !== 'undefined') {
        localStorage.setItem('token', response.token);
    }
    return response;
}

// Fetch real faculties
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

export async function createFaculty(facultyData: CreateFacultyData): Promise<any> {
    return fetcher("/admin/faculties", {
        method: 'POST',
        body: JSON.stringify(facultyData)
    });
}


type CreateBatchData = {
    batchName: string;
    username: string;
    password: string;
};

export async function createBatch(batchData: CreateBatchData): Promise<{success: boolean, batch: Batch}> {
    return fetcher("/admin/batches", {
        method: 'POST',
        body: JSON.stringify(batchData)
    });
}

export async function getBatches(): Promise<Batch[]> {
  const response = await fetcher<{
    success: boolean;
    count: number;
    batches: Batch[];
  }>("/admin/batches");
  return response.batches;
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
