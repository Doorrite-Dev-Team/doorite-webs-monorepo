"use client";

import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Mail, EyeOff, Eye, Lock, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { userAtom } from "@/store/userAtom";
import { useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "@repo/ui/components/sonner";
import { isAxiosError } from "axios";
import { authService } from "@/libs/api-client";

type FormData = {
  email: string;
  password: string;
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

  const onSubmit = handleSubmit(async (data, e) => {
    e?.preventDefault();
    setErrorMessage(undefined);
    try {
      const res = await authService.login(data.email, data.password);
      console.log("Login response:", res);

      if (!res.data || !res.data.user) {
        const msg = res?.message || "Invalid response from server.";
        setErrorMessage(msg);
        toast.error("Login Failed", { description: msg });
        return;
      }

      if (res.ok) {
        setUser(res.data.user);
        toast.loading("Redirecting to Home Page...");
        setTimeout(() => {
          window.location.href = "/home";
          router.refresh();
        }, 500); // Give mobile 500ms to settle the cookie
      }
    } catch (error) {
      let errMsg = "Cannot login";
      if (isAxiosError(error)) {
        errMsg =
          (error.response?.data && error.response?.data.message) ||
          error.message ||
          errMsg;
      } else if (error instanceof Error) {
        errMsg = error.message;
      }
      setErrorMessage(errMsg);
      toast.error("Login Failed", { description: errMsg });
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
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging In...
            </>
          ) : (
            "Log In"
          )}
        </Button>
      </form>

      {errorMessage && (
        <p className="my-4 text-red-500 font-medium text-sm">{errorMessage}</p>
      )}
    </>
  );
};

export default LogingForm;
