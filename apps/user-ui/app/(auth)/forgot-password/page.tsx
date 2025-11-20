import React from "react";
import Image from "next/image";
import Link from "next/link"; // Corrected import for navigation
import { ChevronLeft } from "lucide-react"; // Icon for visual cue
import { logoFull } from "@repo/ui/assets";
import ForgotPasswordForm from "./components/form";

export default function ForgotPassword() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-white px-6 py-10 sm:px-8">
      {/* Content Container */}
      <div className="flex flex-1 flex-col justify-center space-y-8">
        {/* Header */}
        <div className="space-y-2 text-center">
          <Image
            src={logoFull}
            alt="Doorite Logo"
            width={120}
            height={40}
            className="mx-auto h-auto w-auto"
            priority
          />
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Forgot Password?
          </h1>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            Enter your email address below and we&apos;ll send you a
            verification code.
          </p>
        </div>

        {/* Form Component */}
        <ForgotPasswordForm />
      </div>

      {/* Footer Action: Back to Login */}
      <div className="mt-auto text-center pt-6">
        <Link
          href="/log-in"
          className="inline-flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-gray-900 transition-colors p-3"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Log In
        </Link>
      </div>
    </div>
  );
}
