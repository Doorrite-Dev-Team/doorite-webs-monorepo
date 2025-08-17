"use client";

import { logoFull } from "@repo/ui/assets";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import axios from "axios";
import { ArrowLeft, CheckCircle, Eye, EyeOff, Lock, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import VerifyOTP from "../../../components/verify-otp"; // Adjust path as per your project structure
import Axios from "../../../libs/Axios";

type FormData = {
  email: string;
};

type PasswordFormData = {
  password: string;
  confirmPassword: string;
};

export type Page = "email" | "otp" | "Change Password" | "success";

export default function ForgotPassword() {
  const [userEmail, setUserEmail] = useState("");
  const [page, setPage] = useState<Page>("email");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
    watch,
  } = useForm<PasswordFormData>();

  const watchPassword = watch("password");

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await Axios.post("/auth/forget-password", data);

      setUserEmail(data.email);
      setPage("otp"); // Show the OTP verification component
      setErrorMessage("");
      return res;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error(err);
        if (err.response) {
          setErrorMessage(
            err.response.data?.message || "Failed to send verification code. Please try again."
          );
        } else if (err.request) {
          setErrorMessage(
            "Unable to connect to the server. Please check your internet or try again later."
          );
        } else {
          setErrorMessage(err.message);
        }
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    }
  });

  const onPasswordSubmit = handlePasswordSubmit(async (data) => {
    try {
      const res = await Axios.post("/auth/reset-password", {
        email: userEmail,
        ...data
      });

      setPage("success");
      setErrorMessage("");
      return res;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error(err);
        if (err.response) {
          setErrorMessage(
            err.response.data?.message || "Failed to reset password. Please try again."
          );
        } else if (err.request) {
          setErrorMessage(
            "Unable to connect to the server. Please check your internet or try again later."
          );
        } else {
          setErrorMessage(err.message);
        }
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    }
  });

  // If page is "otp", render the VerifyOTP component
  if (page === "otp") {
    return (
      <VerifyOTP
        email={userEmail}
        verificationType="email"
        purpose="reset"
        onVerifySuccess={() => {
          setPage("Change Password");
        }}
        setToSignUp={setPage}
      />
    );
  }

  // Change Password page
  if (page === "Change Password") {
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
                message: "Password must contain uppercase, lowercase, and number"
              }
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
                value === watchPassword || "Passwords do not match"
            })}
            error={passwordErrors.confirmPassword?.message}
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm new password"
            rightIcon={
              <button
                type="button"
                className="cursor-pointer p-1 hover:bg-muted rounded transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
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
            onClick={() => setPage("otp")}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Verification
          </button>
        </div>
      </div>
    );
  }

  // Success page
  if (page === "success") {
    return (
      <div className="w-full max-w-md mx-auto p-6 mt-10 space-y-6">
        {/* Header Section */}
        <div className="space-y-4 text-center">
          <div className="flex items-center justify-center gap-3">
            <Image src={logoFull} alt="Doorite Logo" width={100} height={100} />
            <div className="w-2 h-2 bg-primary rounded-full" />
            <h1 className="font-bold text-2xl">Password Updated!</h1>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <p className="text-lg font-semibold text-muted-foreground">
              Your password has been successfully updated
            </p>
            <p className="text-sm text-muted-foreground">
              You can now log in to your account with your new password
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="space-y-4">
          <Button
            onClick={() => router.push("/log-in")}
            size="lg"
            className="w-full"
          >
            Continue to Log In
          </Button>
          
          <div className="text-center">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Default: Render the forgot password form (email input)
  return (
    <div className="w-full max-w-md mx-auto p-6 mt-10 space-y-6">
      {/* Header Section */}
      <div className="space-y-4 text-center">
        <div className="flex items-center justify-center gap-3">
          <Image src={logoFull} alt="Doorite Logo" width={100} height={100} />
          <div className="w-2 h-2 bg-primary rounded-full" />
          <h1 className="font-bold text-2xl">Forgot Password</h1>
        </div>
        <p className="text-lg font-semibold text-muted-foreground">
          Enter your email to receive a verification code
        </p>
      </div>

      {/* Form Section */}
      <form onSubmit={onSubmit} className="space-y-5">
        <Input
          label="Email Address"
          leftIcon={<Mail className="w-4 h-4" />}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Please enter a valid email address",
            },
          })}
          error={errors.email?.message}
          placeholder="johndoe@gmail.com"
          type="email"
        />

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending Code..." : "Send Verification Code"}
        </Button>
      </form>

      {errorMessage && (
        <p className="text-center text-sm text-destructive font-medium">
          {errorMessage}
        </p>
      )}

      {/* Footer Link */}
      <div className="flex items-center justify-center text-sm">
        <Link
          href="/log-in"
          className="text-primary hover:text-primary/80 font-medium transition-colors"
        >
          Back to Log In
        </Link>
      </div>
    </div>
  );
}