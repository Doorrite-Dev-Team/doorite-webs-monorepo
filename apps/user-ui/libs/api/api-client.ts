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
 * - Token management via interceptors
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

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    // The token is handled via cookies by the proxy, so we don't need to manually add it
    // But we can add it here if needed for direct API calls
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
apiClient.interceptors.response.use(
  (res) => {
    return res.data.data ? res.data : res;
  },
  async (err) => {
    // Handle 401 errors (token expired)
    if (err.response?.status === 401) {
      // Try to refresh token
      try {
        const originalRequest = err.config;
        // Prevent infinite loops
        if (!originalRequest._retry) {
          originalRequest._retry = true;

          // Attempt to refresh token
          await authService.refresh();

          // Retry the original request
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, redirect to login
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return handleApiError(err);
  },
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
      try {
        await authService.refresh();
        // If refresh succeeds, we retry the original request
        // The interceptor will retry it automatically
        throw error; // Re-throw to trigger retry
      } catch (refreshError) {
        // If refresh fails, redirect to login
        console.log("Refresh failed, redirecting to login");
        if (typeof window !== "undefined") window.location.href = "/login";
        const axiosRefreshError = refreshError as AxiosError<{
          message?: string;
        }>;
        return (
          axiosRefreshError.response?.data?.message ||
          axiosRefreshError.message ||
          "Session expired. Please log in again."
        );
      }
    }

    return (
      axiosError.response?.data?.message ||
      axiosError.message ||
      "An error occurred"
    );
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
      `${process.env.NEXT_PUBLIC_VERCEL_URL ?? "http://localhost:3000"}/api/v1/auth/refresh-user-token`,
    );
    return response.data;
  },
};
