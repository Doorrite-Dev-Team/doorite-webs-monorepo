"use client"; // Safe for Client Components

import { toast } from "@repo/ui/components/sonner";
import axios from "axios";

// 💡 TIP: Point this to your internal Proxy (/api/proxy) to handle HttpOnly cookies automatically
const BASE_URL = "/api/proxy";

const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 5 * 60 * 1000,
});

apiClient.interceptors.response.use(
  (res) => (res.data?.data ? res.data : res),
  (err: unknown) => {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const message = err.response?.data?.message || err.message;
      const details = err.response?.data?.details;

      // 1. Handle Session Expiry
      if (status === 401) {
        // Prevent infinite loops if already on login
        if (
          typeof window !== "undefined" &&
          !window.location.pathname.includes("/log-in")
        ) {
          toast.error("Session expired. Please log in again.");
          window.location.href = "/log-in";
        }
        return Promise.reject(err);
      }

      // 2. Handle Permissions
      if (status === 403 || status === 405) {
        toast.error(message || "Action not allowed.");
        return Promise.reject({ status, message, details });
      }

      // 3. Generic Errors
      toast.error(message || "Something went wrong");
      return Promise.reject({ status, message, details });
    }

    return Promise.reject(err);
  },
);

export default apiClient;
