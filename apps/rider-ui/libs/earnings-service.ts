// libs/earnings-service.ts
import axios, { AxiosRequestConfig } from "axios";

const API_BASE = "/api/proxy";

// ============================================================================
// Types
// ============================================================================

export interface EarningsSummary {
  today: number;
  todayDeliveries: number;
  thisWeek: number;
  thisWeekDeliveries: number;
  thisMonth: number;
  thisMonthDeliveries: number;
  totalEarned: number;
  pendingPayout: number;
  availableBalance: number;
  walletBalance: number;
}

export interface EarningsBreakdown {
  baseFee: number;
  distanceFee: number;
  peakBonus: number;
  platformFee: number;
  riderEarnings: number;
}

export interface Transaction {
  id: string;
  type: "EARNING" | "PAYOUT" | "BONUS" | "ADJUSTMENT";
  amount: number;
  description: string;
  orderId?: string;
  breakdown?: EarningsBreakdown;
  status: "PENDING" | "COMPLETED" | "CANCELLED" | "FAILED";
  createdAt: string;
}

export interface TransactionPagination {
  transactions: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface EarningsRecord {
  id: string;
  orderId: string;
  baseFee: number;
  distanceFee: number;
  distanceKm: number;
  peakMultiplier: number;
  subtotal: number;
  platformFee: number;
  riderEarnings: number;
  waitTimeMinutes: number;
  waitTimeFee: number;
  completedAt: string;
}

export interface EarningsHistoryResponse {
  records: EarningsRecord[];
  summary: {
    totalEarnings: number;
    totalDeliveries: number;
    avgPerDelivery: number;
    peakEarnings: number;
  };
}

export interface Metrics {
  totalDeliveries: number;
  avgDeliveryTimeMinutes: number;
  rating: number;
  totalRatings: number;
  thisWeek: {
    deliveries: number;
    earnings: number;
    avgTimeMinutes: number;
  };
}

export interface PayoutInfo {
  nextPayoutDate: string;
  nextPayoutAmount: number;
  minimumBalance: number;
  paymentMethod: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  } | null;
  autoPayoutEnabled: boolean;
  autoPayoutDay: string;
  walletBalance: number;
  isFriday: boolean;
}

export interface Withdrawal {
  id: string;
  amount: number;
  requestType: "WEEKLY" | "MANUAL";
  status:
    | "PENDING"
    | "APPROVED"
    | "PROCESSING"
    | "COMPLETED"
    | "REJECTED"
    | "FAILED";
  bankName: string;
  accountNumber: string;
  accountName: string;
  scheduledDate: string;
  processedAt: string | null;
  adminNotes: string | null;
  createdAt: string;
}

export interface WithdrawalPagination {
  withdrawals: Withdrawal[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface WithdrawalRequest {
  amount: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export interface WithdrawalResponse {
  ok: boolean;
  message: string;
  data: {
    withdrawalId: string;
    amount: number;
    status: string;
    estimatedProcessing: string;
    feeApplied: number;
  };
}

// ============================================================================
// API Functions
// ============================================================================

async function fetchApi<T>(
  endpoint: string,
  options?: Partial<AxiosRequestConfig>,
): Promise<T> {
  const response = await axios.get(`${API_BASE}${endpoint}`, {
    withCredentials: true,
    ...options,
  });
  return response.data.data;
}

export const earningsService = {
  /**
   * Get earnings summary (today, week, month, total)
   */
  async getSummary(): Promise<EarningsSummary> {
    return fetchApi<EarningsSummary>("/riders/earnings/summary");
  },

  /**
   * Get transaction history with pagination
   */
  async getTransactions(
    page = 1,
    limit = 20,
    type?: "EARNING" | "PAYOUT" | "BONUS" | "ADJUSTMENT",
  ): Promise<TransactionPagination> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (type) params.append("type", type);
    return fetchApi<TransactionPagination>(
      `/riders/earnings/transactions?${params}`,
    );
  },

  /**
   * Get detailed earnings history
   */
  async getHistory(
    from?: string,
    to?: string,
  ): Promise<EarningsHistoryResponse> {
    const params = new URLSearchParams();
    if (from) params.append("from", from);
    if (to) params.append("to", to);
    return fetchApi<EarningsHistoryResponse>(
      `/riders/earnings/history?${params}`,
    );
  },

  /**
   * Get performance metrics
   */
  async getMetrics(): Promise<Metrics> {
    return fetchApi<Metrics>("/riders/earnings/metrics");
  },

  /**
   * Get payout information
   */
  async getPayoutInfo(): Promise<PayoutInfo> {
    return fetchApi<PayoutInfo>("/riders/payout-info");
  },

  /**
   * Request a withdrawal
   */
  async requestWithdrawal(
    request: WithdrawalRequest,
  ): Promise<WithdrawalResponse> {
    const response = await axios.post(
      `${API_BASE}/riders/earnings/withdraw`,
      request,
      {
        withCredentials: true,
      },
    );
    return response.data;
  },

  /**
   * Get withdrawal history
   */
  async getWithdrawalHistory(
    page = 1,
    limit = 10,
  ): Promise<WithdrawalPagination> {
    return fetchApi<WithdrawalPagination>(
      `/riders/earnings/withdrawals?page=${page}&limit=${limit}`,
    );
  },
};

export default earningsService;
