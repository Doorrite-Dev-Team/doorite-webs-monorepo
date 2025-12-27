"use client";

import React from "react";
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

interface VerifyOTPProps {
  email?: string;
  phoneNumber?: string;
  verificationType?: "email" | "phone";
  purpose?: "verify" | "reset";
  onVerifySuccess?: () => void;
  setToSignUp: Dispatch<SetStateAction<Page>>;
}

export default function VerifyOTP(props: VerifyOTPProps) {
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
    <div className="flex flex-col px-6 py-10 sm:px-8">
      <div className="flex flex-1 flex-col justify-center">
        <div className="max-w-lg mx-auto w-full">
          {/* Card */}
          <div className="rounded-2xl p-8 sm:p-8">
            {/* Brand + Title (matches SignUp header rhythm) */}
            <div className="text-center space-y-3">
              <Image
                src={logoFull}
                alt="Doorite Logo"
                width={100}
                height={40}
                className="mx-auto h-auto w-auto"
              />

              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Verify Code
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Enter the {OTP_LENGTH}-digit code we sent to
                </p>
                <p className="mt-1 text-sm font-medium text-foreground truncate">
                  {target}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-gray-100" />

            {/* Main body: icon + otp + actions */}
            <div className="space-y-5">
              <div className="flex items-center justify-center">
                <div className="inline-flex items-center justify-center rounded-lg bg-primary/10 p-3">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
              </div>

              <div className="flex flex-col items-center">
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
                        className="w-11 h-11 sm:w-12 sm:h-12 text-lg border rounded-md"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>

                {error && (
                  <p className="mt-3 text-sm text-red-600 font-medium text-center">
                    {error}
                  </p>
                )}

                <div className="w-full mt-4">
                  <Button
                    onClick={handleVerifyOTP}
                    disabled={!otpInputReady || isVerifying}
                    size="lg"
                    className="w-full h-12 text-base"
                  >
                    {isVerifying ? "Verifying..." : "Verify Code"}
                  </Button>
                </div>
              </div>

              {/* Resend */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Didn&apos;t receive the code?
                </p>

                <Button
                  variant="link"
                  onClick={handleResendOTP}
                  disabled={!resendEnabled || isResending}
                  className={`p-0 h-auto text-sm font-medium ${
                    resendEnabled ? "text-primary" : "text-gray-400"
                  }`}
                >
                  {isResending ? (
                    <>
                      <RotateCcw className="w-4 h-4 mr-2 animate-spin" />{" "}
                      Sending...
                    </>
                  ) : resendEnabled ? (
                    <>
                      <RotateCcw className="w-4 h-4 mr-2" /> Resend Code
                    </>
                  ) : isLockedOut ? (
                    "Try again later"
                  ) : (
                    <>
                      Resend code in{" "}
                      <span className="font-semibold text-primary ml-1">
                        {countdownDisplay}
                      </span>
                    </>
                  )}
                </Button>
              </div>

              {/* Small helper and change target */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleBack}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span className="inline-flex items-center">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {purpose === "verify"
                      ? "Change Email / Phone"
                      : "Back to Sign Up"}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer note (aligned with parent footer rhythm) */}
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Didn’t get an email? Check your spam or try a different address.
          </div>
        </div>
      </div>
    </div>
  );
}
