"use client";

import { signUpUser } from "@/actions/auth";
import { logoFull } from "@repo/ui/assets";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { toast } from "@repo/ui/components/sonner";
import { Eye, EyeOff, Mail, Phone, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import VerifyOTP from "@/components/verify-otp";

type SignUpFormData = {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  profileImageUrl?: string;
  vehicleType?: string;
};

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>();
  const [showOTP, setShowOtp] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>();

  const onSubmit = handleSubmit(async (data) => {
    setErrorMessage(undefined);

    try {
      const { vehicleType, ...payload } = data;
      const res = await signUpUser(payload as any);

      // 🔴 Handle backend errors
      if (!res || !res.ok) {
        const message = res?.message ?? "Sign up failed. Please try again.";
        setErrorMessage(message);
        toast.error("Sign Up Failed", {
          description: (
            <pre className="mt-2 w-[300px] rounded-md bg-slate-950 p-4 overflow-x-auto">
              <code className="text-white">{JSON.stringify(res, null, 2)}</code>
            </pre>
          ),
        });
        return;
      }

      // 💾 Save user in localStorage
      localStorage.setItem("user", JSON.stringify(res.data));

      // 🟢 Success Toast
      toast.success("Account Created Successfully", {
        description: (
          <pre className="mt-2 w-[300px] rounded-md bg-slate-950 p-4 overflow-x-auto">
            <code className="text-white">{JSON.stringify(res, null, 2)}</code>
          </pre>
        ),
      });

      // Proceed to OTP verification
      setUserEmail(data.email);
      setShowOtp(true);
    } catch (err) {
      const message =
        (err as Error)?.message || "An error occurred. Please try again.";
      setErrorMessage(message);
      toast.error("Unexpected Error", {
        description: (
          <pre className="mt-2 w-[300px] rounded-md bg-slate-950 p-4 overflow-x-auto">
            <code className="text-white">{message}</code>
          </pre>
        ),
      });
    }
  });

  if (showOTP)
    return (
      <VerifyOTP
        email={userEmail}
        verificationType="email"
        onVerifySuccess={() => router.push("/login")}
        setToSignUp={setShowOtp}
      />
    );

  return (
    <div className="w-full max-w-md mx-auto p-6 mt-10 space-y-6">
      {/* Header Section */}
      <div className="space-y-4 text-center">
        <div className="flex items-center justify-center gap-3">
          <Image src={logoFull} alt="Doorite Logo" width={100} height={100} />
          <div className="w-2 h-2 bg-primary rounded-full" />
          <h1 className="font-bold text-2xl">Sign Up</h1>
        </div>
        <p className="text-xl font-semibold text-muted-foreground">
          Create a New Rider Account
        </p>
      </div>

      {/* Form Section */}
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

        {/* Phone Number */}
        <Input
          label="Phone Number"
          leftIcon={<Phone className="w-4 h-4" />}
          {...register("phoneNumber", {
            required: "Phone number is required",
            pattern: {
              value: /^\+?\d{10,14}$/,
              message:
                "Please enter a valid phone number (e.g. +2347035697549)",
            },
          })}
          type="tel"
          error={errors.phoneNumber?.message}
          placeholder="+2347035697549"
        />

        {/* Vehicle Type Dropdown */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-foreground">
            Vehicle Type
          </label>
          <select
            {...register("vehicleType")}
            className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
              errors.vehicleType ? "border-red-500" : "border-input"
            }`}
          >
            <option value="">Select vehicle type</option>
            <option value="motorcycle">Motorcycle</option>
            <option value="tricycle">Tricycle</option>
            <option value="car">Car</option>
            <option value="bus">Bus</option>
            <option value="truck">Truck</option>
            <option value="van">Van</option>
            <option value="bicycle">Bicycle</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Password */}
        <Input
          label="Password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
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

      {/* Footer Links */}
      <div className="flex items-center justify-between text-sm">
        <div>
          <span className="text-muted-foreground">Have an account? </span>
          <Link
            href="/log-in"
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Log In
          </Link>
        </div>
        <Link
          href="/forgot-password"
          className="text-primary hover:text-primary/80 font-medium transition-colors"
        >
          Forgot Password?
        </Link>
      </div>
    </div>
  );
}
