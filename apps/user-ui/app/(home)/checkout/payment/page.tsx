"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Route as RouteType } from "next";
import {
  ChevronLeft,
  CreditCard,
  Banknote,
  ShieldCheck,
  Check,
  Loader2,
  CheckCircle2,
  Clock,
  Bike,
  MapPin,
  ShoppingBag,
  AlertCircle,
} from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { Badge } from "@repo/ui/components/badge";
import { Separator } from "@repo/ui/components/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@repo/ui/components/dialog";
import { toast } from "@repo/ui/components/sonner";
import { useAtom } from "jotai";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/hooks/use-cart";
import { useAtomValue } from "jotai";
import { hasConflict } from "@/store/cartAtom";
import { checkoutAtom, clearCheckoutAtom } from "@/store/checkoutAtom";
import { apiClient } from "@/libs/api/api-client";
import { cn } from "@repo/ui/lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────

type BackendPaymentMethod = "PAYSTACK" | "CASH_ON_DELIVERY";

interface SuccessResponse<T> {
  ok: boolean;
  message?: string;
  data: T;
}

// ── Helpers ────────────────────────────────────────────────────────────────

const fmt = (n: number) => `₦${n.toLocaleString("en-NG")}`;

// ── Shared Header ──────────────────────────────────────────────────────────

function PageHeader({ title }: { title: string }) {
  const router = useRouter();
  return (
    <header className="sticky top-0 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="flex items-center h-14 px-4 gap-2 max-w-lg mx-auto">
        <button
          onClick={() => router.back()}
          aria-label="Go back"
          className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center
            hover:bg-muted active:bg-muted/60 transition-colors touch-manipulation"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="flex-1 font-semibold text-foreground text-base truncate">
          {title}
        </h1>
      </div>
    </header>
  );
}

// ── Step Progress ──────────────────────────────────────────────────────────

function StepProgress({ current }: { current: 1 | 2 | 3 }) {
  const steps = [
    { n: 1, label: "Delivery" },
    { n: 2, label: "Review" },
    { n: 3, label: "Payment" },
  ];
  return (
    <div className="px-4 py-4 max-w-lg mx-auto">
      <div className="flex items-center gap-0">
        {steps.map((s, i) => {
          const done = s.n < current;
          const active = s.n === current;
          return (
            <React.Fragment key={s.n}>
              <div className="flex flex-col items-center gap-1 shrink-0">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                    done
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                      : active
                        ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                        : "bg-muted text-muted-foreground",
                  )}
                >
                  {done ? <Check className="w-4 h-4" /> : s.n}
                </div>
                <span
                  className={cn(
                    "text-[10px] font-semibold whitespace-nowrap",
                    active
                      ? "text-primary"
                      : done
                        ? "text-primary/70"
                        : "text-muted-foreground",
                  )}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-1 mb-4 rounded-full overflow-hidden bg-muted">
                  <div
                    className="h-full bg-primary transition-all duration-500 rounded-full"
                    style={{ width: done ? "100%" : "0%" }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

// ── Payment Option Card ────────────────────────────────────────────────────

function PaymentOption({
  icon,
  title,
  description,
  badge,
  selected,
  disabled,
  onSelect,
}: {
  id?: BackendPaymentMethod;
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: { label: string; variant?: "default" | "outline" };
  selected: boolean;
  disabled?: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={() => !disabled && onSelect()}
      disabled={disabled}
      className={cn(
        "w-full text-left flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 touch-manipulation",
        selected
          ? "border-primary bg-primary/5 shadow-sm shadow-primary/10"
          : "border-border bg-card hover:border-primary/30",
        disabled && "opacity-40 cursor-not-allowed",
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-colors",
          selected
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground",
        )}
      >
        {icon}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-bold text-sm text-foreground">{title}</p>
          {badge && (
            <Badge
              className={cn(
                "text-xs shrink-0",
                badge.variant === "outline"
                  ? ""
                  : "bg-primary/10 text-primary border-primary/20 hover:bg-primary/10",
              )}
              variant={badge.variant ?? "outline"}
            >
              {badge.label}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>

      {/* Radio indicator */}
      <div
        className={cn(
          "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
          selected ? "bg-primary border-primary" : "border-muted-foreground/30",
        )}
      >
        {selected && <Check className="w-3 h-3 text-primary-foreground" />}
      </div>
    </button>
  );
}

// ── Success Dialog ─────────────────────────────────────────────────────────

function SuccessDialog({ open }: { open: boolean }) {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-sm rounded-3xl">
        <DialogHeader className="flex flex-col items-center text-center pt-2 pb-1">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4"
          >
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </motion.div>
          <DialogTitle className="text-xl font-bold text-foreground">
            Order placed! 🎉
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground text-center mt-1 leading-relaxed">
            Your order has been successfully placed. Redirecting you to track it
            now…
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center py-3">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Mini order summary ─────────────────────────────────────────────────────

function MiniSummaryRow({
  icon,
  label,
  value,
  bold,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0">
        {icon}
      </div>
      <p
        className={cn(
          "flex-1 text-sm",
          bold ? "font-bold text-foreground" : "text-muted-foreground",
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "text-sm shrink-0",
          bold ? "font-bold text-primary" : "text-foreground font-semibold",
        )}
      >
        {value}
      </p>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function PaymentStepPage() {
  const router = useRouter();
  const [checkout, setCheckout] = useAtom(checkoutAtom);
  const [, clearCheckout] = useAtom(clearCheckoutAtom);
  const { cart, clearCart, getTotals } = useCart();
  const vendorConflict = useAtomValue(hasConflict);

  const [isProcessing, setIsProcessing] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);

  // Guards
  React.useEffect(() => {
    if (!checkout.selectedAddress) {
      router.replace("/checkout/delivery");
    } else if (cart.length === 0 && !showSuccess) {
      router.replace("/cart");
    }
  }, [checkout.selectedAddress, cart.length, router, showSuccess]);

  const totals = getTotals();
  const deliveryFee = checkout.deliveryInfo?.fee ?? totals.deliveryFee;
  const total = totals.subtotal + deliveryFee + totals.smallOrderFee;

  const handlePlaceOrder = async () => {
    if (!checkout.paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }
    if (!checkout.selectedAddress) {
      toast.error("Delivery address missing");
      router.push("/checkout/delivery");
      return;
    }

    const vendorId = vendorConflict?.currentVendor ?? cart[0]?.vendorId;
    if (!vendorId) {
      toast.error("Vendor info missing. Please try again.");
      return;
    }

    // Build contact info
    const contact = checkout.contact ?? {
      fullName: "",
      phoneNumber: "",
      email: "",
    };

    setIsProcessing(true);

    try {
      const items = cart.map((item) => {
        const modifierGroups = item.modifiers?.reduce<
          Array<{
            modifierGroupId: string;
            selectedOptions: Array<{
              modifierOptionId: string;
              quantity: number;
            }>;
          }>
        >((acc, m) => {
          const existing = acc.find(
            (g) => g.modifierGroupId === m.modifierGroupId,
          );
          if (existing) {
            existing.selectedOptions.push({
              modifierOptionId: m.modifierOptionId,
              quantity: 1,
            });
          } else {
            acc.push({
              modifierGroupId: m.modifierGroupId,
              selectedOptions: [
                { modifierOptionId: m.modifierOptionId, quantity: 1 },
              ],
            });
          }
          return acc;
        }, []);
        return {
          productId: item.id,
          quantity: item.quantity,
          ...(modifierGroups?.length ? { modifiers: modifierGroups } : {}),
        };
      });

      const res: SuccessResponse<{
        message?: string;
        order: { id: string; reference: string };
        nextAction: "ORDER_PLACED_COD" | "INITIALIZE_PAYSTACK_PAYMENT";
      }> = await apiClient.post("/orders", {
        items,
        deliveryAddress: checkout.selectedAddress,
        contactInfo: {
          fullName: contact.fullName,
          phone: contact.phoneNumber,
          email: contact.email,
          instructions: checkout.instructions,
        },
        paymentMethod: checkout.paymentMethod,
        vendorId,
      });

      if (!res.ok) throw new Error(res.message ?? "Failed to create order");

      clearCart();
      clearCheckout();

      const { order, nextAction } = res.data;

      if (nextAction === "ORDER_PLACED_COD") {
        setShowSuccess(true);
        setTimeout(() => {
          router.push(`/order/${order.id || order.reference}`);
        }, 3000);
      } else if (nextAction === "INITIALIZE_PAYSTACK_PAYMENT") {
        const initRes: SuccessResponse<{
          message: string;
          authorization_url: string;
        }> = await apiClient.post(`/orders/${order.id}/payments/create-intent`);

        if (!initRes.ok)
          throw new Error(initRes.message ?? "Payment init failed");
        router.push(initRes.data.authorization_url as RouteType<string>);
      } else {
        throw new Error("Unknown action from server");
      }
    } catch (err) {
      console.error("Order error:", err);
      toast.error("Failed to place order. Please try again.");
      setIsProcessing(false);
    }
  };

  if (!checkout.selectedAddress || cart.length === 0) return null;

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Checkout" />
      <StepProgress current={3} />

      <div className="max-w-lg mx-auto px-4 pb-44 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-4"
        >
          {/* Payment methods */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <CreditCard className="w-3.5 h-3.5 text-primary" />
              </div>
              <p className="font-bold text-sm text-foreground">
                Payment method
              </p>
            </div>

            <div className="p-4 space-y-3">
              <PaymentOption
                id="PAYSTACK"
                icon={<CreditCard className="w-5 h-5" />}
                title="Card / Bank transfer"
                description="Pay securely via Paystack — cards, USSD, bank transfer"
                badge={{ label: "Recommended" }}
                selected={checkout.paymentMethod === "PAYSTACK"}
                onSelect={() =>
                  setCheckout((s) => ({ ...s, paymentMethod: "PAYSTACK" }))
                }
              />

              <PaymentOption
                id="CASH_ON_DELIVERY"
                icon={<Banknote className="w-5 h-5" />}
                title="Cash on delivery"
                description="Pay when your order arrives"
                badge={{ label: "Unavailable", variant: "outline" }}
                selected={checkout.paymentMethod === "CASH_ON_DELIVERY"}
                disabled
                onSelect={() => {}}
              />
            </div>
          </div>

          {/* Order summary (condensed) */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <ShoppingBag className="w-3.5 h-3.5 text-primary" />
              </div>
              <p className="font-bold text-sm text-foreground">Order summary</p>
            </div>

            <div className="p-4 space-y-3">
              <MiniSummaryRow
                icon={<MapPin className="w-3.5 h-3.5 text-muted-foreground" />}
                label={checkout.selectedAddress.address}
                value=""
              />
              {checkout.deliveryInfo && (
                <>
                  <MiniSummaryRow
                    icon={
                      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    }
                    label={checkout.deliveryInfo.estimatedTime}
                    value={`${checkout.deliveryInfo.distance.toFixed(1)} km`}
                  />
                </>
              )}

              <MiniSummaryRow
                icon={
                  <ShoppingBag className="w-3.5 h-3.5 text-muted-foreground" />
                }
                label={`${cart.length} item${cart.length !== 1 ? "s" : ""}`}
                value={fmt(totals.subtotal)}
              />

              <MiniSummaryRow
                icon={<Bike className="w-3.5 h-3.5 text-muted-foreground" />}
                label="Delivery fee"
                value={fmt(deliveryFee)}
              />

              {totals.smallOrderFee > 0 && (
                <MiniSummaryRow
                  icon={
                    <AlertCircle className="w-3.5 h-3.5 text-muted-foreground" />
                  }
                  label="Small order fee"
                  value={fmt(totals.smallOrderFee)}
                />
              )}

              <Separator />

              <MiniSummaryRow
                icon={<ShieldCheck className="w-3.5 h-3.5 text-primary" />}
                label="Total"
                value={fmt(total)}
                bold
              />
            </div>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-4 py-1">
            {[
              { icon: ShieldCheck, label: "Secure checkout" },
              { icon: Clock, label: "Real-time tracking" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 text-muted-foreground"
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="text-xs">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Sticky place order CTA */}
      <div className="fixed bottom-20 inset-x-0 bg-card/95 backdrop-blur-md border-t border-border">
        <div className="max-w-lg mx-auto px-4 py-4 space-y-2">
          <Button
            onClick={handlePlaceOrder}
            disabled={isProcessing || !checkout.paymentMethod}
            className="w-full h-13 rounded-2xl bg-primary hover:bg-primary/90 disabled:opacity-40
              text-primary-foreground font-bold text-base shadow-lg shadow-primary/25 gap-2
              relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {isProcessing ? (
                <motion.span
                  key="processing"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center gap-2"
                >
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing your order…
                </motion.span>
              ) : (
                <motion.span
                  key="idle"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center gap-2"
                >
                  <ShieldCheck className="w-5 h-5" />
                  Place order · {fmt(total)}
                </motion.span>
              )}
            </AnimatePresence>
          </Button>

          <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
            By placing this order you agree to Doorrite&apos;s{" "}
            <span className="text-primary underline-offset-2 underline cursor-pointer">
              Terms
            </span>{" "}
            &{" "}
            <span className="text-primary underline-offset-2 underline cursor-pointer">
              Privacy Policy
            </span>
          </p>
        </div>
      </div>

      <SuccessDialog open={showSuccess} />
    </div>
  );
}
