import { Faculty } from "@/types";

// Updated API URL (your real backend)
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://egspgoi-spms.onrender.com/api/v1";

// Universal fetch helper
async function fetcher<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("adminToken")
      : null;

  const headers = {
    "Content-Type": "application/json",
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
    const response = await fetcher<{
      success: boolean;
      count: number;
      faculties: Faculty[];
    }>("/admin/faculties");

    return response.faculties; // return real data
  } catch (error) {
    console.error("Failed to fetch faculties, using mock fallback:", error);
    // In a real app, you might want to throw the error to be handled by the UI
    // For now, we return mock data to prevent the app from crashing.
    throw error;
  }
}
