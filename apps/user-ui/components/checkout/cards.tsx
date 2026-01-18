"use client";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/radio-group";
import { Separator } from "@repo/ui/components/separator";
import {
  Building,
  CreditCard,
  Edit2,
  Loader2,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";

// --- Helper Components ---

// 1. DeliveryAddressCard
interface DeliveryAddressCardProps {
  address: DeliveryAddressForm;
  onEdit: () => void;
}
export const DeliveryAddressCard = ({
  address,
  onEdit,
}: DeliveryAddressCardProps) => (
  <Card className="border-0 shadow-lg">
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-gray-900">
            Delivery Address
          </h2>
        </div>
        <Button variant="ghost" size="sm" onClick={onEdit} className="gap-1">
          <Edit2 className="w-4 h-4" />
          Edit
        </Button>
      </div>

      {address.fullName ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-900">
              {address.fullName}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">{address.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">{address.email}</span>
          </div>
          <div className="flex items-start gap-2">
            <Building className="w-4 h-4 text-gray-500 mt-1" />
            <div className="text-gray-700">
              <p>{address.address}</p>
              {address.building && (
                <p>
                  {address.building}, Room {address.room}
                </p>
              )}
            </div>
          </div>
          {address.instructions && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Delivery Instructions:</strong> {address.instructions}
              </p>
            </div>
          )}
        </div>
      ) : (
        <Button variant="outline" className="w-full" onClick={onEdit}>
          Add Delivery Address
        </Button>
      )}
    </CardContent>
  </Card>
);

// 2. PaymentMethodCard
interface PaymentMethodCardProps {
  paymentMethod: BackendPaymentMethod | null;
  setPaymentMethod: (method: BackendPaymentMethod) => void;
}
export const PaymentMethodCard = ({
  paymentMethod,
  setPaymentMethod,
}: PaymentMethodCardProps) => (
  <Card className="border-0 shadow-lg">
    <CardContent className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <CreditCard className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
      </div>

      <RadioGroup
        value={paymentMethod}
        onValueChange={(v) => setPaymentMethod(v as BackendPaymentMethod)}
      >
        <div className="space-y-3">
          {/* Paystack */}
          <label
            htmlFor="PAYSTACK"
            className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
              paymentMethod === "PAYSTACK"
                ? "border-primary bg-primary/5"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem value="PAYSTACK" id="PAYSTACK" />
              <div>
                <p className="font-medium text-gray-900">Card/Bank Payment</p>
                <p className="text-sm text-gray-600">
                  Pay securely with your debit/credit card
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              Recommended
            </Badge>
          </label>

          {/* Cash on Delivery */}
          <label
            htmlFor="CASH_ON_DELIVERY"
            className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
              paymentMethod === "CASH_ON_DELIVERY"
                ? "border-primary bg-primary/5"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem
                value="CASH_ON_DELIVERY"
                id="CASH_ON_DELIVERY"
                disabled
              />
              <div>
                <p className="font-medium text-gray-900">Cash on Delivery</p>
                <p className="text-sm text-gray-600">Currently unavailable</p>
              </div>
            </div>
          </label>
        </div>
      </RadioGroup>
    </CardContent>
  </Card>
);

// 3. OrderItemsCard
interface OrderItemsCardProps {
  cart: CartItem[];
}
export const OrderItemsCard = ({ cart }: OrderItemsCardProps) => (
  <Card className="border-0 shadow-lg">
    <CardContent className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Order Items ({cart.length})
      </h2>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-start py-3 border-b last:border-b-0"
          >
            <div className="flex-1">
              <p className="font-medium text-gray-900">{item.name}</p>
              <p className="text-sm text-gray-600">{item.vendorName}</p>
              <p className="text-sm text-gray-500 mt-1">
                ₦{item.price.toFixed(2)} × {item.quantity}
              </p>
            </div>
            <span className="font-semibold text-gray-900">
              ₦{(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

// 4. OrderSummaryCard
interface OrderSummaryCardProps {
  fee: {
    subtotal: number;
    deliveryFee: number;
    serviceFee: number;
    total: number;
  };
  isProcessing: boolean;
  onPlaceOrder: () => void;
}
export const OrderSummaryCard = ({
  fee,
  isProcessing,
  onPlaceOrder,
}: OrderSummaryCardProps) => (
  <div className="lg:sticky lg:top-6">
    <Card className="border-0 shadow-lg">
      <CardContent className="p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>

        <div className="space-y-3">
          <div className="flex justify-between text-gray-700">
            <span>Subtotal</span>
            <span className="font-medium">₦{fee.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Delivery Fee</span>
            <span className="font-medium">₦{fee.deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Service Fee</span>
            <span className="font-medium">₦{fee.serviceFee.toFixed(2)}</span>
          </div>

          <Separator />

          <div className="flex justify-between items-baseline">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-primary">
              ${fee.total.toFixed(2)}
            </span>
          </div>
        </div>

        <Button
          size="lg"
          className="w-full h-12 text-base font-semibold"
          onClick={onPlaceOrder}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>Place Order</>
          )}
        </Button>

        <p className="text-xs text-gray-600 text-center">
          By placing this order, you agree to our Terms of Service and Privacy
          Policy
        </p>
      </CardContent>
    </Card>
  </div>
);
