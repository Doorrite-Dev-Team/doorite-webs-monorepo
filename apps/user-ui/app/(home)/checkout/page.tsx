"use client";

import { useAtom } from "jotai";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

// Assuming these are defined in your project
import {
  DeliveryAddressCard,
  OrderItemsCard,
  OrderSummaryCard,
  PaymentMethodCard,
} from "@/components/checkout/cards";
import { AddressDialog, SuccessDialog } from "@/components/checkout/dialogs";
import { cartAtom, EmptyCartAtom, totalPriceAtom } from "@/store/cartAtom";
import Axios from "@/libs/Axios";
import { Route } from "next";

// --- Main Checkout Page Component ---

export default function CheckoutPage() {
  const router = useRouter();
  // Cart state and totals
  const [cart] = useAtom<CartItem[]>(cartAtom);
  const [totalPrice] = useAtom(totalPriceAtom);
  const [, emptyCart] = useAtom(EmptyCartAtom);

  // Local state
  const [paymentMethod, setPaymentMethod] =
    React.useState<ClientPaymentMethod>("paystack");
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = React.useState(false);
  const [showAddressDialog, setShowAddressDialog] = React.useState(false);
  const [deliveryAddress, setDeliveryAddress] =
    React.useState<DeliveryAddressForm>({
      fullName: "",
      phone: "",
      email: "",
      address: "Campus Address",
      building: "Dormitory A",
      room: "201",
      instructions: "",
    });

  // Fee calculation (client-side display only, backend must re-calculate for integrity)
  const subtotal = totalPrice;
  const deliveryFee = cart.length > 0 ? 3.99 : 0;
  const serviceFee = cart.length > 0 ? 1.99 : 0;
  const total = subtotal + deliveryFee + serviceFee;

  // Redirect if cart is empty
  React.useEffect(() => {
    if (cart.length === 0 && !showSuccessDialog) {
      router.push("/cart");
    }
  }, [cart.length, router, showSuccessDialog]);

  /**
   * REFACTORED: Handles order creation and payment initialization via the backend API.
   *
   * 1. POST /api/v1/orders: Creates the Order (PENDING) and gets orderId/nextAction.
   * 2. If PAYSTACK, POST /api/v1/orders/:id/payments/create-intent: Gets Paystack authorization URL.
   * 3. Redirects to Paystack (or to order tracking for COD).
   */
  const handlePlaceOrder = async () => {
    // 1. Validation
    if (
      !deliveryAddress.fullName ||
      !deliveryAddress.phone ||
      !deliveryAddress.email
    ) {
      alert("Please fill in all required delivery details");
      setShowAddressDialog(true);
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setIsProcessing(true);

    try {
      const paymentMethodEnum: BackendPaymentMethod =
        paymentMethod === "paystack" || paymentMethod === "card"
          ? "PAYSTACK"
          : "CASH_ON_DELIVERY";

      // 1. POST /api/v1/orders - Create the Order (and PENDING Payment record)
      const {
        data,
      }: SuccessResponse<{
        message?: string;
        order: { id: string; reference: string };
        nextAction: "ORDER_PLACED_COD" | "INITIALIZE_PAYSTACK_PAYMENT";
      }> = await Axios.post("/api/v1/orders", {
        // The backend should calculate the fees/total based on these inputs
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        deliveryAddress,
        paymentMethod: paymentMethodEnum,
      });

      if (!data.ok) {
        throw new Error(data.message || "Failed to create order");
      }

      const orderId = data.order.id;
      const orderReference = data.order.reference;

      if (data.nextAction === "ORDER_PLACED_COD") {
        // --- CASH ON DELIVERY FLOW ---
        emptyCart();
        setShowSuccessDialog(true);
        setTimeout(() => {
          router.push(`/order/${orderId || orderReference}`);
        }, 3000);
      } else if (data.nextAction === "INITIALIZE_PAYSTACK_PAYMENT") {
        // --- PAYSTACK FLOW ---

        // 2. POST /orders/:id/payments/create-intent - Get Paystack URL
        const {
          data: initIntentResponse,
        }: SuccessResponse<{ message: string; authorization_url: string }> =
          await Axios.post(`/api/v1/orders/${orderId}/payments/create-intent`);

        // const initIntentResult = await initIntentResponse.json();

        if (!initIntentResponse.ok) {
          throw new Error(
            initIntentResponse.message || "Failed to initialize payment",
          );
        }

        const authUrl = initIntentResponse.authorization_url;

        // 3. Client redirects to Paystack URL
        router.push(authUrl as Route<string>);
      } else {
        throw new Error(data.message || "Unknown next action from server");
      }
    } catch (error) {
      console.error("Order placement error:", error);
      alert("An error occurred. Please try again.");
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32 sm:pb-8">
      <div className="container max-w-6xl mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Checkout
          </h1>
          <div className="w-20" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <DeliveryAddressCard
              address={deliveryAddress}
              onEdit={() => setShowAddressDialog(true)}
            />

            <PaymentMethodCard
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />

            <OrderItemsCard cart={cart} />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummaryCard
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              serviceFee={serviceFee}
              total={total}
              isProcessing={isProcessing}
              onPlaceOrder={handlePlaceOrder}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddressDialog
        open={showAddressDialog}
        onOpenChange={setShowAddressDialog}
        address={deliveryAddress}
        setAddress={setDeliveryAddress}
      />

      <SuccessDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
      />
    </div>
  );
}
