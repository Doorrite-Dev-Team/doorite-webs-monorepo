// store/earningsAtom.ts
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import {
  EarningsSummary,
  Transaction,
  Metrics,
  PayoutInfo,
  Withdrawal,
  earningsService,
} from "@/libs/earnings-service";

// ============================================================================
// Loading State
// ============================================================================

export const earningsLoadingAtom = atom<boolean>(false);

// ============================================================================
// Earnings Summary
// ============================================================================

const defaultSummary: EarningsSummary = {
  today: 0,
  todayDeliveries: 0,
  thisWeek: 0,
  thisWeekDeliveries: 0,
  thisMonth: 0,
  thisMonthDeliveries: 0,
  totalEarned: 0,
  pendingPayout: 0,
  availableBalance: 0,
  walletBalance: 0,
};

export const earningsSummaryAtom = atomWithStorage<{
  data: EarningsSummary;
  lastFetch: string | null;
}>("rider-earnings-summary", { data: defaultSummary, lastFetch: null });

export const fetchEarningsSummaryAtom = atom(null, async (get, set) => {
  set(earningsLoadingAtom, true);
  try {
    const data = await earningsService.getSummary();
    set(earningsSummaryAtom, { data, lastFetch: new Date().toISOString() });
  } catch (error) {
    console.error("Failed to fetch earnings summary:", error);
  } finally {
    set(earningsLoadingAtom, false);
  }
});

// ============================================================================
// Transactions
// ============================================================================

interface TransactionState {
  transactions: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  lastFetch: string | null;
}

const defaultTransactionState: TransactionState = {
  transactions: [],
  pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
  lastFetch: null,
};

export const transactionsAtom = atomWithStorage<TransactionState>(
  "rider-transactions",
  defaultTransactionState,
);

export const fetchTransactionsAtom = atom(
  null,
  async (
    get,
    set,
    {
      page = 1,
      limit = 20,
      type,
    }: { page?: number; limit?: number; type?: string } = {},
  ) => {
    set(earningsLoadingAtom, true);
    try {
      const result = await earningsService.getTransactions(
        page,
        limit,
        type as any,
      );
      set(transactionsAtom, {
        transactions: result.transactions,
        pagination: result.pagination,
        lastFetch: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      set(earningsLoadingAtom, false);
    }
  },
);

// ============================================================================
// Metrics
// ============================================================================

const defaultMetrics: Metrics = {
  totalDeliveries: 0,
  avgDeliveryTimeMinutes: 0,
  rating: 0,
  totalRatings: 0,
  thisWeek: {
    deliveries: 0,
    earnings: 0,
    avgTimeMinutes: 0,
  },
};

export const metricsAtom = atomWithStorage<{
  data: Metrics;
  lastFetch: string | null;
}>("rider-metrics", { data: defaultMetrics, lastFetch: null });

export const fetchMetricsAtom = atom(null, async (get, set) => {
  set(earningsLoadingAtom, true);
  try {
    const data = await earningsService.getMetrics();
    set(metricsAtom, { data, lastFetch: new Date().toISOString() });
  } catch (error) {
    console.error("Failed to fetch metrics:", error);
  } finally {
    set(earningsLoadingAtom, false);
  }
});

// ============================================================================
// Payout Info
// ============================================================================

const defaultPayoutInfo: PayoutInfo = {
  nextPayoutDate: "",
  nextPayoutAmount: 0,
  minimumBalance: 2000,
  paymentMethod: null,
  autoPayoutEnabled: false,
  autoPayoutDay: "friday",
  walletBalance: 0,
  isFriday: false,
};

export const payoutInfoAtom = atomWithStorage<{
  data: PayoutInfo;
  lastFetch: string | null;
}>("rider-payout-info", { data: defaultPayoutInfo, lastFetch: null });

export const fetchPayoutInfoAtom = atom(null, async (get, set) => {
  set(earningsLoadingAtom, true);
  try {
    const data = await earningsService.getPayoutInfo();
    set(payoutInfoAtom, { data, lastFetch: new Date().toISOString() });
  } catch (error) {
    console.error("Failed to fetch payout info:", error);
  } finally {
    set(earningsLoadingAtom, false);
  }
});

// ============================================================================
// Withdrawal History
// ============================================================================

interface WithdrawalState {
  withdrawals: Withdrawal[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  lastFetch: string | null;
}

const defaultWithdrawalState: WithdrawalState = {
  withdrawals: [],
  pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
  lastFetch: null,
};

export const withdrawalsAtom = atomWithStorage<WithdrawalState>(
  "rider-withdrawals",
  defaultWithdrawalState,
);

export const fetchWithdrawalsAtom = atom(
  null,
  async (
    get,
    set,
    { page = 1, limit = 10 }: { page?: number; limit?: number } = {},
  ) => {
    set(earningsLoadingAtom, true);
    try {
      const result = await earningsService.getWithdrawalHistory(page, limit);
      set(withdrawalsAtom, {
        withdrawals: result.withdrawals,
        pagination: result.pagination,
        lastFetch: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Failed to fetch withdrawals:", error);
    } finally {
      set(earningsLoadingAtom, false);
    }
  },
);

// ============================================================================
// Request Withdrawal Action
// ============================================================================

export const requestWithdrawalAtom = atom(
  null,
  async (
    get,
    set,
    request: {
      amount: number;
      bankName: string;
      accountNumber: string;
      accountName: string;
    },
  ) => {
    set(earningsLoadingAtom, true);
    try {
      const result = await earningsService.requestWithdrawal(request);
      return result;
    } catch (error) {
      console.error("Failed to request withdrawal:", error);
      throw error;
    } finally {
      set(earningsLoadingAtom, false);
    }
  },
);

// ============================================================================
// Fetch All Earnings Data
// ============================================================================

export const fetchAllEarningsDataAtom = atom(null, async (get, set) => {
  set(earningsLoadingAtom, true);
  try {
    const [summary, metrics, payoutInfo, transactions] = await Promise.all([
      earningsService.getSummary(),
      earningsService.getMetrics(),
      earningsService.getPayoutInfo(),
      earningsService.getTransactions(1, 20),
    ]);

    set(earningsSummaryAtom, {
      data: summary,
      lastFetch: new Date().toISOString(),
    });
    set(metricsAtom, { data: metrics, lastFetch: new Date().toISOString() });
    set(payoutInfoAtom, {
      data: payoutInfo,
      lastFetch: new Date().toISOString(),
    });
    set(transactionsAtom, {
      transactions: transactions.transactions,
      pagination: transactions.pagination,
      lastFetch: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to fetch earnings data:", error);
  } finally {
    set(earningsLoadingAtom, false);
  }
});
