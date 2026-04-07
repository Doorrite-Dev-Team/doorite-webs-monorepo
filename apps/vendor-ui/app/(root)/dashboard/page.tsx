// app/(vendor)/dashboard/page.tsx
import { Metadata } from "next";
import DashboardClient from "@/components/dashboard/client";
import { fetchDashboardData } from "@/actions/server";

export async function generateMetadata(): Promise<Metadata> {
  // Return static metadata for now, can be enhanced later
  return {
    title: "Vendor Dashboard | Doorrite",
    description: "Manage your restaurant operations and orders",
  };
}

// Force dynamic rendering to avoid cookie usage during static generation
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const dashboardData = await fetchDashboardData();
  return <DashboardClient initialData={dashboardData} />;
}
