/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/axios.ts
import { toast } from "@repo/ui/components/sonner";
import axios, { AxiosError, AxiosResponse } from "axios";

const Axios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URI
    ? `${process.env.NEXT_PUBLIC_API_URI}/api/v1`
    : "http://localhost:4000/api/v1",
  withCredentials: true,
  timeout: 5 * 60 * 1000,
});

/**
 * Helper to extract a message from various server payload shapes.
 * Server may return { message } OR { error } — handle both.
 */
function extractMessageFromResponse(res?: AxiosResponse<unknown>) {
  if (!res) return undefined;
  const payload = res.data as unknown;
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    // prefer message, fallback to error
    if (typeof record.message === "string") return record.message;
    if (typeof record.error === "string") return record.error;
    if (typeof record.msg === "string") return record.msg;
  }
  return undefined;
}

/**
 * Success interceptor:
 * - show toast when server returns { ok: true, message: "..." }
 * - tolerant to `message` OR `error` fields
 */
Axios.interceptors.response.use(
  (res) => {
    // show toast only for explicit server-provided success messages
    try {
      const ok = (res.data as any)?.ok; // just to detect the flag — transient cast only
      const message = extractMessageFromResponse(res);
      if (ok && message) {
        toast.success(message);
      }
    } catch {
      // swallow issues in the interceptor
    }
    return res;
  },
  (err: unknown) => {
    // Normalize errors into { status?, message, details? } and reject
    if (axios.isAxiosError(err)) {
      const axiosErr = err as AxiosError;
      const status = axiosErr.response?.status;
      const message =
        // prefer server payload message/error
        (axiosErr.response && extractMessageFromResponse(axiosErr.response)) ??
        // fallback to axios error message
        axiosErr.message ??
        "Request failed";

      const details = (axiosErr.response?.data as any)?.details;

      // Special-case read-only / maintenance / forbidden statuses to make UX clearer
      if (status === 405 || status === 403) {
        return Promise.reject({
          status,
          message: message || "Action not allowed (read-only).",
          details,
        });
      }
      if (status === 503) {
        return Promise.reject({
          status,
          message: message || "Service unavailable. Please try again later.",
          details,
        });
      }

      if (axiosErr.request && !axiosErr.response) {
        return Promise.reject({
          message: "No response from server. Check your connection.",
        });
      }

      return Promise.reject({ status, message, details });
    }

    // non-Axios unknown error
    return Promise.reject({
      message: (err as Error)?.message ?? "Unexpected error",
    });
  }
);

export default Axios;
