"use client";
// use-otp-logic.ts

import { createOtp, verifyOtp } from "@/actions/auth";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  OTP_LENGTH,
  INITIAL_COUNTDOWN,
  MAX_RESEND_ATTEMPTS,
  LOCKOUT_DURATION,
  formatTime,
} from "@/libs/utils/otp-helper";
import { Page } from "@/app/(auth)/forgot-password/components/form";

// Define the required props for the logic hook
interface UseOtpLogicProps {
  email?: string;
  phoneNumber?: string;
  verificationType?: "email" | "phone";
  purpose?: "verify" | "reset";
  onVerifySuccess?: () => void;
  // We need to pass the setter function from the parent context
  setToSignUp: Dispatch<SetStateAction<Page>>;
}

// Define the data and actions exposed by the hook
interface UseOtpLogicResult {
  otp: string;
  setOtp: Dispatch<SetStateAction<string>>;
  error: string;
  isVerifying: boolean;
  isResending: boolean;
  countdownDisplay: string;
  resendEnabled: boolean;
  isLockedOut: boolean;
  handleOTPChange: (value: string) => void;
  handleVerifyOTP: () => Promise<boolean>;
  handleResendOTP: () => Promise<boolean>;
  handleBack: () => void;
  target: string | undefined;
}

export const useOtpLogic = ({
  email = "",
  phoneNumber = "",
  verificationType = "email",
  purpose = "verify",
  onVerifySuccess,
  setToSignUp,
}: UseOtpLogicProps): UseOtpLogicResult => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const [countdown, setCountdown] = useState(INITIAL_COUNTDOWN);
  const [resendAttempts, setResendAttempts] = useState(0);

  // --- Countdown Effect ---
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  // --- Handlers ---
  const handleResendOTP = useCallback(async (): Promise<boolean> => {
    // Lockout check first, prevent server call
    if (resendAttempts >= MAX_RESEND_ATTEMPTS) {
      setCountdown(LOCKOUT_DURATION);
      setError(
        `Too many requests. Please try again in ${formatTime(LOCKOUT_DURATION)}.`
      );
      setOtp("");
      return false;
    }

    setIsResending(true);
    setResendAttempts((prev) => prev + 1);
    setCountdown(INITIAL_COUNTDOWN);
    setOtp("");
    setError("");

    try {
      const res = await createOtp(email);

      if (!res?.ok) {
        throw new Error(
          res?.message || "Failed to resend code. Please try again later."
        );
      }

      return true;
    } catch (err) {
      setError(
        (err as Error)?.message ||
          "An unexpected error occurred. Please try again."
      );
      setResendAttempts((prev) => prev - 1); // allow retry
      setCountdown(0);
      return false;
    } finally {
      setIsResending(false);
    }
  }, [email, resendAttempts]);

  const handleVerifyOTP = useCallback(async () => {
    if (otp.length !== OTP_LENGTH) {
      setError(`Please enter a complete ${OTP_LENGTH}-digit code`);
      return false;
    }

    setIsVerifying(true);
    setError("");

    try {
      const res = await verifyOtp({ email, otp, purpose: purpose });

      if (!res?.ok) {
        throw new Error(
          res?.message || "Verification failed. Check your code."
        );
      }

      onVerifySuccess?.();
      return true;
    } catch (err) {
      setError(
        (err as Error)?.message ||
          "An unexpected error occurred during verification."
      );
      return false;
    } finally {
      setIsVerifying(false);
    }
  }, [otp, email, purpose, onVerifySuccess]);

  const handleOTPChange = useCallback(
    (value: string) => {
      setOtp(value);
      if (error) setError("");
    },
    [error]
  );

  const handleBack = useCallback(() => {
    switch (purpose) {
      case "verify":
        setToSignUp("email");
        break;

      default:
        setToSignUp(true);
        break;
    }
  }, [purpose, setToSignUp]);

  // --- Derived State ---
  const isLockedOut = resendAttempts >= MAX_RESEND_ATTEMPTS;
  const resendEnabled = countdown === 0 && !isLockedOut;
  const countdownDisplay = formatTime(countdown);
  const target = verificationType === "email" ? email : phoneNumber;

  return {
    otp,
    setOtp,
    error,
    isVerifying,
    isResending,
    countdownDisplay,
    resendEnabled,
    isLockedOut,
    handleOTPChange,
    handleVerifyOTP,
    handleResendOTP,
    handleBack,
    target,
  };
};
