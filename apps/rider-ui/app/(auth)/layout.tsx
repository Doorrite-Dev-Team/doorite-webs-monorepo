import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <main className="w-full max-w-md px-4 py-8">{children}</main>
    </div>
  );
}
