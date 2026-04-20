// app/(vendor)/dashboard/page.tsx
import { Metadata } from "next";
import DashboardClient from "@/components/dashboard/client";
import { fetchDashboardData, fetchVendorStats } from "@/actions/server";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Vendor Dashboard | Doorrite",
    description: "Manage your restaurant operations and orders",
  };
}

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [dashboardData, statsData] = await Promise.all([
    fetchDashboardData(),
    fetchVendorStats().catch(() => null), // Stats are optional - don't fail if unavailable
  ]);

  return <DashboardClient initialData={dashboardData} statsData={statsData} />;
}
