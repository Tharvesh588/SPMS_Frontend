import { Faculty } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api/v1';

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
    const response = await fetcher<{ success: boolean, count: number, faculties: Faculty[] }>('/admin/faculties');
    return response.faculties;
}
