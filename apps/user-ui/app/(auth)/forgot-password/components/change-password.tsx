"use client";

import { logoFull } from "@repo/ui/assets";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { EyeOff, Eye, ArrowLeft, Lock } from "lucide-react";
import React, { Dispatch, useState } from "react";
import Image from "next/image";
import { SetStateAction } from "jotai";
import { Page } from "./form";
import { resetPassword } from "@/actions/auth";
import { useForm } from "react-hook-form";

type PasswordFormData = {
  password: string;
  confirmPassword: string;
};
interface ChangePasswordProps {
  setPageAction: Dispatch<SetStateAction<Page>>;
  setErrorMessageAction: Dispatch<SetStateAction<string | undefined>>;
  errorMessage?: string;
  userEmail: string;
}

const ChangePassword = ({
  setErrorMessageAction,
  setPageAction,
  errorMessage,
  userEmail,
}: ChangePasswordProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
    watch,
  } = useForm<PasswordFormData>();

  const watchPassword = watch("password");

  const onPasswordSubmit = handlePasswordSubmit(async (data) => {
    try {
      const res = await resetPassword({ email: userEmail, ...data });

      setPageAction("success");
      setErrorMessageAction("");
      return res;
    } catch (err) {
      setErrorMessageAction(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (err as any)?.message || "An error occurred. Please try again."
      );
    }
  });
  return (
    <div className="w-full max-w-md mx-auto p-6 mt-10 space-y-6">
      {/* Header Section */}
      <div className="space-y-4 text-center">
        <div className="flex items-center justify-center gap-3">
          <Image src={logoFull} alt="Doorite Logo" width={100} height={100} />
          <div className="w-2 h-2 bg-primary rounded-full" />
          <h1 className="font-bold text-2xl">Set New Password</h1>
        </div>
        <p className="text-lg font-semibold text-muted-foreground">
          Create a strong password for your account
        </p>
      </div>

      {/* Form Section */}
      <form onSubmit={onPasswordSubmit} className="space-y-5">
        <Input
          label="New Password"
          leftIcon={<Lock className="w-4 h-4" />}
          {...registerPassword("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
              message: "Password must contain uppercase, lowercase, and number",
            },
          })}
          error={passwordErrors.password?.message}
          type={showPassword ? "text" : "password"}
          placeholder="Enter new password"
          rightIcon={
            <button
              type="button"
              className="cursor-pointer p-1 hover:bg-muted rounded transition-colors"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Eye className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          }
        />

        <Input
          label="Confirm Password"
          leftIcon={<Lock className="w-4 h-4" />}
          {...registerPassword("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) =>
              value === watchPassword || "Passwords do not match",
          })}
          error={passwordErrors.confirmPassword?.message}
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm new password"
          rightIcon={
            <button
              type="button"
              className="cursor-pointer p-1 hover:bg-muted rounded transition-colors"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Eye className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          }
        />

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isPasswordSubmitting}
        >
          {isPasswordSubmitting ? "Updating Password..." : "Update Password"}
        </Button>
      </form>

      {errorMessage && (
        <p className="text-center text-sm text-destructive font-medium">
          {errorMessage}
        </p>
      )}

      {/* Back Button */}
      <div className="text-center">
        <button
          onClick={() => setPageAction("otp")}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Verification
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;
