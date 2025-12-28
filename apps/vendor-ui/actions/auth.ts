/* eslint-disable @typescript-eslint/no-explicit-any */
// src/actions/auth.ts

import Axios from "@/libs/api/client";
import { toast } from "@repo/ui/components/sonner";

/* ========== TYPES ========== */

export interface VendorSignUpPayload {
  businessName: string;
  email: string;
  phoneNumber: string;
  password: string;
  address: string;
  categoryIds: string[];
  logoUrl?: string;
}

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

export type Vendor = {
  id?: string;
  _id?: string;
  email: string;
  name?: string;
  role?: string;
  businessName?: string;
};

export type ApiResponse<T = unknown> = {
  ok: boolean;
  message?: string;
  data?: T;
};

/* ========== AUTH ACTIONS ========== */

/**
 * LOGIN: Calls the internal Next.js Route Handler to set HttpOnly cookies
 */
export async function loginUser(
  identifier: string,
  password: string,
): Promise<ApiResponse<Vendor>> {
  try {
    // Note: Calling our local Next.js API route, not the external backend directly
    const res = await Axios.post(
      "/api/auth/login",
      { identifier, password },
      { baseURL: "/" },
    );
    toast.success("Successfully Logged In");

    return res.data;
  } catch (err: any) {
    // Errors are already toasted by the Axios interceptor
    return { ok: false, message: err.message };
  }
}

/**
 * LOGOUT: Calls the internal Next.js Route Handler to clear cookies
 */
export async function logout(): Promise<ApiResponse> {
  try {
    const res = await Axios.post("/api/auth/logout", {}, { baseURL: "/" });
    toast.success("Logged out successfully");
    return res.data;
  } catch (err: any) {
    return { ok: false, message: err.message };
  }
}

/**
 * SIGN UP: Goes through the central Proxy
 */
export async function signUpUser(
  payload: VendorSignUpPayload,
): Promise<ApiResponse> {
  try {
    const res = await Axios.post("/auth/create-vendor", payload);
    toast.success(res.data?.message ?? "Account created successfully");
    return res.data;
  } catch (err: any) {
    return { ok: false, message: err.message };
  }
}

export async function createOtp(email: string): Promise<ApiResponse> {
  try {
    const res = await Axios.post("/auth/create-vendor-otp", { email });
    toast.success(res.data?.message ?? "OTP sent");
    return res.data;
  } catch (err: any) {
    return { ok: false, message: err.message };
  }
}

export async function verifyOtp(
  payload: VerifyOtpPayload,
): Promise<ApiResponse> {
  try {
    const res = await Axios.post("/auth/verify-vendor-otp", payload);
    toast.success(res.data?.message ?? "OTP verified successfully");
    return res.data;
  } catch (err: any) {
    return { ok: false, message: err.message };
  }
}

export async function forgotPassword(email: string): Promise<ApiResponse> {
  try {
    const res = await Axios.post("/auth/forget-vendor-password", { email });
    toast.success(res.data?.message ?? "Reset OTP sent");
    return res.data;
  } catch (err: any) {
    return { ok: false, message: err.message };
  }
}

export async function resetPassword(
  payload: ResetPasswordPayload,
): Promise<ApiResponse> {
  try {
    const res = await Axios.post("/auth/reset-vendor-password", payload);
    toast.success(res.data?.message ?? "Password reset successful");
    return res.data;
  } catch (err: any) {
    return { ok: false, message: err.message };
  }
}
