"use client";

import { createOtp, verifyOtp } from "@/actions/auth";
import { logoFull } from "@repo/ui/assets";
import { Button } from "@repo/ui/components/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@repo/ui/components/input-otp";
import { ArrowLeft, Mail, MessageSquare, RotateCcw } from "lucide-react";
import Image from "next/image";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Page } from "../app/(auth)/forgot-password/page";

// --- Configuration Constants ---
// Best practice: Define configurable constants at the top for easy maintenance.
const OTP_LENGTH = 6;
const INITIAL_COUNTDOWN = 6; // seconds
const MAX_RESEND_ATTEMPTS = 3;
const LOCKOUT_DURATION = 10 * 60; // 10 minutes in seconds

interface VerifyOTPProps {
  email?: string;
  phoneNumber?: string;
  verificationType?: "email" | "phone";
  purpose?: "verify" | "reset";
  onVerifySuccess?: () => void;
  setToSignUp: Dispatch<SetStateAction<Page>>;
}

/**
 * Formats time in seconds into a MM:SS string.
 * @param totalSeconds The total seconds to format.
 * @returns A string in "MM:SS" or "SSs" format.
 */
const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes > 0) {
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0",
    )}`;
  }
  return `${seconds}s`;
};

export default function VerifyOTP({
  email = "john@example.com",
  phoneNumber = "+234 901 112 2233",
  verificationType = "email",
  purpose = "verify",
  onVerifySuccess,
  setToSignUp,
}: VerifyOTPProps) {
  // --- State Management ---
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Countdown timer for the resend button
  const [countdown, setCountdown] = useState(INITIAL_COUNTDOWN);
  // Tracks how many times the user has requested a new code
  const [resendAttempts, setResendAttempts] = useState(0);

  // --- Countdown Effect ---
  // This effect is solely responsible for the timer logic.
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

/**
 * Returns true when resend request succeeded (or queued). Returns false on failure or when locked out.
 */
  const handleResendOTP = async (): Promise<boolean> => {
    // set busy indicator first
    setIsResending(true);

    // increment attempt counter
    const newAttemptCount = resendAttempts + 1;
    setResendAttempts(newAttemptCount);

    // Lockout logic
    if (newAttemptCount > MAX_RESEND_ATTEMPTS) {
      setCountdown(LOCKOUT_DURATION);
      setError(
        `Too many requests. Please try again in ${formatTime(LOCKOUT_DURATION)}.`
      );
      setOtp("");
      setIsResending(false);
      return false; // early return — do not spam server while locked out
    }

    // Normal countdown path
    setCountdown(INITIAL_COUNTDOWN);
    setOtp(""); // clear previous OTP input

    try {
      const res = await createOtp(email);

      // Server expected shape: { ok: boolean, message?: string, ... }
      if (!res?.ok) {
        const msg = "Failed to resend code. Please try again later.";
        setError(msg)
        return false;
      }
      
      setError("");
      return true;
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred. Please try again.");
      return false;
    } finally {
      setIsResending(false);
    }
  };

  // --- Event Handlers ---
  const handleOTPChange = useCallback((value: string) => {
    setOtp(value);
    if (error) setError(""); // Clear error on new input
  }, [error]);

  const handleVerifyOTP = async () => {
    if (otp.length !== OTP_LENGTH) {
      setError(`Please enter a complete ${OTP_LENGTH}-digit code`);
      return;
    }

    setIsVerifying(true);
    setError("");

  try {
    const res = await verifyOtp({email, otp, purpose: "verify"})

    // Server expected shape: { ok: boolean, message?: string, ... }
    if (!res?.ok) {
      const msg = "Failed to resend code. Please try again later.";
      setError(msg)
      return false;
    }
    onVerifySuccess?.()
    setError("");
    return true;
  } catch (err: any) {
    setError(err?.message || "An unexpected error occurred. Please try again.");
    return false;
  } finally {
    setIsResending(false);
  }
  }

  const isLockedOut = resendAttempts >= MAX_RESEND_ATTEMPTS;
  const resendEnabled = countdown === 0 && !isLockedOut;

  return (
    <div className="w-full max-w-md mx-auto p-6 mt-10 space-y-8">
      {/* Header Section */}
      <div className="space-y-4 text-center">
        <div className="flex items-center justify-center gap-3">
          <Image src={logoFull} alt="Doorite Logo" width={100} height={100} />
          <div className="w-2 h-2 bg-primary rounded-full" />
          <h1 className="font-bold text-2xl">Verify Code</h1>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-center mb-4">
            {verificationType === "email" ? (
              <Mail className="w-12 h-12 text-primary bg-primary/10 p-3 rounded-full" />
            ) : (
              <MessageSquare className="w-12 h-12 text-primary bg-primary/10 p-3 rounded-full" />
            )}
          </div>
          <p className="text-lg font-semibold">Enter Verification Code</p>
          <p className="text-sm text-muted-foreground">
            We&apos;ve sent a {OTP_LENGTH}-digit verification code to{" "}
            <span className="font-medium text-foreground">
              {verificationType === "email" ? email : phoneNumber}
            </span>
          </p>
        </div>
      </div>

      {/* OTP Input Section */}
      <div className="space-y-6 w-full">
        <div className="space-y-4 w-full flex flex-col items-center justify-center">
          <InputOTP
            maxLength={OTP_LENGTH}
            value={otp}
            onChange={handleOTPChange}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} className="w-12 h-12 text-lg" />
              <InputOTPSlot index={1} className="w-12 h-12 text-lg" />
              <InputOTPSlot index={2} className="w-12 h-12 text-lg" />
              <InputOTPSlot index={3} className="w-12 h-12 text-lg" />
              <InputOTPSlot index={4} className="w-12 h-12 text-lg" />
              <InputOTPSlot index={5} className="w-12 h-12 text-lg" />
            </InputOTPGroup>
          </InputOTP>

          {/* Error Message */}
          {error && (
            <p className="text-sm text-destructive text-center font-medium">
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
          {isVerifying ? "Verifying..." : "Verify Code"}
        </Button>

        {/* Resend Section */}
        <div className="text-center space-y-3">
          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive the code?
          </p>

          {resendEnabled ? (
            <Button
              variant="ghost"
              onClick={handleResendOTP}
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
            <p className="text-sm text-muted-foreground">
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

      {/* Back Link */}
      <div className="text-center">
        <Button
          variant="link"
          onClick={() =>
            purpose === "verify" ? setToSignUp("email") : setToSignUp(true)
          }
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {purpose === "verify" ? "Confirm Your Email" : "Back to Sign Up"}
        </Button>
      </div>
    </div>
  );
}