import { serverFetch } from "@/libs/api/server-api";

export const serverApi = {
  // ---------------- PROFILE ----------------
  fetchProfile: async () => {
    try {
      const res: { user: User } = await serverFetch(`/users/me`);
      return res.user;
    } catch (error) {
      console.warn("SERVER fetchProfile:", error);
      return null;
    }
  },

  // ---------------- PRODUCTS ----------------
  fetchProduct: async (id: string) => {
    try {
      const res: { product: Product } = await serverFetch(`/products/${id}`);
      return res.product;
    } catch (error) {
      console.warn("SERVER fetchProduct:", error);
      return null;
    }
  },

  fetchVendorsProduct: async (vendorId: string, productId?: string) => {
    try {
      const url = productId
        ? `/vendors/${vendorId}/products?exclude=${productId}`
        : `/vendors/${vendorId}/products`;
      const res: { products: Product[] } = await serverFetch(url);
      return res.products || [];
    } catch (error) {
      console.warn("SERVER fetchVendorsProduct:", error);
      return [];
    }
  },

  // ---------------- VENDORS ----------------
  fetchVendor: async (id: string) => {
    try {
      const res: { vendor: Vendor } = await serverFetch(`/vendors/${id}`);
      return res.vendor;
    } catch (error) {
      console.warn("SERVER fetchVendor:", error);
      return null;
    }
  },

  fetchVendors: async (params?: string) => {
    try {
      const res: { vendors: Vendor[]; pagination: Pagination } =
        await serverFetch(`/vendors${params ? `?${params}` : ""}`);
      return res.vendors || [];
    } catch (error) {
      console.warn("SERVER fetchVendors:", error);
      return [];
    }
  },

  fetchRelatedVendors: async (category: string, excludeId?: string) => {
    try {
      const res: { vendors: Vendor[] } = await serverFetch(
        `/vendors?category=${category}&limit=4`,
      );
      if (excludeId) {
        return (res.vendors || []).filter((v) => v.id !== excludeId);
      }
      return res.vendors || [];
    } catch (error) {
      console.warn("SERVER fetchRelatedVendors:", error);
      return [];
    }
  },

  // ---------------- ORDERS ----------------
  fetchOrder: async (id: string) => {
    try {
      const res: { order: Order } = await serverFetch(`/orders/${id}`);
      return res.order;
    } catch (error) {
      console.warn("SERVER fetchOrder:", error);
      return null;
    }
  },

  fetchRecentOrders: async () => {
    try {
      const res: { orders: Order[] } = await serverFetch(
        `/users/orders/?limit=2`,
      );
      return res.orders || [];
    } catch (error) {
      console.warn("SERVER fetchRecentOrders:", error);
      return [];
    }
  },
};
