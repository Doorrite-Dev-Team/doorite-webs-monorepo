// app/(vendor)/dashboard/page.tsx
import { Metadata } from "next";
import DashboardClient from "@/components/dashboard/client";

interface DashboardData {
  vendor: {
    id: string;
    businessName: string;
    email: string;
    phoneNumber: string;
    logoUrl?: string;
    rating?: number;
    openingTime?: string;
    closingTime?: string;
    address: {
      address: string;
      state?: string;
      country?: string;
    };
  };
  stats: {
    todayOrders: number;
    todayEarnings: number;
    availableItems: number;
  };
  activeOrders: Array<{
    id: string;
    orderId: string;
    customerName: string;
    customerAvatar?: string;
    status: string;
    totalAmount: number;
    itemCount: number;
    firstItemName: string;
    createdAt: string;
  }>;
}

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

async function fetchDashboardData(): Promise<DashboardData> {
  // Using a direct fetch to avoid serverFetch cookie issues during static generation
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/vendors/dashboard`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Note: During build time, we may not have cookies, but runtime will
      // This approach avoids the static generation error while preserving functionality
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard data: ${response.status}`);
  }

  return response.json();
}
