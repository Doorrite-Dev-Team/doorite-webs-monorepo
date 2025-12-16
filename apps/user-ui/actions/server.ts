import { serverFetch } from "@/libs/server-api";
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

export const serverApi = {
  // ---------------- PRODUCTS ----------------
  fetchProducts: async (params: Record<string, string>) => {
    try {
      const qs = new URLSearchParams(params).toString();
      const url = `/products${qs ? `?${qs}` : ""}`;
      const res: {
        products: Product[];
        pagination: Pagination;
      } = await serverFetch(url);
      return res.products;
    } catch (error) {
      console.warn("SERVER fetchProducts:", error);
      // throw error;
      return [];
    }
  },
  fetchProduct: async (id: string) => {
    try {
      const res: { product: Product } = await serverFetch(`/products/${id}`);
      return res.product;
    } catch (error) {
      console.warn("SERVER fetchProduct:", error);
      // throw error;
      return null;
    }
  },
  // ---------------- VENDORS ----------------
  fetchVendors: async (params?: string) => {
    try {
      const res: {
        vendors: Vendor[];
        pagination: Pagination;
      } = await serverFetch(`/vendors${params ? `?${params}` : ""}`);
      return res.vendors;
    } catch (error) {
      console.warn("SERVER fetchVendors:", error);
      // throw error;
      return [];
    }
  },
  fetchVendor: async (id: string) => {
    try {
      const res: { vendor: Vendor } = await serverFetch(`/vendors/${id}`);
      return res.vendor;
    } catch (error) {
      console.warn("SERVER fetchVendor:", error);
      // throw error;
      return null;
    }
  },
  fetchVendorsProduct: async (id: string, params?: string) => {
    try {
      const res: {
        products: Product[];
        pagination: Pagination;
      } = await serverFetch(
        `/vendors/${id}/products${params ? ` ? ${params}` : ""}`,
      );
      return res.products;
    } catch (error) {
      console.warn("SERVER fetchVendorsProduct:", error);
      // throw error;
      return [];
    }
  },
  fetchRelatedVendors: async (category: string) => {
    try {
      const res: {
        vendors: Vendor[];
        pagination: Pagination;
      } = await serverFetch(`/vendors?category=${category}&limit=4`);
      return res.vendors;
    } catch (error) {
      console.warn("SERVER fetchRelatedVendors:", error);
      // throw error;
      return [];
    }
  },
  // ---------------- PROFILE ----------------
  fetchProfile: async () => {
    try {
      const res: { user: User } = await serverFetch(`/users/me`);
      return res.user;
    } catch (error) {
      console.warn("SERVER fetchProfile:", error);
      // throw error;
      return null;
    }
  },
  // ---------------- ORDERS ----------------
  fetchRecentOrders: async () => {
    try {
      const res: { orders: Order[] } = await serverFetch(
        `/users/orders/?limit=2`,
      );
      return res.orders;
    } catch (error) {
      console.warn("SERVER fetchRecentOrders:", error);
      // throw error;
      return [];
    }
  },
  fetchOrder: async (id: string) => {
    try {
      const res: { order: Order } = await serverFetch(`/orders/${id}`);
      return res.order;
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
      const res: { orders: Order[]; pagination: Pagination } =
        await serverFetch(`/users/orders?${params}`);
      return {
        orders: res.orders,
        pagination: res.pagination,
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
      const res: { paymentMethod: PaymentMethod[] } = await serverFetch(
        `/payments/payment-methods`,
      );
      return res.paymentMethod;
    } catch (error) {
      console.warn("SERVER fetchPaymentMethods:", error);
      return [];
    }
  },
  // ---------------- REVIEWS ----------------
  fetchReviews: async (vendorId: string) => {
    try {
      const res: { data: ReviewsData } = await serverFetch(
        `/vendors/${vendorId}/reviews`,
      );
      return res.data;
    } catch (error) {
      console.warn("SERVER fetchReviews:", error);
      // throw error;
      return [];
    }
  },
  // ---------------- RIDERS ----------------
  fetchRider: async (riderId: string) => {
    try {
      const res: { rider: Rider } = await serverFetch(`/riders/${riderId}`);
      return res.rider;
    } catch (error) {
      console.warn("SERVER fetchRider:", error);
      // throw error;
      return null;
    }
  },
};
