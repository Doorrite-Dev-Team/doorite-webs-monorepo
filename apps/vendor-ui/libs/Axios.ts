/* eslint-disable @typescript-eslint/no-explicit-any */
// libs/Axios.ts
import { toast } from "@repo/ui/components/sonner";
import axios, { AxiosError, AxiosResponse } from "axios";

/**
 * Axios instance configuration
 * Uses Doorrite API in production, falls back to localhost in development.
 */
const Axios = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URI ??
    "https://doorrite-api.onrender.com/api/v1/",
  withCredentials: true,
  timeout: 5 * 60 * 1000, // 5 minutes
});

/**
 * Helper to extract readable message from server response.
 * Handles multiple possible response formats gracefully.
 */
export function extractMessageFromResponse(res?: AxiosResponse<unknown>) {
  if (!res) return undefined;
  const payload = res.data as unknown;
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    if (typeof record.message === "string") return record.message;
    if (typeof record.error === "string") return record.error;
    if (typeof record.msg === "string") return record.msg;
  }
  return undefined;
}

/**
 * ✅ Response interceptor
 * - Displays success toasts for responses with { ok: true, message: "..." }
 * - Handles error states and normalizes error messages for easy debugging
 */
Axios.interceptors.response.use(
  (res) => {
    try {
      const ok = (res.data as any)?.ok;
      const message = extractMessageFromResponse(res);
      if (ok && message) {
        toast.success(message);
      }
    } catch {
      // Do nothing if toast fails
    }
    return res;
  },
  (err: unknown) => {
    if (axios.isAxiosError(err)) {
      const axiosErr = err as AxiosError;
      const status = axiosErr.response?.status;
      const message =
        (axiosErr.response && extractMessageFromResponse(axiosErr.response)) ??
        axiosErr.message ??
        "Request failed";
      const details = (axiosErr.response?.data as any)?.details;

      // 🔒 Special error handling for clarity
      if (status === 405 || status === 403) {
        toast.error(message || "Action not allowed (read-only).");
        return Promise.reject({
          status,
          message: message || "Action not allowed (read-only).",
          details,
        });
      }

      if (status === 503) {
        toast.error("Service unavailable. Please try again later.");
        return Promise.reject({
          status,
          message: "Service unavailable. Please try again later.",
          details,
        });
      }

      if (axiosErr.request && !axiosErr.response) {
        toast.error("No response from server. Check your connection.");
        return Promise.reject({
          message: "No response from server. Check your connection.",
        });
      }

      // Default error toast
      toast.error(message || "Something went wrong");
      return Promise.reject({ status, message, details });
    }

    // Fallback for non-Axios errors
    toast.error((err as Error)?.message ?? "Unexpected error");
    return Promise.reject({
      message: (err as Error)?.message ?? "Unexpected error",
    });
  }
);

export default Axios;
