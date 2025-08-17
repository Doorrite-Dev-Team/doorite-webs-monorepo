"use client";

import { logoFull } from "@repo/ui/assets";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import axios from "axios";
import { Eye, EyeOff, Mail, Phone, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import VerifyOTP from "../../../components/verify-otp";
import Axios from "../../../libs/Axios";
import { Page } from "../forgot-password/page";

type FormData = {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
};

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [userEmail, setuserEmail] = useState("")
        const [errorMessage, setErrorMessage] = useState<string>()
  const [showOTP, setShowOtp] = useState<Page>(false);
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await Axios.post("/auth/create-user", data);

      // Manual "ok" check for API's success flag
      // if (!res.data?.ok) {
      //   throw new Error(res.data?.message || "Server returned an error.");
      // }

      setuserEmail(data.email)
      setShowOtp(true)
      return res;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          console.error(err)
          setErrorMessage(
            err.response.data?.message || "SignUp failed. Please try again."
          );
        } else if (err.request) {
          console.error(err);
          setErrorMessage(
            "Unable to connect to the server. Please check your internet or try again later."
          );
        } else {
          setErrorMessage(err.message);
        }
      } else if (err instanceof Error) {
        // This is for our manual throw above
        setErrorMessage(err.message);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    }
  });
  if(showOTP) return (
    <VerifyOTP
      email={userEmail}
      verificationType="email"
      onVerifySuccess={() => {
        router.push("/");
      }}
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
          Create a New Customer Account
        </p>
      </div>

      {/* Form Section */}
      <form onSubmit={onSubmit} className="space-y-5">
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
                "Password must contain at least one uppercase letter, one lowercase letter, and one number",
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
        {/* errorMessage */}
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating Account..." : "Sign Up"}
        </Button>
      </form>

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
