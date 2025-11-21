import { Faculty } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api/v1';

// Mock data to be used temporarily
const mockFaculties: Faculty[] = [
  { _id: 'faculty-1', name: 'Dr. Alan Turing', email: 'alan.turing@university.edu', quotaLimit: 5, quotaUsed: 2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: 'faculty-2', name: 'Dr. Ada Lovelace', email: 'ada.lovelace@university.edu', quotaLimit: 5, quotaUsed: 5, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: 'faculty-3', name: 'Dr. Grace Hopper', email: 'grace.hopper@university.edu', quotaLimit: 3, quotaUsed: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];


async function fetcher<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    // In a real app, you'd get the token from your auth context/storage
    'Authorization': `Bearer your-admin-auth-token`, 
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorInfo = await response.json();
    throw new Error(errorInfo.message || 'An error occurred while fetching the data.');
  }

  const data = await response.json();
  return data;
}

export async function getFaculties(): Promise<Faculty[]> {
    // Temporarily return mock data to avoid fetch errors
    console.log("Using mock faculty data.");
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(mockFaculties);
        }, 500); // Simulate network delay
    });

    // Original fetch call is commented out
    // const response = await fetcher<{ success: boolean, count: number, faculties: Faculty[] }>('/admin/faculties');
    // return response.faculties;
}
