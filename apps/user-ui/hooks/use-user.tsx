// import Axios from "@/libs/Axios";

import { apiClient } from "@/libs/api-client";

export const useUser = async () => {
  try {
    if (typeof window === "undefined") return;

    const userData = localStorage.getItem("user");
    console.log("Fetched raw user data:", userData);

    if (!userData) {
      return "Guest";
    }

    const parsed = JSON.parse(userData);
    console.log("Parsed user object:", parsed);

    // 👇 Extract user object correctly
    const user = parsed?.user || parsed;
    const userId = user?.id || user?._id;

    console.log("Extracted userId:", userId);

    if (!userId) {
      console.warn("User ID not found in localStorage.");
      return "Guest";
    }

    // 🌐 Fetch updated user details
    const res = await apiClient.get(`/user/${userId}`, {
      withCredentials: true,
    });

    const name =
      res.data?.data?.fullName ?? user?.fullName ?? user?.name ?? "Guest";

    console.log("Fetched name from API or local:", name);
    return name;
  } catch (err) {
    console.error("❌ Failed to fetch user:", err);
    return "Guest";
  }
};
