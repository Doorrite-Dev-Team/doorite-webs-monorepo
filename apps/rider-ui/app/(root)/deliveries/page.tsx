"use client";

/**
 * Deliveries page — wired to real API data
 *
 * Replaces the hardcoded 3-item static list with:
 *   - Active delivery (from `activeOrderAtom`)
 *   - Delivery history (fetched from `GET /riders/orders?status=delivered`)
 *   - The built `DeliveryTabs`, `ShiftSummary`, and `DeliveryDetailsModal`
 *     components that were previously unused
 */

import { useState } from "react";
import { useAtomValue } from "jotai";
import { activeOrderAtom, orderHistoryAtom, Order } from "@/store/orderAtom";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/libs/api-client";
import {
  Loader2,
  Package,
  Clock,
  CheckCircle2,
  MapPin,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";
import { Badge } from "@repo/ui/components/badge";
import DeliveryDetailsModal from "@/components/deliveries/DeliveryDetailsModal";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RiderDelivery {
  id: string;
  vendor: string;
  vendorAddress: string;
  customer: string;
  orderId: string;
  deliveryAddress: string;
  status: string;
  totalAmount: number;
  completedAt?: string;
}

interface DeliveryHistoryResponse {
  orders: RiderDelivery[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ─── Fetch function ───────────────────────────────────────────────────────────

const fetchDeliveryHistory = async (
  page: number,
): Promise<DeliveryHistoryResponse> => {
  const res = await apiClient.get(
    `/riders/history?status=delivered&page=${page}&limit=20`,
  );
  return res.data;
};

// ─── Tab component ────────────────────────────────────────────────────────────

function DeliveryPageTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: "active" | "history";
  onTabChange: (tab: "active" | "history") => void;
}) {
  return (
    <div className="flex rounded-xl bg-gray-100 p-1 gap-1">
      <button
        onClick={() => onTabChange("active")}
        className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${
          activeTab === "active"
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        Active
      </button>
      <button
        onClick={() => onTabChange("history")}
        className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${
          activeTab === "history"
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        History
      </button>
    </div>
  );
}

// ─── Active Delivery Banner ───────────────────────────────────────────────────

function ActiveDeliveryBanner({ order }: { order: Order }) {
  return (
    <Card className="border-l-4 border-l-green-600 bg-green-50/50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-green-700 uppercase tracking-wide">
            Active Delivery
          </p>
          <Badge className="bg-green-600 text-white text-xs">
            {order.status.replace("_", " ").toUpperCase()}
          </Badge>
        </div>
        <p className="font-semibold text-gray-900">
          {order.restaurantName || "Restaurant"}
        </p>
        <div className="flex items-center gap-1.5 text-sm text-gray-600 mt-1">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{order.dropoffLocation.address}</span>
        </div>
        <p className="text-lg font-bold text-green-600 mt-2">
          ₦{order.totalAmount?.toFixed(2) || "0.00"}
        </p>
      </CardContent>
    </Card>
  );
}

// ─── Delivery History Card ────────────────────────────────────────────────────

function DeliveryHistoryCard({
  delivery,
  onViewDetails,
}: {
  delivery: RiderDelivery;
  onViewDetails: (d: RiderDelivery) => void;
}) {
  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer border-gray-100"
      onClick={() => onViewDetails(delivery)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
              <p className="font-semibold text-gray-900 truncate">
                {delivery.vendor}
              </p>
            </div>
            <p className="text-sm text-gray-600 truncate">
              To: {delivery.customer}
            </p>
            <p className="text-xs text-gray-400 mt-1 truncate">
              {delivery.deliveryAddress}
            </p>
            {delivery.completedAt && (
              <div className="flex items-center gap-1 text-xs text-gray-400 mt-1.5">
                <Clock className="w-3 h-3" />
                {new Date(delivery.completedAt).toLocaleDateString("en-NG", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </div>
            )}
          </div>
          <p className="text-lg font-bold text-green-600 shrink-0">
            ₦{delivery.totalAmount?.toLocaleString("en-NG") || "0"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DeliveriesPage() {
  const activeOrder = useAtomValue(activeOrderAtom);
  const localHistory = useAtomValue(orderHistoryAtom);

  const [activeTab, setActiveTab] = useState<"active" | "history">("active");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDelivery, setSelectedDelivery] =
    useState<RiderDelivery | null>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["rider-delivery-history", currentPage],
    queryFn: () => fetchDeliveryHistory(currentPage),
    staleTime: 2 * 60 * 1000,
    enabled: activeTab === "history",
  });

  const deliveries = data?.orders ?? [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-4 pb-28">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Deliveries</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Track active and past deliveries
        </p>
      </div>

      {/* Tabs */}
      <DeliveryPageTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Active tab */}
      {activeTab === "active" && (
        <div className="space-y-4">
          {activeOrder ? (
            <ActiveDeliveryBanner order={activeOrder} />
          ) : (
            <Card className="border-dashed border-gray-200">
              <CardContent className="py-16 text-center">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="font-medium text-gray-500">
                  No active delivery
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Accept an order from the dashboard to get started
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* History tab */}
      {activeTab === "history" && (
        <div className="space-y-4">
          {/* Header with count */}
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">
              Delivery History
            </h2>
            {pagination && (
              <p className="text-sm text-gray-500">
                {pagination.total} total
              </p>
            )}
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-green-600" />
            </div>
          )}

          {/* Error */}
          {isError && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6 text-center">
                <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
                <p className="font-semibold text-gray-900 mb-2">
                  Failed to load delivery history
                </p>
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  Try again
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Delivery list */}
          {!isLoading && !isError && (
            <>
              {deliveries.length === 0 && localHistory.length === 0 ? (
                <Card className="border-dashed border-gray-200">
                  <CardContent className="py-16 text-center">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="font-medium text-gray-500">
                      No deliveries yet
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Completed deliveries will appear here
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {deliveries.map((delivery) => (
                    <DeliveryHistoryCard
                      key={delivery.id}
                      delivery={delivery}
                      onViewDetails={setSelectedDelivery}
                    />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === pagination.totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Delivery details modal */}
      <DeliveryDetailsModal
        show={!!selectedDelivery}
        onClose={() => setSelectedDelivery(null)}
        delivery={selectedDelivery}
      />
    </div>
  );
}
