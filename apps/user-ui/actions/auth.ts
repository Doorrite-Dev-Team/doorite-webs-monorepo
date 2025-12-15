/* eslint-disable @typescript-eslint/no-explicit-any */
// src/actions/auth.ts

// import Axios from "@/libs/Axios";
import { apiClient, authService } from "@/libs/api-client";
// import { ApiResponse } from "@/types";
import { toast } from "@repo/ui/components/sonner";

// payload types
export type SignUpFormData = {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
};

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

/* ========== Auth Actions ========== */

export async function signUpUser(
  payload: SignUpFormData,
): Promise<ApiResponse> {
  try {
    const res = await apiClient.post("/auth/create-user", payload);
    toast.success((res.data as any)?.message ?? "Account created successfully");
    return res.data;
  } catch (err: unknown) {
    console.warn("signUpUser error:", err);
    const message = err as string;
    toast.error(message);
    return { ok: false, message };
  }
}

export async function loginUser(identifier: string, password: string) {
  try {
    // const res = await axios.post(
    //   "/api/auth/log-in",
    //   {
    //     identifier,
    //     password,
    //   },
    //   {
    //     withCredentials: true,
    //   },
    // );
    const res = await authService.login(identifier, password);
    const ok = (res.data as any)?.ok;
    // const message = extractMessageFromResponse(res);
    if (ok) {
      toast.success("successfully Logged In");
    }
    return res.data;
  } catch (err) {
    console.warn("loginUser error:", err);
    const message = err as string;
    // toast.error(message);
    return { ok: false, message };
  }
}

export async function createOtp(email: string): Promise<ApiResponse> {
  try {
    const res = await apiClient.post("/auth/create-otp", { email });
    toast.success((res.data as any)?.message ?? "OTP sent");
    return res.data;
  } catch (err: unknown) {
    console.warn("createOtp error:", err);
    const message = err as string;
    toast.error(message);
    return { ok: false, message };
  }
}

export async function verifyOtp(
  payload: VerifyOtpPayload,
): Promise<ApiResponse> {
  try {
    const res = await apiClient.post("/auth/verify-otp", payload);
    toast.success((res.data as any)?.message ?? "OTP verified successfully");
    return res.data;
  } catch (err: unknown) {
    console.warn("verifyOtp error:", err);
    const message = err as string;
    toast.error(message);
    return { ok: false, message };
  }
}

export async function forgotPassword(email: string): Promise<ApiResponse> {
  try {
    const res = await apiClient.post("/auth/forgot-password", { email });
    toast.success((res.data as any)?.message ?? "Reset OTP sent");
    return res.data;
  } catch (err: unknown) {
    console.warn("forgotPassword error:", err);
    const message = err as string;
    toast.error(message);
    return { ok: false, message };
  }
}

export async function resetPassword(
  payload: ResetPasswordPayload,
): Promise<ApiResponse> {
  try {
    const res = await apiClient.post("/auth/reset-password", payload);
    toast.success((res.data as any)?.message ?? "Password reset successful");
    return res.data;
  } catch (err: unknown) {
    console.warn("resetPassword error:", err);
    const message = err as string;
    toast.error(message);
    return { ok: false, message };
  }
}

// export async function refreshToken(): Promise<ApiResponse> {
//   try {
//     const res = await apiClient.post("/auth/refresh-token");
//     return res.data
//   } catch (err: unknown) {
//     console.warn("refreshToken error:", err);
//     return handleError(err);
//   }
// }

export async function logout(): Promise<ApiResponse> {
  try {
    const res = await authService.logout();
    toast.success("Logged out successfully");
    return res.data;
  } catch (err: unknown) {
    console.warn("logout error:", err);
    const message = err as string;
    toast.error(message);
    return { ok: false, message };
  }
}
