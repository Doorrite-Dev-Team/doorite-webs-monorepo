import { API_CONFIG, getCookieHeader } from "@/configs/api";

export async function fetchDashboardData(): Promise<DashboardData> {
  console.log(API_CONFIG.baseUrl);
  const accessToken = await getCookieHeader(true);
  console.log(accessToken);
  // Using a direct fetch to avoid serverFetch cookie issues during static generation
  const response = await fetch(`${API_CONFIG.baseUrl}/vendors/dashboard`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    credentials: "include",
  });

  if (!response.ok) {
    console.log(
      `Failed to fetch dashboard data: ${(await response.json()).message}`,
    );
    throw new Error(`Failed to fetch dashboard data: ${response.status}`);
  }

  return response.json();
}
