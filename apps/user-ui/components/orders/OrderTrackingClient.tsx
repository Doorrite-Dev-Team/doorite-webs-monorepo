"use client";

import { toast } from "@repo/ui/components/sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  CreditCard,
  Loader2,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  QrCode,
  RefreshCw,
  Store,
} from "lucide-react";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import DeliveryMap from "@/components/orders/DeliveryMap";
import DeliveryQrDisplay from "@/components/orders/DeliveryQrDisplay";
import { PaymentVerificationDialog } from "@/components/orders/PaymentVerificationDialog";
import RiderInfoCard from "@/components/orders/RiderInfoCard";
import { api } from "@/libs/api";
import { apiClient } from "@/libs/api-client";
import { formatTime, getStatusColor, getStatusLabel } from "@/libs/helper";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import { Separator } from "@repo/ui/components/separator";

interface OrderTrackingClientProps {
  order: Order;
}

type VerificationStatus = "verifying" | "success" | "failed" | "error";

export default function OrderTrackingClient({
  order: initialOrder,
}: OrderTrackingClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showQrScanner, setShowQrScanner] = React.useState(false);

  // Payment verification states
  const [showVerificationDialog, setShowVerificationDialog] =
    React.useState(false);
  const [verificationStatus, setVerificationStatus] =
    React.useState<VerificationStatus>("verifying");
  const [verificationMessage, setVerificationMessage] =
    React.useState<string>("");

  const {
    data: order,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["order", initialOrder.id],
    queryFn: () => api.fetchOrder(initialOrder.id),
    initialData: initialOrder,
    refetchInterval: 30000,
    staleTime: 10000,
  });

  // Payment verification mutation
  const { mutate: verifyPayment } = useMutation({
    mutationFn: async (reference: string) => {
      const res = await apiClient.post(
        `/orders/${order?.id}/payments/verify?reference=${reference}`,
      );
      return res.data;
    },
    onSuccess: (data) => {
      if (data.status === "SUCCESSFUL") {
        setVerificationStatus("success");
        setVerificationMessage(
          data.message || "Payment confirmed successfully!",
        );
        refetch(); // Refresh order data
      } else if (data.status === "FAILED") {
        setVerificationStatus("failed");
        setVerificationMessage(data.message || "Payment was not successful.");
      } else {
        setVerificationStatus("error");
        setVerificationMessage("Unable to verify payment status.");
      }
    },
    onError: (error: any) => {
      console.error("Verification error:", error);
      setVerificationStatus("error");
      setVerificationMessage(
        error?.response?.data?.message ||
          "Failed to verify payment. Please try again.",
      );
    },
  });

  // Payment initialization mutation (for retry)
  const { mutate: initializePayment, isPending: isInitializingPayment } =
    useMutation({
      mutationFn: async () => {
        const res = await apiClient.post(
          `/orders/${order?.id}/payments/create-intent`,
        );
        return res.data;
      },
      onSuccess: (data) => {
        if (data.authorization_url) {
          toast.success("Redirecting to payment gateway...");
          window.location.href = data.authorization_url;
        } else {
          toast.error("Could not retrieve payment link.");
        }
      },
      onError: (error) => {
        console.error(error);
        toast.error("Failed to initialize payment. Please try again.");
      },
    });

  // Handle payment verification on mount if verify=true
  React.useEffect(() => {
    const shouldVerify = searchParams.get("verify");
    const reference =
      searchParams.get("reference") || searchParams.get("trxref");

    if (shouldVerify === "true" && reference) {
      setShowVerificationDialog(true);
      setVerificationStatus("verifying");
      verifyPayment(reference);

      // Clean up URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, [searchParams, verifyPayment]);

  if (!order) notFound();

  console.log(order);

  const isOutForDelivery = order.status === "OUT_FOR_DELIVERY";
  const isDelivered = order.status === "DELIVERED";
  const isCancelled = order.status === "CANCELLED";

  // Payment status checks
  const isPaymentPending =
    order.paymentStatus === "PENDING" && order.status === "PENDING_PAYMENT";

  const estimatedDeliveryTime = React.useMemo(() => {
    if (order.deliveredAt) {
      return new Date(order.deliveredAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    if (order.estimatedDelivery) {
      return formatTime(order.estimatedDelivery);
    }
    const placedTime = new Date(order.placedAt);
    const estimated = new Date(placedTime.getTime() + 45 * 60000);
    return formatTime(estimated.toISOString());
  }, [order]);

  if (showQrScanner) {
    return (
      <DeliveryQrDisplay
        orderId={order.id}
        verificationCode={order.deliveryVerificationCode}
        onClose={() => setShowQrScanner(false)}
        onVerified={() => {
          refetch();
          setShowQrScanner(false);
        }}
      />
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 pb-24">
        <div className="container max-w-4xl mx-auto">
          {/* Header */}
          <div className="sticky top-0 z-20 bg-white border-b shadow-sm">
            <div className="px-4 py-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => router.back()}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="font-medium">Back</span>
                </button>

                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      isCancelled
                        ? "destructive"
                        : isDelivered
                          ? "secondary"
                          : "default"
                    }
                    className={`${getStatusColor(order.status)} text-sm`}
                  >
                    {getStatusLabel(order.status)}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => refetch()}
                    disabled={isLoading}
                    className="gap-1"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                    />
                  </Button>
                </div>
              </div>

              <div className="mt-3 flex justify-between items-end">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-semibold text-gray-900">
                    #{order.id.slice(-8).toUpperCase()}
                  </p>
                </div>

                {/* Desktop Payment Button */}
                {isPaymentPending && (
                  <Button
                    onClick={() => initializePayment()}
                    disabled={isInitializingPayment}
                    className="hidden sm:flex bg-green-600 hover:bg-green-700"
                  >
                    {isInitializingPayment ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <CreditCard className="w-4 h-4 mr-2" />
                    )}
                    Complete Payment
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="px-4 py-6 space-y-6">
            {/* Payment Warning */}
            {isPaymentPending && (
              <Card className="border-l-4 border-l-yellow-500 shadow-sm bg-yellow-50/50">
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-yellow-900">
                        Payment Pending
                      </h4>
                      <p className="text-sm text-yellow-700">
                        Complete payment to process your order.
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => initializePayment()}
                    disabled={isInitializingPayment}
                    className="sm:hidden bg-yellow-600 hover:bg-yellow-700 text-white"
                  >
                    Pay Now
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Delivery Map */}
            {isOutForDelivery && order.riderId && (
              <Card className="border-0 shadow-lg overflow-hidden">
                <CardContent className="p-0">
                  <DeliveryMap
                    orderId={order.id}
                    deliveryAddress={order.deliveryAddress}
                  />
                  <RiderInfoCard orderId={order.id} riderId={order.riderId} />
                </CardContent>
              </Card>
            )}

            {/* Estimated Delivery */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    {isDelivered ? "Delivered At" : "Estimated Delivery"}
                  </h2>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-gray-900">
                    {estimatedDeliveryTime}
                  </span>
                  {!isDelivered && !isCancelled && (
                    <span className="text-gray-600">today</span>
                  )}
                </div>
                {isDelivered && order.deliveredAt && (
                  <p className="text-sm text-gray-600 mt-2">
                    Delivered on{" "}
                    {new Date(order.deliveredAt).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Package className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Order Timeline
                  </h2>
                </div>
                <div className="space-y-6">
                  {order.history.map((step, idx) => {
                    const isCompleted =
                      order.history.findIndex(
                        (h) => h.status === order.status,
                      ) >= idx;
                    const isActive = step.status === order.status;
                    return (
                      <div key={step.id} className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${isCompleted ? "bg-primary border-primary" : "bg-white border-gray-300"} ${isActive ? "ring-4 ring-primary/20" : ""}`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-white" />
                            ) : (
                              <div className="w-3 h-3 rounded-full bg-gray-300" />
                            )}
                          </div>
                          {idx < order.history.length - 1 && (
                            <div
                              className={`w-[2px] h-12 mt-2 transition-colors ${isCompleted ? "bg-primary" : "bg-gray-300"}`}
                            />
                          )}
                        </div>
                        <div className="flex-1 pb-2">
                          <div className="flex items-start justify-between gap-3 mb-1">
                            <p
                              className={`font-semibold ${isActive ? "text-primary" : "text-gray-900"}`}
                            >
                              {getStatusLabel(step.status)}
                            </p>
                            <span className="text-sm text-gray-600">
                              {new Date(step.createdAt).toLocaleTimeString(
                                "en-US",
                                { hour: "2-digit", minute: "2-digit" },
                              )}
                            </span>
                          </div>
                          {step.note && (
                            <p className="text-sm text-gray-600 mt-1">
                              {step.note}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Store className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Order Items
                  </h3>
                </div>

                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-start"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <span className="font-semibold text-gray-900">
                        ₦{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}

                  <Separator />

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-lg font-semibold text-gray-900">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      ₦{order.totalAmount.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div
                      className={`flex items-center gap-2 p-3 rounded-lg text-sm ${isPaymentPending ? "bg-yellow-50 text-yellow-900" : "bg-blue-50 text-blue-900"}`}
                    >
                      <AlertCircle
                        className={`w-4 h-4 flex-shrink-0 ${isPaymentPending ? "text-yellow-600" : "text-blue-600"}`}
                      />
                      <p>
                        Payment Status:{" "}
                        <span className="font-semibold">
                          {order.paymentStatus.replace("_", " ")}
                        </span>
                      </p>
                    </div>

                    {isPaymentPending && (
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => initializePayment()}
                        disabled={isInitializingPayment}
                      >
                        {isInitializingPayment && (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        )}
                        Pay Now - ₦{order.totalAmount.toFixed(2)}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Delivery Address
                  </h3>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-900">
                    {order.deliveryAddress.address}
                  </p>
                  {order.deliveryAddress.state && (
                    <p className="text-sm text-gray-600">
                      {order.deliveryAddress.state}
                      {order.deliveryAddress.country &&
                        `, ${order.deliveryAddress.country}`}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a href="tel:+2348000000000" className="block">
                    <Button variant="outline" className="w-full gap-2 h-12">
                      <Phone className="w-4 h-4" />
                      Call Support
                    </Button>
                  </a>
                  <Button variant="outline" className="w-full gap-2 h-12">
                    <MessageCircle className="w-4 h-4" />
                    Live Chat
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Floating QR Button */}
        {isOutForDelivery && order.deliveryVerificationCode && (
          <div className="fixed bottom-6 right-6 z-50">
            <Button
              size="lg"
              onClick={() => setShowQrScanner(true)}
              className="rounded-full w-16 h-16 shadow-2xl hover:scale-110 transition-transform"
            >
              <QrCode className="w-8 h-8" />
            </Button>
          </div>
        )}
      </div>

      {/* Payment Verification Dialog */}
      <PaymentVerificationDialog
        open={showVerificationDialog}
        status={verificationStatus}
        message={verificationMessage}
        orderId={order.id}
        onRetry={() => initializePayment()}
        onCloseAction={() => setShowVerificationDialog(false)}
      />
    </>
  );
}
