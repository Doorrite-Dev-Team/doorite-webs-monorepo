import "server-only";
import { cookies } from "next/headers";

/**
 * Direct Server-to-Backend fetch utility
 */
const serverFetch = async <T>(
  url: string,
  options: RequestInit = {},
): Promise<SuccessResponse<T>> => {
  const cookieStore = await cookies();
  const access = cookieStore.get("access_token_user")?.value;
  const allCookies = cookieStore.toString();

  const baseUrl = process.env.NEXT_PUBLIC_API_URI;
  const fullUrl = `${baseUrl}${url.startsWith("/") ? url : `/${url}`}`;

  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(access ? { Authorization: `Bearer ${access}` } : {}),
      ...(allCookies ? { Cookie: allCookies } : {}),
      ...(options.headers ?? {}),
    },
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.message || `Server Error: ${res.status}`);
  }

  // Standardize the response to match your client-side data shape
  return {
    data: {
      ok: true,
      ...(json?.data ?? json ?? {}),
    },
    message: json?.message ?? "Success",
  };
};

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

export const serverApi = {
  // ---------------- PRODUCTS ----------------
  fetchProducts: async (params: Record<string, string> = {}) => {
    try {
      const qs = new URLSearchParams(params).toString();
      const res = await serverFetch<{
        products: Product[];
        pagination: Pagination;
      }>(`/products${qs ? `?${qs}` : ""}`);
      return res.data.products || [];
    } catch (error) {
      console.warn("SERVER fetchProducts:", error);
      return [];
    }
  },

  fetchProduct: async (id: string) => {
    try {
      const res = await serverFetch<{ product: Product }>(`/products/${id}`);
      return res.data.product;
    } catch (error) {
      console.warn(`SERVER fetchProduct (${id}):`, error);
      return null;
    }
  },

  // ---------------- VENDORS ----------------
  fetchVendors: async (params?: string) => {
    try {
      const res = await serverFetch<{ vendors: Vendor[] }>(
        `/vendors?${params || ""}`,
      );
      return res.data.vendors || [];
    } catch (error) {
      console.warn("SERVER fetchVendors:", error);
      return [];
    }
  },

  fetchVendor: async (id: string) => {
    try {
      const res = await serverFetch<{ vendor: Vendor }>(`/vendors/${id}`);
      return res.data.vendor;
    } catch (error) {
      console.warn(`SERVER fetchVendor (${id}):`, error);
      return null;
    }
  },

  fetchVendorsProduct: async (id: string, params?: string) => {
    try {
      const res = await serverFetch<{ products: Product[] }>(
        `/vendors/${id}/products?${params || ""}`,
      );
      return res.data.products || [];
    } catch (error) {
      console.warn("SERVER fetchVendorsProduct:", error);
      return [];
    }
  },

  fetchRelatedVendors: async (category: string, excludeId: string) => {
    try {
      const res = await serverFetch<{ vendors: Vendor[] }>(
        `/vendors?category=${category}&limit=4`,
      );
      return (res.data.vendors || []).filter((v) => v.id !== excludeId);
    } catch (error) {
      console.warn("SERVER fetchRelatedVendors:", error);
      return [];
    }
  },

  // ---------------- USER / PROFILE ----------------
  fetchProfile: async () => {
    try {
      const res = await serverFetch<{ user: User }>("/users/me");
      return res.data.user;
    } catch (error) {
      console.warn("SERVER fetchProfile:", error);
      return null;
    }
  },

  // ---------------- ORDERS ----------------
  fetchOrder: async (id: string) => {
    try {
      const res = await serverFetch<{ order: Order }>(`/orders/${id}`);
      return res.data.order;
    } catch (error) {
      console.warn(`SERVER fetchOrder (${id}):`, error);
      return null;
    }
  },

  fetchOrders: async (page = 1, status?: string) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
      });
      if (status) params.append("status", status);

      const res = await serverFetch<{
        orders: Order[];
        pagination: Pagination;
      }>(`/users/orders?${params.toString()}`);
      return {
        orders: res.data.orders || [],
        pagination: res.data.pagination,
      };
    } catch (error) {
      console.warn("SERVER fetchOrders:", error);
      return { orders: [], pagination: null };
    }
  },

  // ---------------- MISC ----------------
  fetchPaymentMethods: async () => {
    try {
      const res = await serverFetch<{ paymentMethod: PaymentMethod[] }>(
        "/payments/payment-methods",
      );
      return res.data.paymentMethod || [];
    } catch (error) {
      console.warn("SERVER fetchPaymentMethods:", error);
      return [];
    }
  },

  fetchReviews: async (vendorId: string) => {
    try {
      const res = await serverFetch<{ data: ReviewsData }>(
        `/vendors/${vendorId}/reviews`,
      );
      return res.data.data;
    } catch (error) {
      console.warn("SERVER fetchReviews:", error);
      return null;
    }
  },

  fetchRider: async (riderId: string) => {
    try {
      const res = await serverFetch<{ rider: Rider }>(`/riders/${riderId}`);
      return res.data.rider;
    } catch (error) {
      console.warn("SERVER fetchRider:", error);
      return null;
    }
  },
};
