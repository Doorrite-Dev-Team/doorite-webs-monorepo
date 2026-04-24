// libs/api-client.ts
import axios, { AxiosError } from "axios";

const getApiBaseUrl = () => {
  // Check if we are running in the browser (client-side)
  if (typeof window !== "undefined") {
    // Use the relative path for client-side requests (works automatically)
    return "/api/proxy";
  }

  const VERCEL_URL = process.env.NEXT_PUBLIC_VERCEL_URL;

  if (VERCEL_URL) {
    return `https://${VERCEL_URL}/api/proxy`;
  }

  // Fallback for local development / SSR
  const port = process.env.PORT || "3000";
  return `http://localhost:${port}/api/proxy`;
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
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;

    // Handle session expiration
    if (axiosError.response?.status === 401) {
      if (typeof window !== "undefined") window.location.href = "/login";
    }
  }

  return Promise.reject(error);
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
    const response = await axios.post("/api/auth/refresh-token");
    return response.data;
  },
};

// ============================================================================
// CHAT API
// ============================================================================

export interface ChatMessage {
  id: string;
  content: string;
  senderType: "customer" | "rider" | "vendor";
  senderId: string;
  createdAt: string;
}

interface MessagesResponse {
  messages?: ChatMessage[];
}

export const chatApi = {
  async fetchMessages(orderId: string, limit = 50): Promise<ChatMessage[]> {
    try {
      const res = (await apiClient.get(
        `/orders/${orderId}/messages?limit=${limit}`,
      )) as MessagesResponse;
      return res.messages || [];
    } catch {
      return [];
    }
  },
};
