"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  AlertCircle,
  Bike,
  CheckCircle2,
  Clock3,
  CreditCard,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  QrCode,
  RefreshCw,
  TimerReset,
  XCircle,
} from "lucide-react";
import { toast } from "@repo/ui/components/sonner";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import { cn } from "@repo/ui/lib/utils";
import DeliveryMap from "@/components/orders/DeliveryMap";
import DeliveryQrDisplay from "@/components/orders/DeliveryQrDisplay";
import { PaymentVerificationDialog } from "@/components/orders/PaymentVerificationDialog";
import { ReceiptDownload } from "@/components/order/ReceiptDownload";
import RiderInfoCard from "@/components/orders/RiderInfoCard";
import { ChatDialog } from "@/components/orders/ChatDialog";
import { api } from "@/actions/api";
import { apiClient } from "@/libs/api/api-client";
import { formatTime, getStatusLabel } from "@/libs/helper";

function formatNaira(value: number) {
  return `₦${value.toLocaleString()}`;
}

const STATUS_STEPS: OrderStatus[] = [
  "PENDING",
  "ACCEPTED",
  "PREPARING",
  "READY_FOR_PICKUP",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

function StatusStepper({ status }: { status: OrderStatus }) {
  const activeIndex = STATUS_STEPS.indexOf(status);

  return (
    <div className="space-y-3">
      {STATUS_STEPS.map((step, index) => {
        const active = index <= activeIndex;
        const current = status === step;
        return (
          <div key={step} className="flex items-start gap-3">
            <div
              className={cn(
                "mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full border transition",
                active
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-card text-muted-foreground",
              )}
            >
              {current ? (
                <div className="h-2.5 w-2.5 rounded-full bg-current" />
              ) : (
                <CheckCircle2 className="h-4.5 w-4.5" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "text-sm font-medium",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {getStatusLabel(step)}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {current ? "Current status" : active ? "Completed" : "Pending"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TimelineCard({ order }: { order: Order }) {
  return (
    <Card className="border-border bg-card shadow-sm">
      <CardContent className="p-4">
        <div className="mb-4 flex items-center gap-2">
          <TimerReset className="h-4.5 w-4.5 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            Live progress
          </h3>
        </div>
        <StatusStepper status={order.status} />
      </CardContent>
    </Card>
  );
}

function OrderItemsCard({ order }: { order: Order }) {
  return (
    <Card className="border-border bg-card shadow-sm">
      <CardContent className="p-4">
        <div className="mb-4 flex items-center gap-2">
          <Package className="h-4.5 w-4.5 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Order items</h3>
        </div>

        <div className="space-y-3">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-2xl border border-border bg-background p-3"
            >
              <div className="h-14 w-14 overflow-hidden rounded-2xl bg-muted">
                {(item as { imageUrl?: string }).imageUrl ? (
                  <Image
                    src={(item as { imageUrl?: string }).imageUrl!}
                    alt={item.name}
                    width={56}
                    height={56}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {item.name}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Qty {item.quantity}
                </p>
              </div>

              <p className="shrink-0 text-sm font-semibold text-primary">
                {formatNaira(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl bg-muted p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="text-base font-semibold text-foreground">
              {formatNaira(order.totalAmount)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DeliverySummaryCard({
  order,
  estimatedDeliveryTime,
}: {
  order: Order;
  estimatedDeliveryTime: string;
}) {
  return (
    <Card className="overflow-hidden border-border bg-card shadow-sm">
      <CardContent className="p-0">
        <div className="border-b border-border bg-gradient-to-r from-primary/10 via-background to-secondary/10 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                Order #{order.id.slice(-8).toUpperCase()}
              </p>
              <h2 className="mt-1 text-lg font-semibold text-foreground">
                {getStatusLabel(order.status)}
              </h2>
            </div>

            <Badge
              className={cn(
                "rounded-full px-3 py-1 text-[11px] font-semibold",
                order.status === "CANCELLED"
                  ? "bg-destructive text-destructive-foreground"
                  : order.status === "DELIVERED"
                    ? "bg-secondary text-foreground"
                    : "bg-primary text-primary-foreground",
              )}
            >
              {getStatusLabel(order.status)}
            </Badge>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-card p-3 shadow-sm">
              <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                Placed
              </p>
              <p className="mt-1 text-sm font-semibold">
                {formatTime(order.placedAt)}
              </p>
            </div>
            <div className="rounded-2xl bg-card p-3 shadow-sm">
              <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                ETA
              </p>
              <p className="mt-1 text-sm font-semibold">
                {estimatedDeliveryTime}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="rounded-2xl border border-border bg-background p-4">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Delivery address
                </p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {order.deliveryAddress.address || "Address unavailable"}
                  {(order.deliveryAddress as { city?: string }).city
                    ? `, ${(order.deliveryAddress as { city?: string }).city}`
                    : ""}
                  {order.deliveryAddress.state
                    ? `, ${order.deliveryAddress.state}`
                    : ""}
                  {order.deliveryAddress.country
                    ? `, ${order.deliveryAddress.country}`
                    : ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SupportCard({ onOpenChat }: { onOpenChat: () => void }) {
  return (
    <Card className="border-border bg-card shadow-sm">
      <CardContent className="p-4">
        <div className="mb-4 flex items-center gap-2">
          <MessageCircle className="h-4.5 w-4.5 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Support</h3>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <a href="tel:+2348000000000">
            <Button variant="outline" className="h-12 w-full rounded-2xl gap-2">
              <Phone className="h-4 w-4" />
              Call support
            </Button>
          </a>
          <Button
            variant="outline"
            className="h-12 w-full rounded-2xl gap-2"
            onClick={onOpenChat}
          >
            <MessageCircle className="h-4 w-4" />
            Live chat
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Header({
  order,
  onBack,
  onRefresh,
  onCancel,
  canCancel,
  isLoading,
}: {
  order: Order;
  onBack: () => void;
  onRefresh: () => void;
  onCancel: () => void;
  canCancel: boolean;
  isLoading: boolean;
}) {
  return (
    <div className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto max-w-5xl px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={onBack}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border bg-card shadow-sm transition active:scale-95"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Order tracking
            </p>
            <h1 className="truncate text-sm font-semibold leading-tight">
              #{order.id.slice(-8).toUpperCase()}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {canCancel ? (
              <Button
                size="sm"
                variant="outline"
                onClick={onCancel}
                className="h-10 rounded-full border-destructive/20 text-destructive hover:bg-destructive/10"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            ) : null}

            <Button
              size="sm"
              variant="outline"
              onClick={onRefresh}
              disabled={isLoading}
              className="h-10 rounded-full"
            >
              <RefreshCw
                className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")}
              />
              Refresh
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderTrackingClient({
  order: initialOrder,
}: {
  order: Order;
}) {
  const router = useRouter();
  const [showQrScanner, setShowQrScanner] = React.useState(false);
  const [showVerificationDialog, setShowVerificationDialog] =
    React.useState(false);
  const [showCancelDialog, setShowCancelDialog] = React.useState(false);
  const [showChat, setShowChat] = React.useState(false);
  const [verificationStatus, setVerificationStatus] = React.useState<
    "verifying" | "success" | "failed" | "error"
  >("verifying");
  const [verificationMessage, setVerificationMessage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const activeOrder = initialOrder;

  const isOutForDelivery = activeOrder.status === "OUT_FOR_DELIVERY";
  const isDelivered = activeOrder.status === "DELIVERED";
  const isCancelled = activeOrder.status === "CANCELLED";
  const isPaymentPending =
    activeOrder.paymentStatus === "PENDING" &&
    activeOrder.status === "PENDING_PAYMENT";

  const canCancel =
    !isCancelled &&
    !isDelivered &&
    !isOutForDelivery &&
    (activeOrder.status === "PENDING" ||
      activeOrder.status === "PENDING_PAYMENT");

  const estimatedDeliveryTime = React.useMemo(() => {
    if (activeOrder.deliveredAt) {
      return new Date(activeOrder.deliveredAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    if (activeOrder.estimatedDelivery)
      return formatTime(activeOrder.estimatedDelivery);

    const placed = new Date(activeOrder.placedAt);
    return formatTime(new Date(placed.getTime() + 45 * 60000).toISOString());
  }, [activeOrder]);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await api.fetchOrder(activeOrder.id);
      toast.success("Order refreshed");
    } finally {
      setIsLoading(false);
    }
  };

  const initializePayment = async () => {
    setVerificationStatus("verifying");
    setVerificationMessage("Preparing payment...");
    setShowVerificationDialog(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await apiClient.post(
        `/orders/${activeOrder.id}/payments/create-intent`,
      );

      if (!res.ok) {
        setVerificationStatus("failed");
        setVerificationMessage(res.message || "Failed to initialize payment");
        return;
      }

      const { authorization_url } = res.data;
      if (authorization_url) {
        window.location.href = authorization_url;
      } else {
        setVerificationStatus("failed");
        setVerificationMessage("Invalid payment response");
      }
    } catch (error) {
      console.error("Payment initialization error:", error);
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      setVerificationStatus("failed");
      setVerificationMessage(
        axiosError?.response?.data?.message || "Failed to initialize payment",
      );
    }
  };

  const cancelOrder = async () => {
    setIsLoading(true);
    try {
      const result = await api.cancelOrder(activeOrder.id);
      if (!result.success) {
        toast.error(result.error || "Failed to cancel order");
        return;
      }
      toast.success("Order cancelled successfully");
      setShowCancelDialog(false);
      router.push("/order");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
      setShowCancelDialog(false);
    }
  };

  if (showQrScanner) {
    return (
      <DeliveryQrDisplay
        orderId={activeOrder.id}
        verificationCode={activeOrder.deliveryVerificationCode}
        onClose={() => setShowQrScanner(false)}
        onVerified={() => {
          setShowQrScanner(false);
          toast.success("Delivery verified");
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background pb-28 text-foreground">
      <Header
        order={activeOrder}
        onBack={() => router.back()}
        onRefresh={handleRefresh}
        onCancel={() => setShowCancelDialog(true)}
        canCancel={canCancel}
        isLoading={isLoading}
      />

      <div className="mx-auto grid max-w-5xl gap-5 px-4 py-5">
        {isPaymentPending ? (
          <Card className="border-l-4 border-l-secondary bg-secondary/10 shadow-sm">
            <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Payment pending
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Complete payment to process this order.
                  </p>
                </div>
              </div>
              <Button
                onClick={initializePayment}
                className="h-11 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Complete payment
              </Button>
            </CardContent>
          </Card>
        ) : null}

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
        >
          <DeliverySummaryCard
            order={activeOrder}
            estimatedDeliveryTime={estimatedDeliveryTime}
          />
        </motion.div>

        <TimelineCard order={activeOrder} />

        {isOutForDelivery && activeOrder.riderId ? (
          <Card className="border-border bg-card shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="border-b border-border bg-muted/40 p-4">
                <div className="flex items-center gap-2">
                  <Bike className="h-4.5 w-4.5 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">
                    Rider and live map
                  </h3>
                </div>
              </div>
              <DeliveryMap
                orderId={activeOrder.id}
                deliveryAddress={activeOrder.deliveryAddress}
              />
              <RiderInfoCard
                orderId={activeOrder.id}
                riderId={activeOrder.riderId}
              />
            </CardContent>
          </Card>
        ) : null}

        <OrderItemsCard order={activeOrder} />

        <Card className="border-border bg-card shadow-sm">
          <CardContent className="p-4">
            <div className="mb-4 flex items-center gap-2">
              <Clock3 className="h-4.5 w-4.5 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                Delivery details
              </h3>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-muted p-3">
                <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  Placed at
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {formatTime(activeOrder.placedAt)}
                </p>
              </div>
              <div className="rounded-2xl bg-muted p-3">
                <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  ETA
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {estimatedDeliveryTime}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <SupportCard onOpenChat={() => setShowChat(true)} />

        {isDelivered && (
          <div className="mt-2">
            <ReceiptDownload order={activeOrder} />
          </div>
        )}
      </div>

      {isOutForDelivery && activeOrder.deliveryVerificationCode ? (
        <button
          onClick={() => setShowQrScanner(true)}
          className="fixed bottom-6 right-6 z-50 grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground shadow-2xl shadow-primary/25 transition hover:scale-105 active:scale-95"
          aria-label="Open QR scanner"
        >
          <QrCode className="h-7 w-7" />
        </button>
      ) : null}

      <PaymentVerificationDialog
        open={showVerificationDialog}
        status={verificationStatus}
        message={verificationMessage}
        orderId={activeOrder.id}
        onRetry={initializePayment}
        onCloseAction={() => setShowVerificationDialog(false)}
      />

      <ChatDialog
        open={showChat}
        onOpenChange={setShowChat}
        orderId={activeOrder.id}
        riderName={activeOrder.riderId ? undefined : "Support"}
      />

      {showCancelDialog ? (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-black/50 p-4">
          <Card className="w-full max-w-md border-border bg-card shadow-2xl">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-destructive/10 text-destructive">
                  <XCircle className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-foreground">
                    Cancel order?
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex gap-3">
                <Button
                  variant="outline"
                  className="h-11 flex-1 rounded-2xl"
                  onClick={() => setShowCancelDialog(false)}
                >
                  Keep order
                </Button>
                <Button
                  className="h-11 flex-1 rounded-2xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={cancelOrder}
                >
                  Yes, cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
