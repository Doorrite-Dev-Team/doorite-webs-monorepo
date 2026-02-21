"use client";

import { useAtomValue } from "jotai";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

// Assuming these are defined in your project
import {
  OrderItemsCard,
  OrderSummaryCard,
  PaymentMethodCard,
} from "@/components/checkout/cards";
import { SuccessDialog } from "@/components/checkout/dialogs";
import { userAtom } from "@/store/userAtom";
import AddressSelection from "@/components/checkout/AddressSelection";
import CheckoutAddressDialog from "@/components/checkout/CheckoutAddressDialog";
import { useCart } from "@/hooks/use-cart";
import { Route } from "next";
import { apiClient } from "@/libs/api-client";
import { toast } from "@repo/ui/components/sonner";

// Type definitions for checkout
interface CheckoutAddressData {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  state: string;
  country: string;
  coordinates?: Coordinates | null;
  instructions?: string;
}

interface CheckoutContactInfo {
  fullName: string;
  phone: string;
  email: string;
  instructions?: string;
}

// --- Main Checkout Page Component ---

export default function CheckoutPage() {
  const router = useRouter();
  const user = useAtomValue(userAtom);

  // Cart hook
  const { cart, clearCart, getTotals } = useCart();

  // Local state
  const [paymentMethod, setPaymentMethod] =
    React.useState<BackendPaymentMethod | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = React.useState(false);
  const [showAddressDialog, setShowAddressDialog] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);

  // Address state
  const [selectedAddress, setSelectedAddress] = React.useState<Address | null>(
    null,
  );
  const [contactInfo, setContactInfo] = React.useState<{
    fullName: string;
    phone: string;
    email: string;
    instructions?: string;
  }>({
    fullName: user?.fullName || "",
    phone: user?.phoneNumber || "",
    email: user?.email || "",
    instructions: "",
  });

  const [newAddressData, setNewAddressData] =
    React.useState<CheckoutAddressData | null>(null);

  // Calculate delivery address for API submission
  const getDeliveryAddress = (): Address => {
    if (selectedAddress) {
      return {
        ...selectedAddress,
        // Override contact info with current checkout data
        ...contactInfo,
      };
    } else if (newAddressData) {
      return {
        address: newAddressData.address,
        state: newAddressData.state,
        country: newAddressData.country,
        coordinates: newAddressData.coordinates || { lat: 0, long: 0 },
      };
    }
    // Fallback - shouldn't happen
    return {
      address: "",
      state: "",
      country: "",
      coordinates: { lat: 0, long: 0 },
    };
  };

  // Get contact info for order submission
  const getOrderContactInfo = () => {
    if (newAddressData) {
      return {
        fullName: newAddressData.fullName,
        phone: newAddressData.phone,
        email: newAddressData.email,
        instructions: newAddressData.instructions,
      };
    }
    return contactInfo;
  };

  // Redirect if cart is empty
  React.useEffect(() => {
    if (cart.length === 0 && !showSuccessDialog) {
      router.push("/cart");
    }
  }, [cart.length, router, showSuccessDialog]);

  // Check if user has address data
  const hasCompleteAddress = selectedAddress || newAddressData;

  // Handle address selection
  const handleAddressSelect = (
    address: Address | null,
    contactInfo?: CheckoutContactInfo,
  ) => {
    setSelectedAddress(address);
    if (address && contactInfo) {
      setContactInfo(contactInfo);
    }
    setNewAddressData(null);
  };

  // Handle new address submission
  const handleNewAddress = (addressData: CheckoutAddressData) => {
    setNewAddressData(addressData);
    setSelectedAddress(null);
  };

  /**
   * REFACTORED: Handles order creation and payment initialization via the backend API.
   *
   * 1. POST /api/v1/orders: Creates the Order (PENDING) and gets orderId/nextAction.
   * 2. If PAYSTACK, POST /api/v1/orders/:id/payments/create-intent: Gets Paystack authorization URL.
   * 3. Redirects to Paystack (or to order tracking for COD).
   */
  const handlePlaceOrder = async () => {
    // 1. Validation
    const contact = getOrderContactInfo();

    if (
      !contact.fullName ||
      !contact.phone ||
      !contact.email ||
      !hasCompleteAddress
    ) {
      toast.error(
        "Please fill in all required delivery details and select an address",
      );
      if (!hasCompleteAddress) {
        setShowAddressDialog(true);
      }
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setIsProcessing(true);

    try {
      // const paymentMethodEnum: BackendPaymentMethod =
      //   paymentMethod === "" || paymentMethod === "card"
      //     ? "PAYSTACK"
      //     : "CASH_ON_DELIVERY";

      // 1. POST /api/v1/orders - Create Order (and PENDING Payment record)
      const {
        data,
      }: SuccessResponse<{
        message?: string;
        order: { id: string; reference: string };
        nextAction: "ORDER_PLACED_COD" | "INITIALIZE_PAYSTACK_PAYMENT";
      }> = await apiClient.post("/api/v1/orders", {
        // The backend should calculate the fees/total based on these inputs
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        deliveryAddress: getDeliveryAddress(),
        contactInfo: contact,
        paymentMethod: paymentMethod,
      });

      if (!data.ok) {
        throw new Error(data.message || "Failed to create order");
      }

      const orderId = data.order.id;
      const orderReference = data.order.reference;

      if (data.nextAction === "ORDER_PLACED_COD") {
        // --- CASH ON DELIVERY FLOW ---
        clearCart();
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
          await apiClient.post(
            `/api/v1/orders/${orderId}/payments/create-intent`,
          );

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
            <AddressSelection
              selectedAddress={selectedAddress}
              onAddressSelect={handleAddressSelect}
              onNewAddress={handleNewAddress}
              setShowNewAddressDialog={setShowAddressDialog}
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
              fee={getTotals()}
              isProcessing={isProcessing}
              onPlaceOrder={handlePlaceOrder}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <CheckoutAddressDialog
        open={showAddressDialog}
        onOpenChange={setShowAddressDialog}
        onSubmit={(addressData) => {
          setNewAddressData(addressData);
          setSelectedAddress(null);
          setShowAddressDialog(false);
        }}
      />

      <SuccessDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
      />
    </div>
  );
}
