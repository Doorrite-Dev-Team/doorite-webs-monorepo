import { apiClient } from "@/libs/api-client";
import { toast } from "@repo/ui/components/sonner";

// export const api = {
//   fetchProfile: async () => {
//     try {
//       const { data }: SuccessResponse<{ user: User }> =
//         await apiClient.get(`/users/me`);
//       return data.user;
//     } catch (error) {
//       console.error("Unable to fetch profile:", error);
//       return null;
//     }
//   },
// };

// src/lib/api.ts (or equivalent)

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
// CLIENT API (apiClient + toast)
// ========================================================

export const api = {
  // ---------------- PRODUCTS ----------------
  fetchProducts: async (params: Record<string, string>) => {
    try {
      const qs = new URLSearchParams(params).toString();
      const url = `/products${qs ? `?${qs}` : ""}`;

      const res: SuccessResponse<{
        products: Product[];
        pagination: Pagination;
      }> = await apiClient.get(url);

      return res.data.products || [];
    } catch (error) {
      if (window)
        toast(`Unable to fetch Products: ${(error as Error).message}`);
      console.warn(`Unable to fetch Order: ${(error as Error).message}`);
      return [];
    }
  },

  fetchProduct: async (id: string) => {
    try {
      const { data }: SuccessResponse<{ product: Product }> =
        await apiClient.get(`/products/${id}`);
      console.log(data);
      return data.product;
    } catch (error) {
      if (typeof window !== "undefined")
        toast(`Unable to fetch Product: ${(error as Error).message}`);
      console.warn(`Unable to fetch Order: ${(error as Error).message}`);
      return null;
    }
  },

  // ---------------- VENDORS ----------------
  fetchVendors: async (params?: string) => {
    try {
      const res: SuccessResponse<{
        vendors: Vendor[];
        pagination: Pagination;
      }> = await apiClient.get(`/vendors?${params || ""}`);

      return res.data.vendors || [];
    } catch (error) {
      if (typeof window !== "undefined")
        toast(`Unable to fetch Vendors: ${(error as Error).message}`);
      console.warn(`Unable to fetch Order: ${(error as Error).message}`);
      return [];
    }
  },

  fetchVendor: async (id: string) => {
    try {
      const { data }: SuccessResponse<{ vendor: Vendor }> = await apiClient.get(
        `/vendors/${id}`,
      );

      return data.vendor;
    } catch (error) {
      if (typeof window !== "undefined")
        toast(`Unable to fetch Vendor: ${(error as Error).message}`);
      console.warn(`Unable to fetch Order: ${(error as Error).message}`);
      return null;
    }
  },

  fetchVendorsProduct: async (id: string, params?: string) => {
    try {
      const res: SuccessResponse<{
        products: Product[];
        pagination: Pagination;
      }> = await apiClient.get(`/vendors/${id}/products?${params || ""}`);

      return res.data.products || [];
    } catch (error) {
      if (typeof window !== "undefined")
        toast(`Unable to fetch vendor products: ${(error as Error).message}`);
      console.warn(`Unable to fetch Order: ${(error as Error).message}`);
      return [];
    }
  },

  fetchRelatedVendors: async (category: string, excludeId: string) => {
    try {
      const {
        data,
      }: SuccessResponse<{ vendors: Vendor[]; pagination: Pagination }> =
        await apiClient(`/vendors?category=${category}&limit=4`);

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
        await apiClient.get(`/users/me`);
      return data.user;
    } catch (error) {
      console.error("Unable to fetch profile:", error);
      return null;
    }
  },

  updateProfile: async (profile: Partial<ProfileForm>) => {
    try {
      const res: SuccessResponse<{ user: User }> = await apiClient.put(
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
      await apiClient.put(`/users/password`, passwords);
    } catch (error) {
      throw new Error((error as Error).message || "Failed to change password");
    }
  },

  addAddress: async (address: AddressForm) => {
    try {
      const res: SuccessResponse<{ user: User }> = await apiClient.put(
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
      await apiClient.delete(`/users/address`, {
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
        await apiClient.get(`/users/orders/?limit=2`);

      if (!data.ok) return [];
      return data.orders || [];
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      return [];
    }
  },

  fetchOrder: async (id: string) => {
    try {
      const { data }: SuccessResponse<{ order: Order }> = await apiClient.get(
        `/orders/${id}`,
      );

      return data.order;
    } catch (error) {
      if (typeof window !== "undefined")
        toast(`Unable to fetch Order: ${(error as Error).message}`);
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
        await apiClient(`/orders?${params}`);

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
        await apiClient(`/payments/payment-methods`);

      return data.paymentMethod || [];
    } catch (error) {
      console.error("Failed to fetch payment methods:", error);
      return [];
    }
  },

  addPaymentMethod: async (cardData: AddCardForm) => {
    try {
      const res: SuccessResponse<{ paymentMethod: PaymentMethod }> =
        await apiClient.post(`/payments/payment-methods`, cardData);

      if (!res.data.ok) throw new Error(res.message);
      return res.data.paymentMethod;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  },

  deletePaymentMethod: async (id: string) => {
    try {
      const res: SuccessResponse = await apiClient.delete(
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
      const res: SuccessResponse = await apiClient.put(
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
      const { data: res }: SuccessResponse<{ data: ReviewsData }> =
        await apiClient(`/vendors/${vendorId}/reviews`);

      if (!res.ok) throw new Error("Failed to fetch reviews");
      return res.data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  },

  // ---------------- RIDERS ----------------
  fetchRider: async (riderId: string) => {
    try {
      const res: SuccessResponse<{ rider: Rider }> = await apiClient.get(
        `/riders/${riderId}`,
      );

      if (!res.data.ok) throw new Error("Failed to fetch rider info");
      return res.data.rider;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  },
};
