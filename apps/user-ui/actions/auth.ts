// src/actions/auth.ts

import axios from "axios";
import { toast } from "@repo/ui/components/sonner";
import { authService } from "@/libs/api-client";
import { extractErrorMessage } from "./_utils";

export type SignUpFormData = {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
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

const baseUrl = process.env.NEXT_PUBLIC_API_URI;

/* ================= SIGN UP ================= */

export async function signUpUser(
  payload: SignUpFormData,
): Promise<ApiResponse> {
  try {
    const res = await axios.post(`${baseUrl}/auth/create-user`, payload);
    toast.success(res.data?.message ?? "Account created successfully");
    return res.data;
  } catch (err) {
    console.warn(err);
    const message = extractErrorMessage(err);
    toast.error(message);
    return { ok: false, message };
  }
}

/* ================= OTP ================= */

export async function createOtp(email: string): Promise<ApiResponse> {
  try {
    const res = await axios.post(`${baseUrl}/auth/create-otp`, { email });
    toast.success(res.data?.message ?? "OTP sent");
    return res.data;
  } catch (err) {
    const message = extractErrorMessage(err);
    toast.error(message);
    return { ok: false, message };
  }
}

export async function verifyOtp(
  payload: VerifyOtpPayload,
): Promise<ApiResponse> {
  try {
    const res = await axios.post(`${baseUrl}/auth/verify-otp`, payload);
    toast.success(res.data?.message ?? "OTP verified successfully");
    return res.data;
  } catch (err) {
    const message = extractErrorMessage(err);
    toast.error(message);
    return { ok: false, message };
  }
}

/* ================= PASSWORD ================= */

export async function forgotPassword(email: string): Promise<ApiResponse> {
  try {
    const res = await axios.post(`${baseUrl}/auth/forgot-password`, { email });
    toast.success(res.data?.message ?? "Reset OTP sent");
    return res.data;
  } catch (err) {
    const message = extractErrorMessage(err);
    toast.error(message);
    return { ok: false, message };
  }
}

export async function resetPassword(
  payload: ResetPasswordPayload,
): Promise<ApiResponse> {
  try {
    const res = await axios.post(`${baseUrl}/auth/reset-password`, payload);
    toast.success(res.data?.message ?? "Password reset successful");
    return res.data;
  } catch (err) {
    const message = extractErrorMessage(err);
    toast.error(message);
    return { ok: false, message };
  }
}

/* ================= LOGOUT ================= */

export async function logout(): Promise<ApiResponse> {
  try {
    const res = await authService.logout();
    toast.success("Logged out successfully");
    return res.data;
  } catch (err) {
    const message = extractErrorMessage(err);
    toast.error(message);
    return { ok: false, message };
  }
}
