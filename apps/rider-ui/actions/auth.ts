// actions/auth.ts
import axios from "axios";
import { toast } from "@repo/ui/components/sonner";
import { authService } from "@/libs/api-client";

// Utils
export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unknown error occurred";
}

export type ApiResponse = {
  ok: boolean;
  message?: string;
  data?: any;
};

export type SignUpFormData = {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  vehicleType: string;
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

const baseUrl = process.env.NEXT_PUBLIC_API_URI || "https://doorrite-api.onrender.com/api/v1";

/* ================= SIGN UP ================= */

export async function signUpRider(
  payload: SignUpFormData,
): Promise<ApiResponse> {
  try {
    const res = await axios.post(`${baseUrl}/auth/create-rider`, payload);
    toast.success(res.data?.message ?? "Rider account created successfully");
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
    const res = await axios.post(`${baseUrl}/auth/create-rider-otp`, { email });
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
    const res = await axios.post(`${baseUrl}/auth/verify-rider-otp`, payload);
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
    const res = await axios.post(`${baseUrl}/auth/forgot-rider-password`, { email });
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
    const res = await axios.post(`${baseUrl}/auth/reset-rider-password`, payload);
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
