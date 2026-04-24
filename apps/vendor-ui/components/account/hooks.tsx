import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@repo/ui/components/sonner";
import apiClient from "@/libs/api/client";
import { deriveError } from "@/libs/utils/errorHandler";

export interface VendorProfile {
  id: string;
  email: string;
  businessName: string;
  phoneNumber: string;
  logoUrl: string | null;
  address: Address;
  openingTime: string | null;
  closingTime: string | null;
  avrgPreparationTime: string | null;
  rating: number | null;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
}

export interface VendorStats {
  rating: number;
  totalOrders: number;
  totalProducts: number;
  activeProducts: number;
  memberSince: string;
}

export interface NotificationSettings {
  orderNotifications: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
}

interface UpdateProfileData {
  businessName?: string;
  phoneNumber?: string;
  address?: Address;
  logoUrl?: string;
  openingTime?: string;
  closingTime?: string;
  avrgPreparationTime?: string;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

const updateStoreStatus = async (isActive: boolean) => {
  const response = await apiClient.put("/vendors/me", {
    isActive,
  });
  return response.data;
};

export function useUpdateStoreStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStoreStatus,
    onMutate: async (isActive) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ["vendor-profile"] });
      await queryClient.cancelQueries({ queryKey: ["dashboard"] });

      // Snapshot the previous values
      const previousVendorProfile = queryClient.getQueryData(["vendor-profile"]);
      const previousDashboard = queryClient.getQueryData(["dashboard"]);

      // Optimistically update to the new value
      if (previousVendorProfile) {
        queryClient.setQueryData(["vendor-profile"], (old: any) => ({
          ...old,
          isActive: isActive,
        }));
      }

      if (previousDashboard) {
        queryClient.setQueryData(["dashboard"], (old: any) => ({
          ...old,
          vendor: {
            ...old.vendor,
            isActive: isActive,
          },
        }));
      }

      // Return a context object with the snapshotted values
      return { previousVendorProfile, previousDashboard };
    },
    onError: (error, variables, context) => {
      // Rollback to the previous values if the mutation fails
      if (context?.previousVendorProfile) {
        queryClient.setQueryData(["vendor-profile"], context.previousVendorProfile);
      }
      if (context?.previousDashboard) {
        queryClient.setQueryData(["dashboard"], context.previousDashboard);
      }
      const message = deriveError(error) || "Failed to update store status";
      toast.error("Error updating store status", {
        description: message,
      });
    },
    onSuccess: () => {
      toast.success("Store status updated successfully");
    },
    onSettled: (data, error, variables, context) => {
      // Refetch to ensure we have the latest server state
      queryClient.invalidateQueries({ queryKey: ["vendor-profile"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

const fetchVendorProfile = async (): Promise<VendorProfile> => {
  const response = await apiClient.get("/vendors/me");

  if (!response.data?.ok) {
    throw new Error("Failed to fetch vendor profile");
  }
  return response.data.vendor;
};

const fetchVendorStats = async (): Promise<VendorStats> => {
  const response = await apiClient.get("/vendors/stats");

  if (!response.data?.ok) {
    throw new Error("Failed to fetch vendor stats");
  }
  return response.data.stats;
};

const fetchNotificationSettings = async (): Promise<NotificationSettings> => {
  const response = await apiClient.get("/vendors/notifications/settings");

  if (!response.data?.ok) {
    throw new Error("Failed to fetch notification settings");
  }
  return response.data.settings;
};

const updateProfile = async (data: UpdateProfileData) => {
  const response = await apiClient.put("/vendors/me", data);
  return response.data;
};

const changePassword = async (data: ChangePasswordData) => {
  const response = await apiClient.put("/vendors/change-password", data);
  return response.data;
};

const updateNotificationSettings = async (
  settings: Partial<NotificationSettings>,
) => {
  const response = await apiClient.put(
    "/vendors/notifications/settings",
    settings,
  );
  return response.data;
};

// Custom Hooks
export function useVendorProfile() {
  return useQuery({
    queryKey: ["vendor-profile"],
    queryFn: fetchVendorProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useVendorStats() {
  return useQuery({
    queryKey: ["vendor-stats"],
    queryFn: fetchVendorStats,
    staleTime: 5 * 60 * 1000,
  });
}

export function useNotificationSettings() {
  return useQuery({
    queryKey: ["notification-settings"],
    queryFn: fetchNotificationSettings,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["vendor-profile"] });
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      const message = deriveError(error) || "Please try again";
      toast.error("Failed to update profile", {
        description: message,
      });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("Password changed successfully", {
        description: "Please use your new password on next login",
      });
    },
    onError: (error) => {
      const message = deriveError(error) || "Please try again";
      toast.error("Failed to change password", {
        description: message,
      });
    },
  });
}

export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateNotificationSettings,
    onMutate: async (newSettings) => {
      await queryClient.cancelQueries({ queryKey: ["notification-settings"] });

      const previous = queryClient.getQueryData(["notification-settings"]);

      queryClient.setQueryData(["notification-settings"], (old: any) => ({
        ...old,
        ...newSettings,
      }));

      return { previous };
    },
    onError: (error, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["notification-settings"], context.previous);
      }
      const message = deriveError(error) || "Please try again";
      toast.error("Failed to update settings", {
        description: message,
      });
    },
    onSuccess: () => {
      toast.success("Settings updated");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-settings"] });
    },
  });
}
