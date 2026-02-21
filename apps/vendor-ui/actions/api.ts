import apiClient from "@/libs/api/client";

interface DashboardData {
  vendor: {
    id: string;
    businessName: string;
    email: string;
    phoneNumber: string;
    logoUrl?: string;
    rating?: number;
    openingTime?: string;
    closingTime?: string;
    address: {
      address: string;
      state?: string;
      country?: string;
    };
  };
  stats: {
    todayOrders: number;
    todayEarnings: number;
    availableItems: number;
  };
  activeOrders: Array<{
    id: string;
    orderId: string;
    customerName: string;
    customerAvatar?: string;
    status: string;
    totalAmount: number;
    itemCount: number;
    firstItemName: string;
    createdAt: string;
  }>;
}

interface OrdersResponse {
  orders: Order[];
  pagination: {
    totalOrders: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}

interface PaginationData {
  totalProducts: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface ProductsResponse {
  products: Product[];
  pagination: PaginationData;
}

export interface WalletData {
  balance: number;
  totalEarned: number;
  totalWithdrawn: number;
}

export interface EarningsData {
  summary: {
    totalEarnings: number;
    percentageChange: number;
    period: Period;
  };
  wallet: WalletData;
  chartData: ChartDataPoint[];
  recentTransactions: Transaction[];
  pendingPayout: number;
}

const api = {
  fetchProducts: async (
    page: number,
    limit: number,
  ): Promise<ProductsResponse> => {
    const response = await apiClient.get(
      `vendors/products?page=${page}&limit=${limit}`,
    );

    if (!response.data?.ok) {
      throw new Error("Failed to fetch products");
    }

    console.log(response.data);

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

    console.log(response.data);
    return response.data.orders;
  },
  fetchDashboardData: async (): Promise<DashboardData> => {
    const response = await apiClient.get("/vendors/dashboard");
    return response.data;
  },
  fetchOrderDetails: async (orderId: string): Promise<OrderDetails> => {
    const response = await apiClient.get(`/vendors/orders/${orderId}`);
    return response.data.order;
  },
  fetchEarnings: async (period: Period): Promise<EarningsData> => {
    const response = await apiClient.get(`/vendors/earnings?period=${period}`);

    if (!response.data?.ok) {
      throw new Error("Failed to fetch earnings data");
    }

    return response.data;
  },
};

export default api;
