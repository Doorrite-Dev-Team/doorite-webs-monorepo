/* eslint-disable @typescript-eslint/no-explicit-any */
// src/actions/auth.ts
"use server";

import Axios from "@/libs/Axios";
import { toast } from "@repo/ui/components/sonner";
import axios, { AxiosError, AxiosResponse } from "axios";

// Generic API response shape used by client actions
export type ApiResponse<T = unknown> = {
  ok: boolean;
  message: string;
  data?: T;
};

// payload types
export type SignUpFormData = {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
};

export type LoginPayload = {
  identifier: string; // email | phone
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

/**
 * Safe extractor that supports server currently returning either
 * { message } or { error } on failure. Returns undefined if nothing.
 */
function getMessageFromPayload(payload: unknown): string | undefined {
  if (!payload || typeof payload !== "object") return undefined;
  const r = payload as Record<string, unknown>;
  if (typeof r.message === "string") return r.message;
  if (typeof r.error === "string") return r.error;
  if (typeof r.msg === "string") return r.msg;
  return undefined;
}

/** Normalize success responses from AxiosResponse */
function handleSuccess<T = unknown>(
  res: AxiosResponse<unknown>
): ApiResponse<T> {
  const payload = res.data as unknown;
  const maybeMessage = getMessageFromPayload(payload);
  // try to detect ok flag (server should include it)
  const okFlag =
    (payload && typeof payload === "object" && (payload as any).ok) === true;
  // prefer server-provided data field, otherwise payload
  const data =
    (payload && typeof payload === "object" && (payload as any).data) ??
    payload;

   if (Boolean(okFlag) && maybeMessage) {
     toast.success((res.data as any).message);
   }
  return {
    ok: Boolean(okFlag),
    message: maybeMessage ?? (okFlag ? "Success" : "Request failed"),
    data: data as T,
  };
}

/** Normalize errors caught from Axios (or thrown) */
function handleError(err: unknown): ApiResponse {
  // AxiosError path
  if (axios.isAxiosError(err)) {
    const axiosErr = err as AxiosError;
    const payload = axiosErr.response?.data;
    const message =
      getMessageFromPayload(payload) ?? axiosErr.message ?? "Request failed";
    return { ok: false, message };
  }

  // Plain Error
  if (err instanceof Error) {
    return { ok: false, message: err.message };
  }

  // Unknown
  return { ok: false, message: "An unexpected error occurred" };
}

/* ========== Auth actions ========== */

/** Create (register) user */
export async function signUpUser(
  payload: SignUpFormData
): Promise<ApiResponse> {
  try {
    const res = await Axios.post("/auth/create-user", payload);
    return handleSuccess(res);
  } catch (err: unknown) {
    console.error("signUpUser error:", err);
    return handleError(err);
  }
}

/** Login user (identifier: email | phone) */
export async function loginUser(
  identifier: string,
  password: string
): Promise<ApiResponse> {
  try {
    const res = await Axios.post("/auth/login", { identifier, password });
    return handleSuccess(res);
  } catch (err: unknown) {
    console.error("loginUser error:", err);
    return handleError(err);
  }
}

/** Create (send) OTP to email */
export async function createOtp(email: string): Promise<ApiResponse> {
  try {
    const res = await Axios.post("/auth/create-otp", { email });
    return handleSuccess(res);
  } catch (err: unknown) {
    console.error("createOtp error:", err);
    return handleError(err);
  }
}

/** Verify OTP (purpose: "verify" or "reset") */
export async function verifyOtp(
  payload: VerifyOtpPayload
): Promise<ApiResponse> {
  try {
    const res = await Axios.post("/auth/verify-otp", payload);
    return handleSuccess(res);
  } catch (err: unknown) {
    console.error("verifyOtp error:", err);
    return handleError(err);
  }
}

/** Send forgot-password OTP */
export async function forgotPassword(email: string): Promise<ApiResponse> {
  try {
    const res = await Axios.post("/auth/forgot-password", { email });
    return handleSuccess(res);
  } catch (err: unknown) {
    console.error("forgotPassword error:", err);
    return handleError(err);
  }
}

/** Reset password using previously-verified reset flow */
export async function resetPassword(
  payload: ResetPasswordPayload
): Promise<ApiResponse> {
  try {
    const res = await Axios.post("/auth/reset-password", payload);
    return handleSuccess(res);
  } catch (err: unknown) {
    console.error("resetPassword error:", err);
    return handleError(err);
  }
}

/** Refresh token (server will set cookies) */
export async function refreshToken(): Promise<ApiResponse> {
  try {
    const res = await Axios.post("/auth/refresh-token");
    return handleSuccess(res);
  } catch (err: unknown) {
    console.error("refreshToken error:", err);
    return handleError(err);
  }
}

/** Logout (clears cookies server-side) */
export async function logout(): Promise<ApiResponse> {
  try {
    const res = await Axios.post("/auth/logout");
    return handleSuccess(res);
  } catch (err: unknown) {
    console.error("logout error:", err);
    return handleError(err);
  }
}
