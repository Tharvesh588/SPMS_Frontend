import { Faculty } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api/v1';

// Mock data to be used when the API is not available
const mockFaculties: Faculty[] = [
    {
        _id: "faculty-1",
        name: "Dr. Alan Turing",
        email: "alan.turing@university.edu",
        quotaLimit: 5,
        quotaUsed: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        _id: "faculty-2",
        name: "Dr. Ada Lovelace",
        email: "ada.lovelace@university.edu",
        quotaLimit: 5,
        quotaUsed: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        _id: "faculty-3",
        name: "Dr. Grace Hopper",
        email: "grace.hopper@university.edu",
        quotaLimit: 4,
        quotaUsed: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
];


async function fetcher<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer your-admin-auth-token`, 
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorInfo = await response.json();
      throw new Error(errorInfo.message || 'An error occurred while fetching the data.');
    }

    return await response.json();
  } catch (error: any) {
    console.error("API fetch error:", error);
    throw new Error(error.message || 'An error occurred while fetching the data.');
  }
}

export async function getFaculties(): Promise<Faculty[]> {
    // Re-introduce mock data to prevent blocking UI development
    console.warn("Using mock data for faculties. Ensure your backend is running to fetch live data.");
    return Promise.resolve(mockFaculties);
    
    // try {
    //     const response = await fetcher<{ success: boolean, count: number, data: Faculty[] }>('/admin/faculties');
    //     return response.data;
    // } catch (error) {
    //     console.error("Failed to fetch faculties, returning mock data as a fallback.", error);
    //     return mockFaculties;
    // }
}
