import Link from "next/link";
import SignUpForm from "./components/form";

export default function SignUp() {
  return (
    <div className="flex flex-col px-6 py-10 sm:px-8">
      {/* Content Container: Centered vertically for focus */}
      <SignUpForm />

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
