import apiClient from "@/libs/api/client";
import type {
  DashboardData,
  OrdersResponse,
  ProductsResponse,
  WalletData,
  EarningsData,
  VendorStats,
  VendorReviewsResponse,
} from "@/types/api";

export type {
  DashboardData,
  OrdersResponse,
  ProductsResponse,
  WalletData,
  EarningsData,
  VendorStats,
  VendorReviewsResponse,
};

const api = {
  fetchProducts: async (
    page: number,
    limit: number,
  ): Promise<ProductsResponse> => {
    const response = await apiClient.get(
      `vendors/products?page=${page}&limit=${limit}`,
    );

    if (!response.data?.ok) {
      const errorMessage = response.data?.message || "Failed to fetch products";
      throw new Error(errorMessage);
    }

    return {
      products: response.data.products || [],
      pagination: response.data.pagination || {
        totalProducts: 0,
        totalPages: 0,
        currentPage: page,
        pageSize: limit,
      },
    };
  },
  fetchOrders: async (
    page: number = 1,
    limit: number = 10,
  ): Promise<OrdersResponse> => {
    const response = await apiClient.get(
      `/vendors/orders?page=${page}&limit=${limit}`,
    );

    if (!response.data?.ok) {
      const errorMessage = response.data?.message || "Failed to fetch orders";
      throw new Error(errorMessage);
    }

    return {
      orders: response.data?.orders || [],
      pagination: response.data?.pagination || {
        totalOrders: 0,
        totalPages: 0,
        currentPage: page,
        pageSize: limit,
      },
    };
  },
  fetchDashboardData: async (): Promise<DashboardData> => {
    const response = await apiClient.get("/vendors/dashboard");

    if (!response.data?.ok) {
      const errorMessage = response.data?.message || "Failed to fetch dashboard data";
      throw new Error(errorMessage);
    }

    return response.data;
  },
  fetchOrderDetails: async (orderId: string): Promise<OrderDetails> => {
    const response = await apiClient.get(`/vendors/orders/${orderId}`);

    if (!response.data?.ok) {
      const errorMessage = response.data?.message || "Failed to fetch order details";
      throw new Error(errorMessage);
    }

    return response.data.order;
  },
  fetchEarnings: async (period: Period): Promise<EarningsData> => {
    const response = await apiClient.get(`/vendors/earnings?period=${period}`);

    if (!response.data?.ok) {
      const errorMessage = response.data?.message || "Failed to fetch earnings data";
      throw new Error(errorMessage);
    }

    return response.data;
  },
  fetchVendorStats: async (): Promise<VendorStats> => {
    const response = await apiClient.get("/vendors/stats");

    if (!response.data?.ok) {
      const errorMessage = response.data?.message || "Failed to fetch vendor stats";
      throw new Error(errorMessage);
    }

    return response.data;
  },
  fetchVendorReviews: async (
    vendorId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<VendorReviewsResponse> => {
    // Validate vendorId is a valid UUID format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!vendorId || !uuidRegex.test(vendorId)) {
      throw new Error("Invalid vendor ID");
    }

    const response = await apiClient.get(
      `/vendors/${vendorId}/reviews?page=${page}&limit=${limit}`,
    );

    if (!response.data?.ok) {
      const errorMessage = response.data?.message || "Failed to fetch vendor reviews";
      throw new Error(errorMessage);
    }

    return response.data;
  },
};

export default api;
