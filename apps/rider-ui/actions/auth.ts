/* eslint-disable @typescript-eslint/no-explicit-any */
// src/actions/auth.ts

import Axios, { extractMessageFromResponse } from "@/libs/Axios";
import { toast } from "@repo/ui/components/sonner";
import axios, { AxiosResponse } from "axios";

// Generic API response shape
export type ApiResponse<T = unknown> = {
  ok: boolean;
  message: string;
  data?: T;
};

// ✅ Correct vendor sign-up payload type
export interface RiderSignUpPayload {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  vehicleType: string;
  profileImageUrl?: string;
}

// Other payloads
export type LoginPayload = {
  identifier: string;
  password: string;
};

export type VerifyOtpPayload = {
  email: string;
  otp: string;
  purpose?: "reset" | "verify";
};

export type ResetPasswordPayload = {
  email: string;
  password: string;
  confirmPassword: string;
};

// Helpers
function getMessageFromPayload(payload: unknown): string | undefined {
  if (!payload || typeof payload !== "object") return undefined;
  const r = payload as Record<string, unknown>;
  if (typeof r.message === "string") return r.message;
  if (typeof r.error === "string") return r.error;
  if (typeof r.msg === "string") return r.msg;
  return undefined;
}

function handleSuccess<T = unknown>(
  res: AxiosResponse<unknown>
): ApiResponse<T> {
  const payload = res.data as any;
  const okFlag = payload?.ok ?? true;
  const message = getMessageFromPayload(payload) ?? "Success";
  const data = payload?.data ?? payload;

  return { ok: Boolean(okFlag), message, data };
}

function handleError(err: unknown): ApiResponse {
  if (axios.isAxiosError(err)) {
    const payload = err.response?.data;
    const message =
      getMessageFromPayload(payload) ?? err.message ?? "Request failed";
    return { ok: false, message };
  }
  if (err instanceof Error) return { ok: false, message: err.message };
  return { ok: false, message: "An unexpected error occurred" };
}

/* ========== AUTH ACTIONS ========== */

// ✅ Updated signUpUser for vendor creation
export async function signUpUser(
  payload: RiderSignUpPayload
): Promise<ApiResponse> {
  try {
    const res = await Axios.post("/auth/create-rider", payload);
    toast.success((res.data as any)?.message ?? "Account created successfully");
    return handleSuccess(res);
  } catch (err) {
    const message = handleError(err).message;
    toast.error(message);
    return { ok: false, message };
  }
}
// Other auth actions remain the same ↓

export async function loginUser(email: string, password: string) {
  try {
    const res = await Axios.post(
      "/auth/login-rider",
      { email, password },
      { withCredentials: true }
    );

    const ok = (res.data as any)?.ok;
    const message = extractMessageFromResponse(res);

    if (ok && message) toast.success("Successfully Logged In: " + message);
    return handleSuccess(res);
  } catch (err) {
    console.error("loginUser error:", err);
    const message = handleError(err).message;
    toast.error(message);
    return { ok: false, message };
  }
}

export async function createOtp(email: string): Promise<ApiResponse> {
  try {
    const res = await Axios.post("/auth/create-rider-otp", { email });
    toast.success((res.data as any)?.message ?? "OTP sent");
    return handleSuccess(res);
  } catch (err: unknown) {
    console.error("createOtp error:", err);
    const message = handleError(err).message;
    toast.error(message);
    return { ok: false, message };
  }
}

export async function verifyOtp(
  payload: VerifyOtpPayload
): Promise<ApiResponse> {
  try {
    const res = await Axios.post("/auth/verify-rider-otp", payload);
    toast.success((res.data as any)?.message ?? "OTP verified successfully");
    return handleSuccess(res);
  } catch (err: unknown) {
    console.error("verifyOtp error:", err);
    const message = handleError(err).message;
    toast.error(message);
    return { ok: false, message };
  }
}

export async function forgotPassword(email: string): Promise<ApiResponse> {
  try {
    const res = await Axios.post("/auth/forget-rider-password", { email });
    toast.success((res.data as any)?.message ?? "Reset OTP sent");
    return handleSuccess(res);
  } catch (err: unknown) {
    console.error("forgotPassword error:", err);
    const message = handleError(err).message;
    toast.error(message);
    return { ok: false, message };
  }
}

export async function resetPassword(
  payload: ResetPasswordPayload
): Promise<ApiResponse> {
  try {
    const res = await Axios.post("/auth/reset-rider-password", payload);
    toast.success((res.data as any)?.message ?? "Password reset successful");
    return handleSuccess(res);
  } catch (err: unknown) {
    console.error("resetPassword error:", err);
    const message = handleError(err).message;
    toast.error(message);
    return { ok: false, message };
  }
}

export async function refreshToken(): Promise<ApiResponse> {
  try {
    const res = await Axios.post("/auth/refresh-rider-token");
    return handleSuccess(res);
  } catch (err: unknown) {
    console.error("refreshToken error:", err);
    return handleError(err);
  }
}

export async function logout(): Promise<ApiResponse> {
  try {
    const res = await Axios.post("/auth/logout-rider");
    toast.success("Logged out successfully");
    return handleSuccess(res);
  } catch (err: unknown) {
    console.error("logout error:", err);
    const message = handleError(err).message;
    toast.error(message);
    return { ok: false, message };
  }
}
