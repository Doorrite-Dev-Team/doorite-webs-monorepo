"use client"

import { loginUser } from "@/actions/auth";
import { logoFull } from "@repo/ui/assets";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

type FormData = {
  email: string;
  password: string;
};

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await loginUser(data.email, data.password);

      if (!res || !res.ok) {
        // use server-provided message if present
        setErrorMessage(res?.message ?? "Sign up failed. Please try again.");
        return;
      }

      router.push("/home");
    } catch (err) {
      setErrorMessage(
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
          <h1 className="font-bold text-2xl">Log In</h1>
        </div>
        <p className="text-xl font-semibold text-muted-foreground">
          Log In to your Customer Account
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

        <Input
          label="Password"
          leftIcon={<Lock className="w-4 h-4" />}
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
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

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging In..." : "Log In"}
        </Button>
      </form>

      {errorMessage && (
        <p className="my-4 text-red-500 font-medium">{errorMessage}</p>
      )}

      {/* Footer Links */}
      <div className="flex items-center justify-between text-sm">
        <div>
          <span className="text-muted-foreground">
            Don&apos;t have an account?{" "}
          </span>
          <Link
            href="/sign-up"
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Sign Up
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