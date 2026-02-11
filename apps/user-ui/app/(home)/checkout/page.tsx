"use client";

// import { useAtomValue } from "jotai";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Route } from "next";
import { toast } from "@repo/ui/components/sonner";

import {
  OrderItemsCard,
  OrderSummaryCard,
  PaymentMethodCard,
} from "@/components/checkout/cards";
import { SuccessDialog } from "@/components/checkout/dialogs";
import DeliverySelection from "@/components/checkout/InfoSelection";
import DeliveryDialog from "@/components/checkout/InfoDialog";
import DeliveryInstructions from "@/components/checkout/Instructions";
// import { userAtom } from "@/store/userAtom";
import { useCart } from "@/hooks/use-cart";
import { apiClient } from "@/libs/api-client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/actions/api";
import { useAtomValue } from "jotai";
import { hasConflict } from "@/store/cartAtom";

interface DeliveryData {
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  state: string;
  country: string;
  coordinates: Coordinates | null;
  instructions?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const vendorConflict = useAtomValue(hasConflict);
  // const user = useAtomValue(userAtom);
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useQuery({
    queryKey: ["user-profile"],
    queryFn: api.fetchProfile,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 2,
  });
  const { cart, clearCart, getTotals } = useCart();

  const [paymentMethod, setPaymentMethod] =
    React.useState<BackendPaymentMethod | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = React.useState(false);
  const [showDeliveryDialog, setShowDeliveryDialog] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const [selectedAddress, setSelectedAddress] = React.useState<Address | null>(
    null,
  );
  const [deliveryData, setDeliveryData] = React.useState<DeliveryData | null>(
    null,
  );
  const [instructions, setInstructions] = React.useState("");

  // Redirect if no user or empty cart
  React.useEffect(() => {
    if (cart.length === 0 && !showSuccessDialog) {
      router.push("/cart");
    }
  }, [cart.length, router, showSuccessDialog]);

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);
    setDeliveryData(null);
    setInstructions(""); // Reset instructions when switching addresses
  };

  const handleNewDelivery = (data: DeliveryData) => {
    setDeliveryData(data);
    setSelectedAddress(null);
    setInstructions(data.instructions || ""); // Use instructions from new delivery data
    setShowDeliveryDialog(false);
  };

  const getDeliveryAddress = (): Address => {
    if (selectedAddress) {
      return selectedAddress;
    }
    if (deliveryData) {
      return {
        address: deliveryData.address,
        state: deliveryData.state,
        country: deliveryData.country,
        coordinates: deliveryData.coordinates || { lat: 0, long: 0 },
      };
    }
    return {
      address: "",
      state: "",
      country: "",
      coordinates: { lat: 0, long: 0 },
    };
  };

  const getContactInfo = () => {
    if (deliveryData) {
      return {
        fullName: deliveryData.fullName,
        phoneNumber: deliveryData.phoneNumber,
        email: deliveryData.email,
        instructions: instructions, // Use current instructions state
      };
    }
    return {
      fullName: user?.fullName || "",
      phoneNumber: user?.phoneNumber || "",
      email: user?.email || "",
      instructions: instructions, // Use current instructions state
    };
  };

  const handlePlaceOrder = async () => {
    const contact = getContactInfo();
    const hasAddress = selectedAddress || deliveryData;
    let vendorId = vendorConflict?.currentVendor;

    if (!vendorId) {
      vendorId = cart[0]?.vendorId;
    }

    if (
      !contact.fullName ||
      !contact.phoneNumber ||
      !contact.email ||
      !hasAddress ||
      !vendorId
    ) {
      toast.error("Please complete delivery details");
      if (!hasAddress) setShowDeliveryDialog(true);
      if (!vendorId) {
        toast.error("Please try again");
      }
      return;
    }

    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsProcessing(true);

    try {
      const items = cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      const res: SuccessResponse<{
        message?: string;
        order: { id: string; reference: string };
        nextAction: "ORDER_PLACED_COD" | "INITIALIZE_PAYSTACK_PAYMENT";
      }> = await apiClient.post("/orders", {
        items,
        deliveryAddress: getDeliveryAddress(),
        contactInfo: { ...contact, phone: contact.phoneNumber },
        paymentMethod: paymentMethod,
        vendorId,
      });

      if (!res.ok) {
        throw new Error(res.message || "Failed to create order");
      }

      clearCart();

      const data = res.data;

      const orderId = data.order.id;
      const orderReference = data.order.reference;

      if (data.nextAction === "ORDER_PLACED_COD") {
        setShowSuccessDialog(true);
        setTimeout(() => {
          router.push(`/order/${orderId || orderReference}`);
        }, 3000);
      } else if (data.nextAction === "INITIALIZE_PAYSTACK_PAYMENT") {
        const initResponse: SuccessResponse<{
          message: string;
          authorization_url: string;
        }> = await apiClient.post(`/orders/${orderId}/payments/create-intent`);

        console.log(initResponse);
        if (!initResponse.ok) {
          toast.error(initResponse.message || "Failed to initialize payment");
        }

        router.push(initResponse.data.authorization_url as Route<string>);
      } else {
        throw new Error("Unknown action from server");
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Failed to place order. Please try again.");
      setIsProcessing(false);
    }
  };

  // if (!user && !userLoading) return null;
  if (cart.length === 0) return null;

  const hasSelectedDelivery = selectedAddress || deliveryData;

  return (
    <div className="min-h-screen bg-gray-50 pb-32 sm:pb-8">
      <div className="container max-w-6xl mx-auto px-4 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base font-medium">Back</span>
          </button>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            Checkout
          </h1>
          <div className="w-16 sm:w-20" />
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <DeliverySelection
              user={user}
              selectedAddress={selectedAddress}
              onAddressSelect={handleAddressSelect}
              onNewAddress={() => setShowDeliveryDialog(true)}
              isLoading={userLoading}
              error={userError}
              setShowNewAddressDialog={setShowDeliveryDialog}
            />

            {/* Show instructions card when delivery is selected */}
            {hasSelectedDelivery && (
              <DeliveryInstructions
                instructions={instructions}
                onInstructionsChange={setInstructions}
              />
            )}

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
      <DeliveryDialog
        open={showDeliveryDialog}
        onOpenChange={setShowDeliveryDialog}
        onSubmit={handleNewDelivery}
        user={user}
      />

      <SuccessDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
      />
    </div>
  );
}
