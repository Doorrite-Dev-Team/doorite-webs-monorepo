"use client";
import { signUpRider } from "@/actions/auth";
import VerifyOTP from "@/components/ui/verify-otp"; // Assuming this exists or I'll copy it
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { toast } from "@repo/ui/components/sonner";
import { User, Mail, EyeOff, Eye, Phone, Bike } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
// import { Page } from "../../forgot-password/components/form"; // Types might be missing
import Image from "next/image";
import { logoFull } from "@repo/ui/assets";

type SignUpFormData = {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  vehicleType: string;
};

const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>();
  const [showOTP, setShowOtp] = useState<boolean>(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>();

  const onSubmit = handleSubmit(async (data) => {
    setErrorMessage(undefined);

    try {
      const res = await signUpRider(data);
      console.log("🔵 Rider Signup response:", res);

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
    } catch (err) {
      console.error("❌ Signup failed:", err);

      toast("⚠️ Error", {
        description: (err as Error).message || "An unexpected error occurred.",
      });

      setErrorMessage(
        (err as Error).message || "An error occurred. Please try again Later.",
      );
    }
  });

  // After registration, show Verify OTP screen
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
    <div className="flex flex-1 flex-col justify-center space-y-8">
      {/* Header: Clean Brand Stack */}
      <div className="space-y-2 text-center">
        <Image
          src={logoFull}
          alt="Doorite Logo"
          width={100}
          height={40}
          className="mx-auto h-auto w-auto"
          priority
        />
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Become a Rider
        </h1>
        <p className="text-sm text-muted-foreground">
          Join us and start earning by delivering
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
          placeholder="rider@example.com"
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

        {/* Vehicle Type */}
        {/*<div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Vehicle Type
          </label>
          <div className="relative">
            <select
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              {...register("vehicleType", {
                required: "Vehicle type is required",
              })}
            >
              <option defaultValue="" disabled selected>
                Select Vehicle Type
              </option>
              <option value="bike">Bike (Motorcycle)</option>
              <option value="bicycle">Bicycle</option>
              <option value="car">Car</option>
              <option value="van">Van</option>
            </select>
          </div>
          {errors.vehicleType && (
            <p className="text-[0.8rem] font-medium text-destructive">
              {errors.vehicleType.message}
            </p>
          )}
        </div>*/}

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Vehicle Type
          </label>
          <div className="relative">
            <select
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              defaultValue=""
              {...register("vehicleType", {
                required: "Vehicle type is required",
              })}
            >
              <option value="" disabled>
                Select Vehicle Type
              </option>
              <option value="BIKE">Bike (Motorcycle)</option>
              <option value="BICYCLE">Bicycle</option>
              <option value="CAR">Car</option>
              <option value="VAN">Van</option>
            </select>
          </div>
          {errors.vehicleType && (
            <p className="text-[0.8rem] font-medium text-destructive">
              {errors.vehicleType.message}
            </p>
          )}
        </div>

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
    </div>
  );
};

export default SignUpForm;
