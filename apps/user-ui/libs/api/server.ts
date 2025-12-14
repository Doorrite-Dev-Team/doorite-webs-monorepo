import "server-only";
import { serverToken } from "../utils/server-tokens";
// import { Review } from "../contant";
interface PaymentMethod {
  id: string;
  type: "card" | "bank" | "mobile";
  last4: string;
  brand: string;
  expiryMonth?: string;
  expiryYear?: string;
  isDefault: boolean;
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
export const serverFetch = async <T>(
  url: string,
  options: RequestInit = {},
): Promise<SuccessResponse<T>> => {
  const access = (await serverToken()).access;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}${url}`, {
    ...options,
    headers: {
      ...(options.headers ?? {}),
      ...(access ? { Authorization: `Bearer ${access}` } : {}),
      "Content-Type": "application/json",
    },
  });
  // Try to parse body (may fail for empty body)
  const json = await res.json();
  // --- Handle Client Errors (4xx) ---
  if (!res.ok && res.status >= 400 && res.status < 500) {
    const err: ClientError = {
      message: json?.message ?? "Client error",
      status: res.status,
      details: json,
      isClientError: true,
    };
    throw err;
  }
  // --- Server Error (5xx) ---
  if (!res.ok) {
    throw new Error(
      json?.message || `Server error: ${res.status} ${res.statusText}`,
    );
  }
  // --- Success Response Normalization ---
  return {
    data: {
      ok: true,
      ...(json?.data ?? json ?? {}),
    },
    message: json?.message ?? "Success",
  };
};
// ========================================================
// SERVER API (serverFetch + GET only + log & throw)
// ========================================================
export const serverApi = {
  // ---------------- PRODUCTS ----------------
  fetchProducts: async (params: Record<string, string>) => {
    try {
      const qs = new URLSearchParams(params).toString();
      const url = `/products${qs ? `?${qs}` : ""}`;
      const res: SuccessResponse<{
        products: Product[];
        pagination: Pagination;
      }> = await serverFetch(url);
      return res.data.products;
    } catch (error) {
      console.warn("SERVER fetchProducts:", error);
      // throw error;
      return [];
    }
  },
  fetchProduct: async (id: string) => {
    try {
      const res: SuccessResponse<{ product: Product }> = await serverFetch(
        `/products/${id}`,
      );
      return res.data.product;
    } catch (error) {
      console.warn("SERVER fetchProduct:", error);
      // throw error;
      return null;
    }
  },
  // ---------------- VENDORS ----------------
  fetchVendors: async (params?: string) => {
    try {
      const res: SuccessResponse<{
        vendors: Vendor[];
        pagination: Pagination;
      }> = await serverFetch(`/vendors${params ? `?${params}` : ""}`);
      return res.data.vendors;
    } catch (error) {
      console.warn("SERVER fetchVendors:", error);
      // throw error;
      return [];
    }
  },
  fetchVendor: async (id: string) => {
    try {
      const res: SuccessResponse<{ vendor: Vendor }> = await serverFetch(
        `/vendors/${id}`,
      );
      return res.data.vendor;
    } catch (error) {
      console.warn("SERVER fetchVendor:", error);
      // throw error;
      return null;
    }
  },
  fetchVendorsProduct: async (id: string, params?: string) => {
    try {
      const res: SuccessResponse<{
        products: Product[];
        pagination: Pagination;
      }> = await serverFetch(
        `/vendors/${id}/products${params ? ` ? ${params}` : ""}`,
      );
      return res.data.products;
    } catch (error) {
      console.warn("SERVER fetchVendorsProduct:", error);
      // throw error;
      return [];
    }
  },
  fetchRelatedVendors: async (category: string) => {
    try {
      const res: SuccessResponse<{
        vendors: Vendor[];
        pagination: Pagination;
      }> = await serverFetch(`/vendors?category=${category}&limit=4`);
      return res.data.vendors;
    } catch (error) {
      console.warn("SERVER fetchRelatedVendors:", error);
      // throw error;
      return [];
    }
  },
  // ---------------- PROFILE ----------------
  fetchProfile: async () => {
    try {
      const res: SuccessResponse<{ user: User }> =
        await serverFetch(`/users/me`);
      return res.data.user;
    } catch (error) {
      console.warn("SERVER fetchProfile:", error);
      // throw error;
      return null;
    }
  },
  // ---------------- ORDERS ----------------
  fetchRecentOrders: async () => {
    try {
      const res: SuccessResponse<{ orders: Order[] }> = await serverFetch(
        `/users/orders/?limit=2`,
      );
      return res.data.orders;
    } catch (error) {
      console.warn("SERVER fetchRecentOrders:", error);
      // throw error;
      return [];
    }
  },
  fetchOrder: async (id: string) => {
    try {
      const res: SuccessResponse<{ order: Order }> = await serverFetch(
        `/orders/${id}`,
      );
      return res.data.order;
    } catch (error) {
      console.warn("SERVER fetchOrder:", error);
      // throw error;
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
      const res: SuccessResponse<{ orders: Order[]; pagination: Pagination }> =
        await serverFetch(`/users/orders?${params}`);
      return {
        orders: res.data.orders,
        pagination: res.data.pagination,
      };
    } catch (error) {
      console.warn("SERVER fetchOrders:", error);
      // throw error;
      return {
        orders: [],
        pagination: {
          page: 0,
          limit: 0,
          total: 0,
          pages: 0,
        },
      };
    }
  },
  // ---------------- PAYMENT METHODS ----------------
  fetchPaymentMethods: async () => {
    try {
      const res: SuccessResponse<{ paymentMethod: PaymentMethod[] }> =
        await serverFetch(`/payments/payment-methods`);
      return res.data.paymentMethod;
    } catch (error) {
      console.warn("SERVER fetchPaymentMethods:", error);
      return [];
    }
  },
  // ---------------- REVIEWS ----------------
  fetchReviews: async (vendorId: string) => {
    try {
      const res: SuccessResponse<{ data: ReviewsData }> = await serverFetch(
        `/vendors/${vendorId}/reviews`,
      );
      return res.data.data;
    } catch (error) {
      console.warn("SERVER fetchReviews:", error);
      // throw error;
      return [];
    }
  },
  // ---------------- RIDERS ----------------
  fetchRider: async (riderId: string) => {
    try {
      const res: SuccessResponse<{ rider: Rider }> = await serverFetch(
        `/riders/${riderId}`,
      );
      return res.data.rider;
    } catch (error) {
      console.warn("SERVER fetchRider:", error);
      // throw error;
      return null;
    }
  },
};
