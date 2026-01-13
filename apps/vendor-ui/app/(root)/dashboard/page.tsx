// app/(vendor)/dashboard/page.tsx
import { Metadata } from "next";
import { serverFetch } from "@/libs/api/server";
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

async function getDashboardData(): Promise<DashboardData> {
  const data = await serverFetch<DashboardData>("/vendors/dashboard");
  return data;
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await getDashboardData();
    const businessName = data.vendor.businessName || "Vendor";

    return {
      title: `${businessName} | Dashboard`,
      description: `Manage your restaurant operations, orders, and menu for ${businessName}`,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return {
      title: "Vendor Dashboard | Doorrite",
      description: "Manage your restaurant operations and orders",
    };
  }
}

export default async function DashboardPage() {
  const dashboardData = await getDashboardData();

  return <DashboardClient initialData={dashboardData} />;
}
