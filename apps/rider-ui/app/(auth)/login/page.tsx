"use client";

import Link from "next/link";
import LoginForm from "./components/form";

export default function LogInPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">Log in</h1>
        <LoginForm />
      </div>
      <div className="mt-10">
        <span className="space-x-1 text-sm font-light text-center w-full">Don&apos;t have an account? <Link className="text-primary font-normal" href="/signup">SignUp</Link> </span>
      </div>
    </div>
  );
}
