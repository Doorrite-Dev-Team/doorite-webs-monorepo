import "@repo/ui/globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/dashboard/Navbar";
import Dashboard from "@/components/dashboard/Dashboard";

export const metadata: Metadata = {
  title: "Doorite Vendor UI",
  description: "Vendor interface for Doorite",
  icons: { icon: "/icon.ico" },
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Navbar>
        {children}
        <Dashboard />
      </Navbar>
    </div>
  );
}
