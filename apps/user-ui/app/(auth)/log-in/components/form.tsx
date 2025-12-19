"use client";

import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Mail, EyeOff, Eye, Lock } from "lucide-react";
import React, { useState } from "react";
import { loginUser } from "@/actions/auth";
// import { showToast } from "@/components/Toast";
import { userAtom } from "@/store/userAtom";
import { useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "@repo/ui/components/sonner";
import { AxiosError } from "axios";

type FormData = {
  email: string;
  password: string;
};

// Use the imported User type for consistency
type LoginResponse = {
  ok: boolean;
  message?: string;
  user?: User; // Use the Jotai User type
};

const LogingForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>();

  const setUser = useSetAtom(userAtom);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit = handleSubmit(async (data) => {
    console.log(" Attempting login with:", data);

    try {
      const res = (await loginUser(data.email, data.password)) as LoginResponse;
      console.log(" Login response:", res);

      const user = res?.user;
      console.log(user);
      if (!user) {
        // ... (Error handling remains the same)
        const msg = "Invalid response from server.";
        setErrorMessage(msg);
        toast.error("Login Failed", { description: msg });
        return;
      }
      setUser(user);
      console.log(" Saved user via Jotai/localStorage:", user);
      router.push("/home");
    } catch (error) {
      const err = error as AxiosError;
      console.error("Login request failed:", err.response?.data);

      const backendError = `Login Failed: ${(err.response?.data as Error)?.message || "An unexpected error occurred."}`;

      setErrorMessage(backendError);

      toast.error("Login Failed", { description: backendError });
    }
  });

  return (
    <>
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
        <p className="my-4 text-red-500 font-medium text-sm">{errorMessage}</p>
      )}
    </>
  );
};

export default LogingForm;
