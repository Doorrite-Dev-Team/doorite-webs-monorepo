import { API_CONFIG, getCookieHeader } from "@/configs/api";
import type { DashboardData, VendorStats } from "@/types/api";

export async function fetchDashboardData(): Promise<DashboardData> {
  const accessToken = await getCookieHeader(true);
  const response = await fetch(`${API_CONFIG.baseUrl}/vendors/dashboard`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Failed to fetch dashboard data: ${response.status}`);
  }

  return response.json();
}

export async function fetchVendorStats(): Promise<VendorStats> {
  const accessToken = await getCookieHeader(true);
  const response = await fetch(`${API_CONFIG.baseUrl}/vendors/stats`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Failed to fetch vendor stats: ${response.status}`);
  }

  return response.json();
}
