import { apiClient } from "@/libs/api/api-client";
import { toast } from "@repo/ui/components/sonner";

// actions/api.ts

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
  reviews: ReviewItem[];
  averageRating: number;
  totalReviews: number;
  ratingDistribution: RatingDist[];
}

export interface GroupedSearchResult {
  vendor: Vendor;
  products: Product[];
  matchCount: number;
  minPrice?: number;
  maxPrice?: number;
}

export interface ProductSearchResponse {
  query: string;
  groupedResults: GroupedSearchResult[];
  pagination: {
    currentPage: number;
    totalPages: number;
    total: number;
    limit: number;
  };
  message?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}
export interface CuisinesResponse {
  ok: boolean;
  categories: string[];
  keys: string[];
}

// ========================================================
// CLIENT API (apiClient + toast)
// ========================================================

export const api = {
  getCuisines: async (): Promise<string[]> => {
    const { data } = await apiClient.get<CuisinesResponse>(
      "/auth/vendor-categories",
    );
    return data.categories;
  },
  // ---------------- PRODUCTS ----------------
  fetchProducts: async (params: string): Promise<ProductSearchResponse> => {
    try {
      const { data } = await apiClient.get<ProductSearchResponse>(
        `/products?${params.toString()}`,
      );

      return data;
    } catch (error) {
      if (typeof window !== "undefined")
        toast(`Unable to fetch Products: ${(error as Error).message}`);
      console.warn(`Unable to fetch Products: ${(error as Error).message}`);
      return {
        query: "",
        groupedResults: [],
        pagination: { currentPage: 1, totalPages: 0, total: 0, limit: 20 },
      };
    }
  },

  fetchProduct: async (id: string) => {
    try {
      const { data }: SuccessResponse<{ product: Product }> =
        await apiClient.get(`/products/${id}`, { withCredentials: true });
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

      return {
        vendors: res.data.vendors || [],
        pagination: res.data.pagination,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        message: (res.data as any).message,
      };
    } catch (error) {
      if (typeof window !== "undefined")
        toast(`Unable to fetch Vendors: ${(error as Error).message}`);
      console.warn(`Unable to fetch Vendors: ${(error as Error).message}`);
      return {
        vendors: [],
        pagination: { page: 1, limit: 20, total: 0, pages: 0 },
        message: undefined,
      };
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
      }> = await apiClient.get(
        `/products/vendor/${id}${params ? `?${params}` : ""}`,
      );

      return {
        products: res.data.products || [],
        pagination: res.data.pagination,
      };
    } catch (error) {
      if (typeof window !== "undefined")
        toast(`Unable to fetch vendor products: ${(error as Error).message}`);
      console.warn(
        `Unable to fetch vendor products: ${(error as Error).message}`,
      );
      return {
        products: [],
        pagination: { page: 1, limit: 20, total: 0, pages: 0 },
      };
    }
  },

  fetchDeliveryCalculation: async (params: {
    vendorId: string;
    lat: number;
    lng: number;
  }) => {
    try {
      const res: SuccessResponse<{
        distance: number;
        deliveryTime: string;
        deliveryFee: number;
      }> = await apiClient.get(
        `/products/delivery-calculation?vendorId=${params.vendorId}&lat=${params.lat}&lng=${params.lng}`,
      );

      return {
        distance: res.data.distance || 0,
        estimatedTime: res.data.deliveryTime || "25-35 min",
        fee: res.data.deliveryFee || 0,
      };
    } catch (error) {
      if (typeof window !== "undefined")
        toast(`Unable to calculate delivery: ${(error as Error).message}`);
      console.warn(`Unable to calculate delivery: ${(error as Error).message}`);
      return {
        distance: 0,
        estimatedTime: "25-35 min",
        fee: 0,
      };
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
      const res: SuccessResponse<{ user: User }> =
        await apiClient.get(`/users/me`);
      console.log(res);
      return res.data.user;
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

  updateAddress: async (addressId: string, address: AddressForm) => {
    try {
      const res: SuccessResponse<{ user: User }> = await apiClient.put(
        `/users/addresses/${addressId}`,
        address,
      );

      return res.data;
    } catch (error) {
      throw new Error((error as Error).message || "Failed to update address");
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
      console.log(data);
      return data.order;
    } catch (error) {
      // Log errors on the server for debugging
      console.error(
        `[Server API] Unable to fetch Order ${id}:`,
        (error as Error).message,
      );

      // Return null so the page can call notFound() or show an error state
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
        await apiClient.get(`/users/orders`);
      console.log(data.orders);
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

  fetchUserOrders: async ({
    page = 1,
    limit = 100,
  }: {
    page?: number;
    limit?: number;
  } = {}) => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        sort: "desc",
      });

      const {
        data,
      }: SuccessResponse<{ orders: Order[]; pagination: Pagination }> =
        await apiClient.get(`/users/orders?${params.toString()}`);

      return {
        orders: (data.orders ?? []).map((o) => ({
          ...o,
          vendorName:
            (o as Order & { vendorName?: string }).vendorName ?? "Vendor",
          vendorLogoUrl: (o as Order & { vendorLogoUrl?: string })
            .vendorLogoUrl,
        })),
      };
    } catch (error) {
      console.error("Failed to fetch user orders:", error);
      return { orders: [] };
    }
  },

  // ---------------- FAVORITES ----------------
  fetchFavorites: async () => {
    try {
      const { data }: SuccessResponse<{ favorites: Product[] }> =
        await apiClient.get(`/users/favorites`);
      return { success: true, favorites: data.favorites || [] };
    } catch (error) {
      const message = (error as Error).message || "Failed to fetch favorites";
      console.error("Failed to fetch favorites:", message);
      return { success: false, error: message, favorites: [] };
    }
  },

  addToFavorites: async (productId: string) => {
    try {
      const { data }: SuccessResponse<{ message: string }> =
        await apiClient.post(`/users/favorites`, { productId });
      return { success: true, message: data.message };
    } catch (error) {
      const message = (error as Error).message || "Failed to add to favorites";
      console.error("Failed to add to favorites:", message);
      return { success: false, error: message };
    }
  },

  removeFromFavorites: async (productId: string) => {
    try {
      const { data }: SuccessResponse<{ message: string }> =
        await apiClient.delete(`/users/favorites/${productId}`);
      return { success: true, message: data.message };
    } catch (error) {
      const message =
        (error as Error).message || "Failed to remove from favorites";
      console.error("Failed to remove from favorites:", message);
      return { success: false, error: message };
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

  // ---------------- ORDERS ----------------
  cancelOrder: async (orderId: string) => {
    try {
      const { data }: SuccessResponse<{ order: Order }> = await apiClient.patch(
        `/orders/${orderId}/cancel`,
      );
      return { success: true, order: data.order };
    } catch (error) {
      const message = (error as Error).message || "Failed to cancel order";
      console.error("Failed to cancel order:", message);
      return { success: false, error: message };
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

  // ---------------- CHAT ----------------
  fetchChatMessages: async (orderId: string, limit = 50, before?: string) => {
    try {
      const params = new URLSearchParams({ limit: limit.toString() });
      if (before) params.set("before", before);

      const res: SuccessResponse<{
        messages: Array<{
          id: string;
          content: string;
          senderType: "customer" | "rider" | "vendor";
          senderId: string;
          createdAt: string;
        }>;
      }> = await apiClient.get(`/orders/${orderId}/messages?${params}`);

      return res.data.messages || [];
    } catch (error) {
      console.error("Failed to fetch chat messages:", error);
      return [];
    }
  },

  // ---------------- REVIEWS ----------------
  fetchPendingReviews: async () => {
    try {
      const res: SuccessResponse<{
        orders: Array<{
          id: string;
          vendor: { id: string; businessName: string; logoUrl?: string };
          totalAmount: number;
          deliveredAt: string;
          items: Array<{
            product: { id: string; name: string };
            quantity: number;
          }>;
        }>;
      }> = await apiClient.get("/orders/pending-review");
      return res.data.orders || [];
    } catch (error) {
      console.error("Failed to fetch pending reviews:", error);
      return [];
    }
  },

  submitReview: async (reviewData: {
    orderId: string;
    vendorRating?: number;
    riderRating?: number;
    comment?: string;
    productRatings?: Array<{ productId: string; rating: number }>;
  }) => {
    try {
      const { data }: SuccessResponse<{ review: unknown }> =
        await apiClient.post("/users/reviews", reviewData);
      return { success: true, review: data.review };
    } catch (error) {
      const message = (error as Error).message || "Failed to submit review";
      console.error("Failed to submit review:", message);
      return { success: false, error: message };
    }
  },

  fetchVendorReviews: async (vendorId: string, page = 1, limit = 10) => {
    try {
      const res: SuccessResponse<{
        reviews: Array<{
          id: string;
          rating: number;
          comment?: string;
          createdAt: string;
          user: { fullName: string; profileImageUrl?: string };
        }>;
        averageRating: number;
        totalReviews: number;
        ratingDistribution: Record<number, number>;
      }> = await apiClient.get(
        `/vendors/${vendorId}/reviews?page=${page}&limit=${limit}`,
      );

      const raw = res.data;
      const dist = raw.ratingDistribution ?? {};

      return {
        reviewsData: {
          averageRating: raw.averageRating ?? 0,
          totalReviews: raw.totalReviews ?? 0,
          ratingDistribution: Object.entries(dist).map(([stars, count]) => ({
            stars: Number(stars),
            count: count as number,
            percentage:
              raw.totalReviews > 0
                ? ((count as number) / raw.totalReviews) * 100
                : 0,
          })),
          reviews: (raw.reviews ?? []).map((r) => ({
            id: r.id,
            userId: r.user?.fullName ?? "",
            userName: r.user?.fullName ?? "Anonymous",
            userAvatar: r.user?.profileImageUrl,
            rating: r.rating,
            comment: r.comment ?? "",
            createdAt: r.createdAt,
          })),
        },
      };
    } catch (error) {
      console.error("Failed to fetch vendor reviews:", error);
      return { reviewsData: null };
    }
  },

  fetchProductReviews: async (productId: string, page = 1, limit = 10) => {
    try {
      const res: SuccessResponse<{
        reviews: Array<{
          id: string;
          rating: number;
          comment?: string;
          createdAt: string;
          user: { fullName: string; profileImageUrl?: string };
        }>;
        averageRating: number;
        totalReviews: number;
      }> = await apiClient.get(
        `/products/${productId}/reviews?page=${page}&limit=${limit}`,
      );

      const raw = res.data;
      const reviews = (raw.reviews ?? []).map((r) => ({
        id: r.id,
        userId: r.user?.fullName ?? "",
        userName: r.user?.fullName ?? "Anonymous",
        userAvatar: r.user?.profileImageUrl,
        rating: r.rating,
        comment: r.comment ?? "",
        createdAt: r.createdAt,
      }));

      return {
        reviews,
        stats: {
          averageRating: raw.averageRating ?? 0,
          totalReviews: raw.totalReviews ?? 0,
          ratingDistribution: [],
        },
        pagination: {
          currentPage: page,
          totalPages: Math.ceil((raw.totalReviews ?? 0) / limit),
          hasNext: page * limit < (raw.totalReviews ?? 0),
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      console.error("Failed to fetch product reviews:", error);
      return null;
    }
  },
};
