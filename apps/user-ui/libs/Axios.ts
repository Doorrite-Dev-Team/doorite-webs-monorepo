/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "@repo/ui/components/sonner";
import axios, { AxiosError, AxiosResponse } from "axios";
// import { tokenManager, isTokenExpired } from "./utils/token-manager";

// interface QueueItem {
//   resolve: (value?: any) => void;
//   reject: (reason?: unknown) => void;
// }

// 2. Create Instance
const Axios = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URI ??
    "https://doorrite-api.onrender.com/api/v1/",
  withCredentials: true,
  timeout: 5 * 60 * 1000,
});

// 3. Helpers
function extractMessage(res?: AxiosResponse<unknown>): string | undefined {
  if (!res?.data || typeof res.data !== "object") return undefined;
  const rec = res.data as Record<string, unknown>;
  return (rec.message || rec.error || rec.msg) as string | undefined;
}

const rejectWithError = (
  data: Omit<ClientError, "isClientError">
): Promise<never> => {
  const message = data.message || "Something went wrong";
  toast.error(message);
  return Promise.reject({ ...data, message, isClientError: true });
};

// --- RESPONSE INTERCEPTOR ---
Axios.interceptors.response.use(
  (res) => {
    // Manually reject if business logic says ok: false (status 200)
    if ((res.data as any)?.ok === false) {
      const message = extractMessage(res) ?? "Operation failed";
      return Promise.reject({
        response: res,
        message,
        isAxiosError: true, // Mimic AxiosError for the error handler
      });
    }

    // Success Toast
    const message = extractMessage(res);
    if (message) toast.success(message);

    return res;
  },
  async (err: unknown): Promise<any> => {
    if (axios.isAxiosError(err)) {
      const e = err as AxiosError;
      const status = e.response?.status;
      const details = (e.response?.data as any)?.details;

      // Get message from server response, then fallback to error message
      const serverMsg = extractMessage(e.response);
      const message = serverMsg ?? e.message ?? "Request failed";

      if (status === 403 || status === 405) {
        return rejectWithError({
          status,
          message: message || "Action not allowed.",
          details,
        });
      }
      if (status === 503) {
        return rejectWithError({ status, message: "Service unavailable." });
      }
      if (e.code === "ERR_NETWORK") {
        return rejectWithError({
          message: "No response from server. Check connection.",
        });
      }

      return rejectWithError({ status, message, details });
    }

    return rejectWithError({
      message: (err as Error)?.message ?? "Unexpected error",
    });
  }
);

// --- REQUEST INTERCEPTOR (Refresh Token Logic) ---
// let isRefreshing = false;
// let failedQueue: QueueItem[] = [];

// const processQueue = (error: any, token: string | null = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) prom.reject(error);
//     else prom.resolve(token);
//   });
//   failedQueue = [];
// };

// Axios.interceptors.request.use(
//   async (config) => {
//     const token = tokenManager.getAccess();

//     // 1. If no token or token is valid, proceed normally
//     if (!token || !isTokenExpired()) {
//       if (token) config.headers.Authorization = `Bearer ${token}`;
//       return config;
//     }

//     // 2. Handle Expired Token
//     if (isRefreshing) {
//       return new Promise<void>((resolve, reject) => {
//         failedQueue.push({ resolve, reject });
//       })
//         .then((newToken) => {
//           config.headers.Authorization = `Bearer ${newToken}`;
//           return config;
//         })
//         .catch((err) => Promise.reject(err));
//     }

//     isRefreshing = true;

//     try {
//       //  Use standard axios (not Axios instance) to avoid infinite loops
//       const response = await axios.post(
//         `${Axios.defaults.baseURL}refresh-token`,
//         {},
//         { withCredentials: true }
//       );

//       const newToken = response.data?.accessToken;

//       if (!newToken) throw new Error("Failed to refresh token");

//       tokenManager.setAccess(newToken);
//       processQueue(null, newToken);

//       config.headers.Authorization = `Bearer ${newToken}`;
//       return config;
//     } catch (error) {
//       processQueue(error, null);
//       tokenManager.clear();
//       window.location.href = "/login";
//       return Promise.reject(error);
//     } finally {
//       isRefreshing = false;
//     }
//   },
//   (error) => Promise.reject(error)
// );

export default Axios;
