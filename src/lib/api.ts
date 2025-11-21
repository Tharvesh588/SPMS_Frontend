import { Faculty } from "@/types";

// Updated API URL (your real backend)
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://egspgoi-spms.onrender.com/api/v1";

const MOCK_FACULTIES: Faculty[] = [
    {
        "_id": "691d76555b4fb19d2ca096e0",
        "name": "Dr. John Doe",
        "email": "faculty@example.com",
        "quotaLimit": 10,
        "quotaUsed": 1,
        "createdAt": "2025-11-19T07:48:37.917Z",
        "updatedAt": "2025-11-19T09:21:35.989Z",
    },
    {
        "_id": "691d76555b4fb19d2ca096e1",
        "name": "Dr. Jane Smith",
        "email": "jane.smith@example.com",
        "quotaLimit": 8,
        "quotaUsed": 5,
        "createdAt": "2025-11-18T10:30:00.000Z",
        "updatedAt": "2025-11-18T11:45:12.345Z",
    }
];

// Universal fetch helper
async function fetcher<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("adminToken")
      : null;

  const headers = {
    "Content-Type": "application/json",
    // Temporarily using a placeholder token
    Authorization: token ? `Bearer ${token}` : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2OWE3NTM5ZGJlYjMzZTJkZDEwYjYwNiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyMTM5OTYxMCwiZXhwIjoxNzI5MTc1NjEwfQ.12v8Gv9sQz2p9rTOpXjY20z2Hqj_y-JpB2mB_r8n2gE",
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch from API");
  }

  return await response.json();
}

// Fetch real faculties, fallback to mock if failure
export async function getFaculties(): Promise<Faculty[]> {
  try {
    // const response = await fetcher<{
    //   success: boolean;
    //   count: number;
    //   faculties: Faculty[];
    // }>("/admin/faculties");
    // return response.faculties; // return real data
    
    // Returning mock data to avoid backend dependency during development
    return MOCK_FACULTIES;
  } catch (error) {
    console.error("Failed to fetch faculties, using mock fallback:", error);
    return MOCK_FACULTIES;
  }
}
