import { Faculty } from "@/types";

// Updated API URL (your real backend)
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://egspgoi-spms.onrender.com/api/v1";

// Mock data as fallback only
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
  },
];

// Universal fetch helper
async function fetcher<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("adminToken")
      : null;

  const headers = {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
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
      data: Faculty[];
    }>("/admin/faculties");

    return response.data; // return real data
  } catch (error) {
    console.error("Failed to fetch faculties, using mock fallback:", error);
    // In a real app, you might want to throw the error to be handled by the UI
    // For now, we return mock data to prevent the app from crashing.
    throw error;
  }
}
