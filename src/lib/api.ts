import { Faculty } from "@/types";

// Updated API URL (your real backend)
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://egspgoi-spms.onrender.com/api/v1";

const MOCK_FACULTIES: Faculty[] = [
    {
        "_id": "691d76555b4fb19d2ca096e0",
        "name": "Dr. John Doe (Mock)",
        "email": "faculty@example.com",
        "quotaLimit": 10,
        "quotaUsed": 1,
        "createdAt": "2025-11-19T07:48:37.917Z",
        "updatedAt": "2025-11-19T09:21:35.989Z",
    },
    {
        "_id": "691d76555b4fb19d2ca096e1",
        "name": "Dr. Jane Smith (Mock)",
        "email": "jane.smith@example.com",
        "quotaLimit": 8,
        "quotaUsed": 5,
        "createdAt": "2025-11-18T10:30:00.000Z",
        "updatedAt": "2025-11-18T11:45:12.345Z",
    }
];

// Universal fetch helper
async function fetcher<T>(url: string, options: RequestInit = {}): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2OWE3NTM5ZGJlYjMzZTJkZDEwYjYwNiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyMTM5OTYxMCwiZXhwIjoxNzI5MTc1NjEwfQ.12v8Gv9sQz2p9rTOpXjY20z2Hqj_y-JpB2mB_r8n2gE'}`,
        ...options.headers,
    };

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

// Fetch real faculties, fallback to mock if failure
export async function getFaculties(): Promise<Faculty[]> {
  // Returning mock data to avoid auth errors during development
  return MOCK_FACULTIES;
  /*
  try {
    const response = await fetcher<{
      success: boolean;
      count: number;
      faculties: Faculty[];
    }>("/admin/faculties");
    return response.faculties;
    
  } catch (error) {
    console.error("Failed to fetch faculties, using mock fallback:", error);
    return MOCK_FACULTIES;
  }
  */
}

type CreateFacultyData = {
    name: string;
    email: string;
    password: string;
    quotaLimit: number;
};

// This function is currently disabled to prevent auth errors.
export async function createFaculty(facultyData: CreateFacultyData): Promise<any> {
    console.log("Simulating faculty creation with mock data:", facultyData);
    // In a real scenario, this would be an API call.
    // Re-enable when auth is fixed.
    return Promise.resolve({
        success: true,
        faculty: {
            _id: `mock-id-${Date.now()}`,
            ...facultyData,
            quotaUsed: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
    })
}
