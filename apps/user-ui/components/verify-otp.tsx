"use client";

import { logoFull } from "@repo/ui/assets";
import { Button } from "@repo/ui/components/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@repo/ui/components/input-otp";
import { ArrowLeft, Mail, MessageSquare, RotateCcw } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import { useOtpLogic } from "@/hooks/use-verify-otp";
import { OTP_LENGTH } from "@/libs/utils/otp-helper";
import { Page } from "@/app/(auth)/forgot-password/components/form";

// Define the required props for the main component
interface VerifyOTPProps {
  email?: string;
  phoneNumber?: string;
  verificationType?: "email" | "phone";
  purpose?: "verify" | "reset";
  onVerifySuccess?: () => void;
  setToSignUp: Dispatch<SetStateAction<Page>>; // Use 'any' or the specific type for Page/parent state
}

export default function VerifyOTP(props: VerifyOTPProps) {
  // Destructure all logic and state from the custom hook
  const {
    otp,
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
  } = useOtpLogic(props);

  const { verificationType, purpose } = props;
  const Icon = verificationType === "email" ? Mail : MessageSquare;
  const otpInputReady = otp.length === OTP_LENGTH;

  return (
    // Mobile-First, Full-Height Container
    <div className="flex min-h-[100dvh] flex-col bg-white px-6 py-10 sm:px-8">
      {/* Content Container: Centered vertically */}
      <div className="flex flex-1 flex-col justify-center space-y-10 max-w-sm mx-auto w-full">
        {/* Header Section */}
        <div className="space-y-6 text-center">
          {/* Logo and Title Stack */}
          <div className="space-y-2">
            <Image
              src={logoFull}
              alt="Doorite Logo"
              width={120}
              height={40}
              className="mx-auto h-auto w-auto"
            />
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 mt-4">
              Verify Code
            </h1>
          </div>

          {/* Verification Icon and Message */}
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <Icon className="w-14 h-14 text-primary bg-primary/10 p-3 rounded-2xl" />
            </div>

            <p className="text-base text-gray-700">
              We&apos;ve sent a {OTP_LENGTH}-digit code to:
            </p>
            <p className="font-semibold text-lg text-foreground truncate">
              {target}
            </p>
          </div>
        </div>

        {/* OTP Input and Form Actions */}
        <div className="space-y-6 w-full">
          {/* OTP Input */}
          <div className="w-full flex flex-col items-center justify-center">
            <InputOTP
              maxLength={OTP_LENGTH}
              value={otp}
              onChange={handleOTPChange}
              containerClassName="justify-center"
            >
              <InputOTPGroup>
                {[...Array(OTP_LENGTH)].map((_, index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="w-10 h-10 sm:w-12 sm:h-12 text-lg border-2"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-sm text-red-600 text-center font-medium px-4">
              {error}
            </p>
          )}

          {/* Verify Button */}
          <Button
            onClick={handleVerifyOTP}
            disabled={!otpInputReady || isVerifying}
            size="lg"
            className="w-full h-12 text-base"
          >
            {isVerifying ? "Verifying..." : "Verify Code"}
          </Button>

          {/* Resend Section */}
          <div className="text-center space-y-3 pt-2">
            <p className="text-sm text-muted-foreground">
              Didn&apos;t receive the code?
            </p>

            <Button
              variant="link"
              onClick={handleResendOTP}
              disabled={!resendEnabled || isResending}
              className={`p-0 h-auto text-sm font-medium ${resendEnabled ? "text-primary" : "text-gray-400"}`}
            >
              {isResending ? (
                <>
                  <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : resendEnabled ? (
                <>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Resend Code
                </>
              ) : (
                <span className="inline-flex items-center">
                  {isLockedOut ? (
                    "Try again later"
                  ) : (
                    <>
                      Resend code in{" "}
                      <span className="font-semibold text-primary ml-1">
                        {countdownDisplay}
                      </span>
                    </>
                  )}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Footer Back Link: Pushed to bottom */}
      <div className="mt-auto text-center pt-8">
        <Button
          variant="link"
          onClick={handleBack}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors p-3"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {purpose === "verify" ? "Change Email/Phone" : "Back to Sign Up"}
        </Button>
      </div>
    </div>
  );
}
