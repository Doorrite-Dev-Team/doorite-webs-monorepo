"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import apiClient from "@/libs/api/client";
import { deriveError } from "@/libs/utils/errorHandler";
import { toast } from "@repo/ui/components/sonner";
import { Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@repo/ui/components/sheet";
import { AlertCircle, CheckCircle2 } from "lucide-react";

// Step 1: Email
const stepOneSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type StepOneFormValues = z.infer<typeof stepOneSchema>;

// Step 2: OTP Verification
const stepTwoSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only digits"),
});

type StepTwoFormValues = z.infer<typeof stepTwoSchema>;

// Step 3: New Password
const stepThreeSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^a-zA-Z0-9]/,
        "Password must contain at least one special character",
      ),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type StepThreeFormValues = z.infer<typeof stepThreeSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "otp" | "password" | "success">(
    "email",
  );
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Email Form
  const emailForm = useForm<StepOneFormValues>({
    resolver: zodResolver(stepOneSchema),
    defaultValues: { email: "" },
  });

  // Step 2: OTP Form
  const otpForm = useForm<StepTwoFormValues>({
    resolver: zodResolver(stepTwoSchema),
    defaultValues: { otp: "" },
  });

  // Step 3: Password Form
  const passwordForm = useForm<StepThreeFormValues>({
    resolver: zodResolver(stepThreeSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const handleEmailSubmit = async (data: StepOneFormValues) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post("/vendors/forgot-password", {
        email: data.email,
      });
      if (response.data?.ok) {
        setEmail(data.email);
        setStep("otp");
        toast.success("OTP sent to your email");
      } else {
        throw new Error(response.data?.message || "Failed to send OTP");
      }
    } catch (error) {
      const message =
        deriveError(error) || "Failed to send OTP. Please try again.";
      toast.error("Error", { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (data: StepTwoFormValues) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post("/vendors/verify-otp", {
        email,
        otp: data.otp,
      });
      if (response.data?.ok) {
        setStep("password");
        toast.success("OTP verified successfully");
      } else {
        throw new Error(response.data?.message || "Invalid OTP");
      }
    } catch (error) {
      const message = deriveError(error) || "Invalid OTP. Please try again.";
      toast.error("Error", { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (data: StepThreeFormValues) => {
    setIsLoading(true);
    try {
      const response = await apiClient.put("/vendors/reset-password", {
        email,
        password: data.password,
      });
      if (response.data?.ok) {
        setStep("success");
        toast.success("Password reset successfully");
      } else {
        throw new Error(response.data?.message || "Failed to reset password");
      }
    } catch (error) {
      const message =
        deriveError(error) || "Failed to reset password. Please try again.";
      toast.error("Error", { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = () => {
    router.push("/log-in");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Reset your password
          </h2>
          <p className="text-sm text-gray-600">
            Enter your email to receive a one-time password (OTP) to reset your
            password.
          </p>
        </div>

        {/* Step 1: Email Input */}
        {step === "email" && (
          <form
            onSubmit={emailForm.handleSubmit(handleEmailSubmit)}
            className="space-y-6"
          >
            <div>
              <Label htmlFor="email" className="mb-2">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                {...emailForm.register("email")}
                className="mt-1 block w-full"
              />
              {emailForm.formState.errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {emailForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md shadow-sm bg-green-600 text-white hover:bg-green-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                "Send OTP"
              )}
            </Button>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === "otp" && (
          <form
            onSubmit={otpForm.handleSubmit(handleOtpSubmit)}
            className="space-y-6"
          >
            <div>
              <Label htmlFor="otp" className="mb-2">
                Enter the OTP sent to your email
              </Label>
              <p className="text-sm text-gray-500 mb-2">
                We've sent a 6-digit OTP to{" "}
                <span className="font-medium">{email}</span>
              </p>
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                autoComplete="one-time-code"
                required
                {...otpForm.register("otp")}
                className="mt-1 block w-full"
              />
              {otpForm.formState.errors.otp && (
                <p className="mt-1 text-sm text-red-600">
                  {otpForm.formState.errors.otp.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md shadow-sm bg-green-600 text-white hover:bg-green-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </Button>
          </form>
        )}

        {/* Step 3: New Password */}
        {step === "password" && (
          <form
            onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
            className="space-y-6"
          >
            <div>
              <Label htmlFor="password" className="mb-2">
                New password
              </Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                {...passwordForm.register("password")}
                className="mt-1 block w-full"
              />
              {passwordForm.formState.errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {passwordForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="mb-2">
                Confirm new password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                {...passwordForm.register("confirmPassword")}
                className="mt-1 block w-full"
              />
              {passwordForm.formState.errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {passwordForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md shadow-sm bg-green-600 text-white hover:bg-green-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting password...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        )}

        {/* Success Step */}
        {step === "success" && (
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-gray-900">
              Password reset successful
            </h2>
            <p className="text-sm text-gray-600">
              Your password has been successfully reset. You can now log in with
              your new password.
            </p>

            <Button
              onClick={handleSuccess}
              className="w-full flex items-center justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md shadow-sm bg-green-600 text-white hover:bg-green-700"
            >
              Go to Login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
