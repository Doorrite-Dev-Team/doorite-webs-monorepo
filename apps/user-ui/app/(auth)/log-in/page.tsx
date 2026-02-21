import { logoFull } from "@repo/ui/assets";
import Image from "next/image";
import Link from "next/link";
import LoginForm from "./components/form";

export default function Login() {
  return (
    <div className="flex flex-col px-6 py-10 sm:px-8">
      {/* Top Content: Centered vertically */}
      <div className="flex flex-1 flex-col justify-center space-y-8">
        {/* Header: Large Brand Presence */}
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
            Welcome Back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to continue
          </p>
        </div>

        {/* Form Area */}
        <div>
          <LoginForm />

          {/* Forgot Password - Placed immediately for quick access */}
          <div className="mt-4 text-right">
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-primary p-2 -mr-2" // Padding increases touch target
            >
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>

      {/* Footer: Pushed to bottom (Sticky feel) */}
      <div className="mt-8 text-center pb-4">
        <p className="text-sm text-muted-foreground">
          New to Doorite?{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-primary underline-offset-4 transition-colors hover:underline p-2"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
