import { LogIn } from "lucide-react";
import Link from "next/link";
import LoginForm from "./components/form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-xl">
            <LogIn className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Welcome back
            </h2>
            <p className="text-sm text-gray-500">
              Sign in to continue to your dashboard
            </p>
          </div>
        </div>

        <LoginForm />

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>
            By continuing you agree to our{" "}
            <Link href="/terms" className="underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
