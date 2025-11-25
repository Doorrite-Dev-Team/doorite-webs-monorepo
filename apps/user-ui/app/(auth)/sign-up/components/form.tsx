"use client";
import { signUpUser } from "@/actions/auth";
import VerifyOTP from "@/components/verify-otp";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { toast } from "@repo/ui/components/sonner";
import { User, Mail, EyeOff, Eye, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Page } from "../../forgot-password/components/form";

type FormData = {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
};

const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>();
  const [showOTP, setShowOtp] = useState<Page>(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  /**
   * Handles registration with your global signUpUser() action
   * Automatically uses Axios baseURL and toast system
   */
  const onSubmit = handleSubmit(async (data) => {
    setErrorMessage(undefined); // clear previous error

    try {
      const res = await signUpUser(data);
      console.log("🔵 Signup response:", res);

      // ✅ Always show the backend response via toast
      toast(res?.ok ? "✅ Success" : "❌ Error", {
        description: res?.message || "No response message from server.",
      });

      if (!res || !res.ok) {
        setErrorMessage(res?.message ?? "Sign up failed. Please try again.");
        return;
      }

      // ✅ Show OTP verification component after successful signup
      setUserEmail(data.email);
      setShowOtp(true);
    } catch (err: any) {
      console.error("❌ Signup failed:", err);

      // ✅ Show exact backend or network error via toast
      toast("⚠️ Error", {
        description:
          err?.response?.data?.message ||
          err.message ||
          "An unexpected error occurred.",
      });

      // fallback for UI text
      setErrorMessage(
        err?.response?.data?.message ||
          err.message ||
          "An error occurred. Please try again Later."
      );
    }
  });

  // After registration, show Verify OTP screen
  if (showOTP)
    return (
      <VerifyOTP
        email={userEmail}
        verificationType="email"
        onVerifySuccess={() => router.push("/log-in")}
        setToSignUp={setShowOtp}
      />
    );
  return (
    <>
      <form onSubmit={onSubmit} className="space-y-5">
        {/* Full Name */}
        <Input
          label="Full Name"
          leftIcon={<User className="w-4 h-4" />}
          {...register("fullName", {
            required: "Your name is required",
            minLength: {
              value: 2,
              message: "Name must be at least 2 characters",
            },
          })}
          error={errors.fullName?.message}
          placeholder="John Doe"
        />

        {/* Email */}
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

        {/* Password */}
        <Input
          label="Password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
            maxLength: {
              value: 20,
              message: "Password must not exceed 20 characters",
            },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
              message:
                "Password must contain at least one uppercase, one lowercase, and one number",
            },
          })}
          error={errors.password?.message}
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
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

        {/* Phone Number */}
        <Input
          label="Phone Number"
          leftIcon={<Phone className="w-4 h-4" />}
          {...register("phoneNumber", {
            required: "Phone number is required",
            pattern: {
              value: /^(\+234|0)[789][01]\d{8}$/,
              message: "Please enter a valid Nigerian phone number",
            },
          })}
          type="tel"
          error={errors.phoneNumber?.message}
          placeholder="09011122233"
        />

        {/* Submit */}
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating Account..." : "Sign Up"}
        </Button>
      </form>

      {/* Error Message */}
      {errorMessage && (
        <p className="my-4 text-red-500 font-medium">{errorMessage}</p>
      )}
    </>
  );
};

export default SignUpForm;
