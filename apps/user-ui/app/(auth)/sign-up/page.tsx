import { logoFull } from "@repo/ui/assets";
import Image from "next/image";
import Link from "next/link";
import SignUpForm from "./components/form";

export default function SignUp() {
  return (
    <div className="flex flex-col px-6 py-10 sm:px-8">
      {/* Content Container: Centered vertically for focus */}
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
            Create Account
          </h1>
          <p className="text-sm text-muted-foreground">
            Join us to get started with your customer account
          </p>
        </div>

        {/* Form Section */}
        <SignUpForm />
      </div>

      {/* Footer Actions: Pushed to bottom for easy thumb access */}
      <div className="mt-6 flex flex-col items-center gap-y-4 border-t border-gray-50 pt-6">
        {/* Primary Alt Action: Login */}
        <div className="text-sm text-muted-foreground">
          Have an account?{" "}
          <Link
            href="/log-in"
            className="font-semibold text-primary p-2 underline-offset-4 transition-colors hover:underline"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
