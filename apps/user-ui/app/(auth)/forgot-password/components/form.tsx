"use client";

import { forgotPassword } from "@/actions/auth";
import VerifyOTP from "@/components/verify-otp"; // Adjust path as per your project structure
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import ChangePassword from "./change-password";
import Success from "./success";

type FormData = {
  email: string;
};

export type Page =
  | "email"
  | "otp"
  | "Change Password"
  | "success"
  | true
  | false;

export default function ForgotPasswordForm() {
  const [userEmail, setUserEmail] = useState("");
  const [page, setPage] = useState<Page>("email");
  const [errorMessage, setErrorMessage] = useState<string>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await forgotPassword(data.email);

      if (!res?.ok) {
        setErrorMessage(res?.message ?? "Sign up failed. Please try again.");
        return;
      }
      setUserEmail(data.email);
      setPage("otp"); // Show the OTP verification component
      setErrorMessage("");
      return res;
    } catch (err) {
      setErrorMessage(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (err as any)?.message || "An error occurred. Please try again."
      );
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
      <ChangePassword
        userEmail={userEmail}
        setErrorMessageAction={setErrorMessage}
        setPageAction={setPage}
        errorMessage={errorMessage}
      />
    );
  }

  // Success page
  if (page === "success") {
    return <Success />;
  }

  // Default: Render the forgot password form (email input)
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
    </>
  );
}
