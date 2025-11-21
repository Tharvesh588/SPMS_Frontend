
import { Faculty } from "@/types";

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
    const response = await fetcher<{ token: string }>("/auth/login", {
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
