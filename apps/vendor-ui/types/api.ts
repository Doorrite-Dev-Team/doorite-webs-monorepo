// Shared API types for vendor-ui
// Consolidating types from actions/api.ts and actions/server.ts

export type Period = "daily" | "weekly" | "monthly";

// ============================================================================
// Dashboard Types
// ============================================================================

export interface DashboardData {
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

// ============================================================================
// Vendor Stats Types
// ============================================================================

export interface VendorStats {
  stats: {
    rating: number;
    totalOrders: number;
    totalProducts: number;
    activeProducts: number;
    memberSince: string;
  };
}

// ============================================================================
// Orders Types
// ============================================================================

export interface Order {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  customer: {
    id: string;
    fullName: string;
    profileImageUrl?: string;
  };
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    product: {
      name: string;
      imageUrl?: string;
    };
  }>;
}

export interface OrdersResponse {
  orders: Order[];
  pagination: {
    totalOrders: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}

// ============================================================================
// Products Types
// ============================================================================

export interface PaginationData {
  totalProducts: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface ProductsResponse {
  products: Product[];
  pagination: PaginationData;
}

// ============================================================================
// Earnings Types
// ============================================================================

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

export interface ChartDataPoint {
  date: string;
  amount: number;
}

export interface Transaction {
  id: string;
  orderId: string;
  customerName: string;
  customerAvatar: string | null;
  amount: number;
  date: string;
  type?: string;
  status?: string;
  createdAt?: string;
}

// ============================================================================
// Reviews Types
// ============================================================================

export interface VendorReviewsResponse {
  reviewsData: {
    reviews: Review[];
    averageRating: number;
    totalReviews: number;
    ratingDistribution: RatingDistribution[];
  };
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  likes: number;
  dislikes: number;
}

export interface RatingDistribution {
  stars: number;
  count: number;
  percentage: number;
}
