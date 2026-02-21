// src/lib/api.ts (or equivalent)
import { toast } from "@repo/ui/components/sonner";
import Axios from "./Axios"; // Assuming this is your configured Axios instance
import { cache } from "react";
import { apiClient } from "./api-client";

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
interface ProfileForm {
  fullName?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
}
interface AddressForm {
  address: string;
  state?: string;
  country?: string;
  coordinates?: {
    lat: number;
    long: number;
  };
}
interface PaymentMethod {
  id: string;
  type: "card" | "bank" | "mobile";
  last4: string;
  brand: string;
  expiryMonth?: string;
  expiryYear?: string;
  isDefault: boolean;
}
interface AddCardForm {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardholderName: string;
}
interface ReviewsData {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Array<{
    stars: number;
    count: number;
    percentage: number;
  }>;
}

// ========================================================
// CLIENT API (Axios + toast)
// ========================================================

export const api = {
  // ---------------- PRODUCTS ----------------
  fetchProducts: async (params: string | Record<string, string>) => {
    try {
      // const qs = new URLSearchParams(params).toString();
      const url = `/products${params ? `?${params}` : ""}`;

      const res: SuccessResponse<{
        products: Product[];
        pagination: Pagination;
      }> = await Axios.get(url);

      return { products: res.data.products, pagination: res.data.pagination };
    } catch (error) {
      toast(`Unable to fetch Products: ${(error as Error).message}`);
      return { products: [], pagination: { total: 0, page: 1, limit: 10 } };
    }
  },

  fetchProduct: cache(async (id: string): Promise<Product | null> => {
    try {
      if (!id || typeof id !== "string") {
        throw new Error("Invalid product ID");
      }

      const res: SuccessResponse<{ product: Product }> = await Axios.get(
        `/products/${id}`,
      );
      console.log(res.data);
      return res.data.product || null;
    } catch (error) {
      console.error(`Failed to fetch product ${id}:`, error);
      // Only show toast on client side
      if (typeof window !== "undefined") {
        toast.error(`Unable to fetch product: ${(error as Error).message}`);
      }
      return null;
    }
  }),

  // ---------------- VENDORS ----------------
  fetchVendors: async (params?: string) => {
    const res: SuccessResponse<{
      vendors: Vendor[];
      pagination: Pagination;
    }> = await Axios.get(`/vendors?${params || ""}`);

    return res.data;
  },

  fetchVendor: async (id: string) => {
    try {
      const { data }: SuccessResponse<{ vendor: Vendor }> = await Axios.get(
        `/vendors/${id}`,
      );

      return data.vendor;
    } catch (error) {
      toast(`Unable to fetch Vendor: ${(error as Error).message}`);
      return null;
    }
  },

  fetchVendorsProduct: async (id: string, params?: string) => {
    try {
      const res: SuccessResponse<{
        products: Product[];
        pagination: Pagination;
      }> = await Axios.get(`/vendors/${id}/products?${params || ""}`);

      return res.data.products || [];
    } catch (error) {
      toast(`Unable to fetch vendor products: ${(error as Error).message}`);
      return [];
    }
  },

  fetchRelatedVendors: async (category: string, excludeId: string) => {
    try {
      const {
        data,
      }: SuccessResponse<{ vendors: Vendor[]; pagination: Pagination }> =
        await Axios(`/vendors?category=${category}&limit=4`);

      return (data.vendors || []).filter((v) => v.id !== excludeId);
    } catch (error) {
      console.error("Failed to fetch related vendors:", error);
      return [];
    }
  },

  // ---------------- USER PROFILE ----------------
  fetchProfile: async () => {
    try {
      const { data }: SuccessResponse<{ user: User }> =
        await Axios.get(`/users/me`);
      return data.user;
    } catch (error) {
      console.error("Unable to fetch profile:", error);
      return null;
    }
  },

  updateProfile: async (profile: Partial<ProfileForm>) => {
    try {
      const res: SuccessResponse<{ user: User }> = await Axios.put(
        `/users/me`,
        profile,
      );
      return res.data;
    } catch (error) {
      throw new Error((error as Error).message || "Failed to update profile");
    }
  },

  changePassword: async (passwords: PasswordForm) => {
    try {
      await Axios.put(`/users/password`, passwords);
    } catch (error) {
      throw new Error((error as Error).message || "Failed to change password");
    }
  },

  addAddress: async (address: AddressForm) => {
    try {
      const res: SuccessResponse<{ user: User }> = await Axios.put(
        `/users/me`,
        {
          address,
        },
      );

      return res.data;
    } catch (error) {
      throw new Error((error as Error).message || "Failed to add address");
    }
  },

  deleteAddress: async (addressToDelete: string) => {
    try {
      await Axios.delete(`/users/address`, {
        data: { addressToDelete },
      });
    } catch (error) {
      throw new Error((error as Error).message || "Failed to delete address");
    }
  },

  // ---------------- ORDERS ----------------
  fetchRecentOrders: async () => {
    try {
      const { data }: SuccessResponse<{ orders: Order[] }> =
        await Axios.get(`/orders?limit=2`);

      if (!data.ok) return [];
      return data.orders || [];
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      return [];
    }
  },

  fetchOrder: async (id: string) => {
    try {
      const { data }: SuccessResponse<{ order: Order }> = await Axios.get(
        `/orders/${id}`,
      );

      return data.order;
    } catch (error) {
      toast(`Unable to fetch Order: ${(error as Error).message}`);
      return null;
    }
  },

  fetchOrders: async (page = 1, status?: OrderStatus) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        sort: "desc",
      });

      if (status) params.append("status", status);

      const {
        data,
      }: SuccessResponse<{ orders: Order[]; pagination: Pagination }> =
        await apiClient.get(`/users/orders?${params}`);

      return {
        orders: data.orders || [],
        pagination: data.pagination,
      };
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      return {
        orders: [],
        pagination: { page: 1, limit: 20, total: 0, pages: 0 },
      };
    }
  },

  // ---------------- PAYMENTS ----------------
  fetchPaymentMethods: async () => {
    try {
      const { data }: SuccessResponse<{ paymentMethod: PaymentMethod[] }> =
        await Axios(`/payments/payment-methods`);

      return data.paymentMethod || [];
    } catch (error) {
      console.error("Failed to fetch payment methods:", error);
      return [];
    }
  },

  addPaymentMethod: async (cardData: AddCardForm) => {
    try {
      const res: SuccessResponse<{ paymentMethod: PaymentMethod }> =
        await Axios.post(`/payments/payment-methods`, cardData);

      if (!res.data.ok) throw new Error(res.message);
      return res.data.paymentMethod;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  },

  deletePaymentMethod: async (id: string) => {
    try {
      const res: SuccessResponse = await Axios.delete(
        `/payments/payment-methods/${id}`,
      );

      if (!res.data.ok)
        throw new Error(`Failed to delete payment method: ${res.message}`);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  },

  setDefaultPaymentMethod: async (id: string) => {
    try {
      const res: SuccessResponse = await Axios.put(
        `/payments/payment-methods/${id}/default`,
      );

      if (!res.data.ok) throw new Error("Failed to set default payment method");
    } catch (error) {
      throw new Error((error as Error).message);
    }
  },

  // ---------------- REVIEWS ----------------
  fetchReviews: async (vendorId: string) => {
    try {
      const { data: res }: SuccessResponse<{ reviewsData: ReviewsData }> =
        await Axios(`/vendors/${vendorId}/reviews`);
      if (!res.ok) throw new Error("Failed to fetch reviews");
      return res.reviewsData;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  },

  // ---------------- RIDERS ----------------
  fetchRider: async (riderId: string) => {
    try {
      const res: SuccessResponse<{ rider: Rider }> = await Axios.get(
        `/riders/${riderId}`,
      );

      if (!res.data.ok) throw new Error("Failed to fetch rider info");
      return res.data.rider;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  },
};
