// src/components/signup/StepThree.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@repo/ui/components/input-otp";
import { Button } from "@repo/ui/components/button";
import { Mail, RotateCcw } from "lucide-react";
import { toast } from "@repo/ui/components/sonner";
import axios, { isAxiosError } from "axios";
// import apiClient from "@/libs/api/client";

const OTP_LENGTH = 6;
const INITIAL_COUNTDOWN = 60;
const MAX_RESEND_ATTEMPTS = 3;
const LOCKOUT_DURATION = 10 * 60;

const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes > 0) {
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${seconds}s`;
};

interface StepThreeProps {
  email: string;
  onVerifySuccess: () => void;
  onResendOTP: () => Promise<boolean>;
}

export const StepThree = ({
  email,
  onVerifySuccess,
  onResendOTP,
}: StepThreeProps) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(INITIAL_COUNTDOWN);
  const [resendAttempts, setResendAttempts] = useState(0);
  const baseUrl = process.env.NEXT_PUBLIC_API_URI;

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  const handleOTPChange = useCallback(
    (value: string) => {
      setOtp(value);
      if (error) setError("");
    },
    [error],
  );

  const handleVerifyOTP = async () => {
    if (otp.length !== OTP_LENGTH) {
      setError(`Please enter a complete ${OTP_LENGTH}-digit code`);
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      // Call your API to verify OTP
      const response = await axios.post(`${baseUrl}/auth/verify-vendor-otp`, {
        email,
        otp,
        purpose: "verify",
      });

      const data = response.data;

      if (!data.ok) {
        setError(data.message || "Invalid verification code");
        return;
      }

      toast.success("Email verified successfully!");
      onVerifySuccess();
    } catch (err) {
      let message;
      if (isAxiosError(err)) {
        message = err.response?.data.error || err.message || "Unknown error";
      } else if (err instanceof Error) {
        message = err.message;
      }
      message = message || err;
      console.error("Account creation failed", err);
      toast.error("Account creation failed", {
        description: message,
      });
      setError(message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);

    const newAttemptCount = resendAttempts + 1;
    setResendAttempts(newAttemptCount);

    if (newAttemptCount > MAX_RESEND_ATTEMPTS) {
      setCountdown(LOCKOUT_DURATION);
      setError(
        `Too many requests. Please try again in ${formatTime(LOCKOUT_DURATION)}.`,
      );
      setOtp("");
      setIsResending(false);
      return;
    }

    setCountdown(INITIAL_COUNTDOWN);
    setOtp("");

    const success = await onResendOTP();
    if (success) {
      toast.success("Verification code resent!");
    } else {
      setError("Failed to resend code. Please try again.");
    }

    setIsResending(false);
  };

  const isLockedOut = resendAttempts >= MAX_RESEND_ATTEMPTS;
  const resendEnabled = countdown === 0 && !isLockedOut;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center mb-4">
          <Mail className="w-16 h-16 text-primary bg-primary/10 p-4 rounded-full" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            Verify Your Email
          </h3>
          <p className="text-sm text-gray-600 mt-2">
            We&apos;ve sent a {OTP_LENGTH}-digit verification code to
          </p>
          <p className="text-sm font-medium text-gray-900 mt-1">{email}</p>
        </div>
      </div>

      {/* OTP Input */}
      <div className="flex flex-col items-center justify-center space-y-4">
        <InputOTP maxLength={OTP_LENGTH} value={otp} onChange={handleOTPChange}>
          <InputOTPGroup>
            <InputOTPSlot index={0} className="w-12 h-12 text-lg" />
            <InputOTPSlot index={1} className="w-12 h-12 text-lg" />
            <InputOTPSlot index={2} className="w-12 h-12 text-lg" />
            <InputOTPSlot index={3} className="w-12 h-12 text-lg" />
            <InputOTPSlot index={4} className="w-12 h-12 text-lg" />
            <InputOTPSlot index={5} className="w-12 h-12 text-lg" />
          </InputOTPGroup>
        </InputOTP>

        {error && (
          <p className="text-sm text-red-500 text-center font-medium">
            {error}
          </p>
        )}
      </div>

      {/* Verify Button */}
      <Button
        onClick={handleVerifyOTP}
        disabled={otp.length !== OTP_LENGTH || isVerifying}
        size="lg"
        className="w-full"
      >
        {isVerifying ? "Verifying..." : "Verify Email"}
      </Button>

      {/* Resend Section */}
      <div className="text-center space-y-3">
        <p className="text-sm text-gray-600">Didn&apos;t receive the code?</p>

        {resendEnabled ? (
          <Button
            type="button"
            variant="ghost"
            onClick={handleResend}
            disabled={isResending}
            className="text-primary hover:text-primary/80"
          >
            {isResending ? (
              <>
                <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <RotateCcw className="w-4 h-4 mr-2" />
                Resend Code
              </>
            )}
          </Button>
        ) : (
          <p className="text-sm text-gray-600">
            {isLockedOut ? (
              "Try again later"
            ) : (
              <>
                Resend code in{" "}
                <span className="font-medium text-primary">
                  {formatTime(countdown)}
                </span>
              </>
            )}
          </p>
        )}
      </div>
    </div>
  );
};
