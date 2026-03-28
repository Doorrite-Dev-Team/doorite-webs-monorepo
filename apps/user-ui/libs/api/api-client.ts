// ============================================================================
// CLIENT API WRAPPER (SIMPLIFIED)
// ============================================================================

// lib/api-client.ts
import axios, { AxiosError } from "axios";

const getApiBaseUrl = () => {
  // Check if we are running in the browser (client-side)
  if (typeof window !== "undefined") {
    // Use the relative path for client-side requests (works automatically)
    return "/api/proxy";
  }

  // Server-Side (Node.js) execution
  // You MUST provide the full origin (scheme + host) of your Next.js application.
  // NEXT_PUBLIC_VERCEL_URL is common in Vercel. Use your preferred ENV var.
  const VERCEL_URL = process.env.NEXT_PUBLIC_VERCEL_URL;

  if (VERCEL_URL) {
    // Production/Deployment URL
    return `https://${VERCEL_URL}/api/proxy`;
  }

  // Fallback for local development
  // Ensure this matches where your Next.js app is running
  return `http://localhost:3000/api/proxy`;
};

/**
 * Pre-configured Axios instance
 * - No token management
 * - No interceptors
 * - Cookies handled automatically via proxy
 */
export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookie propagation
});

// apiClient.interceptors.request.use(async (config) => {
//   if (typeof window === "undefined") {
//     const { getCookieHeader } = await import("@/libs/api-utils");
//     const token = await getCookieHeader(true);
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//   }
//   return config;
// });

apiClient.interceptors.response.use(
  (res) => {
    return res.data.data ? res.data : res;
  },
  (err) => handleApiError(err),
);

/**
 * Type-safe API error handler
 */
export async function handleApiError(error: unknown) {
  console.log("Error Occured");
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;

    // Handle session expiration
    if (axiosError.response?.status === 401) {
      console.log("Performing Refresh......");
      // await authService.refresh();
      if (typeof window !== "undefined") window.location.href = "/login";
      // return "Session expired. Please log in again.";
      // return error;
    }

    return (
      axiosError.response?.data?.message ||
      axiosError.message ||
      "An error occurred"
    );
    // return error;
  }

  // return "An unexpected error occurred";
  return error;
}

// ============================================================================
// AUTH SERVICE (CLIENT-SIDE)
// ============================================================================

export const authService = {
  async login(email: string, password: string) {
    const response = await axios.post(
      "/api/auth/log-in",
      {
        identifier: email,
        password,
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  },

  async logout() {
    const response = await axios.post(
      "/api/auth/logout",
      {},
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  },

  async refresh() {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_VERCEL_URL ?? "http://localhost:3000"}/api/auth/refresh-token`,
    );
    return response.data;
  },
};
