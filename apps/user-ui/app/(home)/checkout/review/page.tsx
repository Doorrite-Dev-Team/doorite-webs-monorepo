"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Check,
  Clock,
  Bike,
  ShoppingBag,
  MessageSquare,
  Loader2,
  Edit2,
  Ruler,
} from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { Textarea } from "@repo/ui/components/textarea";
import { Separator } from "@repo/ui/components/separator";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { motion } from "framer-motion";
import { api } from "@/actions/api";
import { useCart } from "@/hooks/use-cart";
import { checkoutAtom } from "@/store/checkoutAtom";
import { cn } from "@repo/ui/lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  vendorName: string;
  vendorId: string;
  imageUrl?: string;
  vendorDeliveryFee: number;
  modifiers?: Array<{ name: string; price: number }>;
}

// ── Helpers ────────────────────────────────────────────────────────────────

const fmt = (n: number) => `₦${n.toLocaleString("en-NG")}`;

// ── Shared Header (matches all pages) ─────────────────────────────────────

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

// ── Section Card ───────────────────────────────────────────────────────────

function SectionCard({
  title,
  icon,
  children,
  action,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            {icon}
          </div>
          <p className="font-bold text-sm text-foreground">{title}</p>
        </div>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

// ── Delivery Info Banner ───────────────────────────────────────────────────

function DeliveryInfoBanner({
  isCalculating,
  info,
}: {
  isCalculating: boolean;
  info: { fee: number; distance: number; estimatedTime: string } | null;
}) {
  if (isCalculating) {
    return (
      <div className="bg-primary/5 border border-primary/20 rounded-2xl px-4 py-3 flex items-center gap-3">
        <Loader2 className="w-4 h-4 text-primary animate-spin shrink-0" />
        <p className="text-sm text-primary font-medium">
          Calculating delivery details…
        </p>
      </div>
    );
  }

  if (!info) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-primary/5 border border-primary/20 rounded-2xl p-4"
    >
      <p className="text-xs font-semibold text-primary mb-3 uppercase tracking-wider">
        Delivery estimate
      </p>
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center gap-1.5 text-center">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
            <Ruler className="w-4 h-4 text-primary" />
          </div>
          <p className="text-xs text-muted-foreground">Distance</p>
          <p className="font-bold text-sm text-foreground">
            {info.distance.toFixed(1)} km
          </p>
        </div>
        <div className="flex flex-col items-center gap-1.5 text-center">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <p className="text-xs text-muted-foreground">Est. time</p>
          <p className="font-bold text-sm text-foreground">
            {info.estimatedTime}
          </p>
        </div>
        <div className="flex flex-col items-center gap-1.5 text-center">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
            <Bike className="w-4 h-4 text-primary" />
          </div>
          <p className="text-xs text-muted-foreground">Delivery</p>
          <p className="font-bold text-sm text-foreground">{fmt(info.fee)}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ── Order Item Row ─────────────────────────────────────────────────────────

function OrderItemRow({ item }: { item: CartItem }) {
  return (
    <div className="flex items-start gap-3 py-3 first:pt-0 border-b border-border last:border-0">
      {/* Image */}
      <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center shrink-0 overflow-hidden">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            width={56}
            height={56}
            className="object-cover w-full h-full"
          />
        ) : (
          <ShoppingBag className="w-6 h-6 text-muted-foreground/30" />
        )}
      </div>
      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-foreground leading-snug truncate">
          {item.name}
        </p>
        {item.modifiers && item.modifiers.length > 0 && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
            + {item.modifiers.map((m) => m.name).join(", ")}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-0.5">
          {item.vendorName}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {fmt(item.price)} × {item.quantity}
        </p>
      </div>
      {/* Total */}
      <p className="font-bold text-sm text-foreground shrink-0 pt-0.5">
        {fmt(item.price * item.quantity)}
      </p>
    </div>
  );
}

// ── Cost Row ───────────────────────────────────────────────────────────────

function CostRow({
  label,
  value,
  sub,
  bold,
  highlight,
}: {
  label: string;
  value: string;
  sub?: string;
  bold?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p
          className={cn(
            "text-sm",
            bold
              ? "font-bold text-foreground text-base"
              : "text-muted-foreground",
          )}
        >
          {label}
        </p>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </div>
      <p
        className={cn(
          "font-bold shrink-0",
          highlight
            ? "text-primary text-xl"
            : bold
              ? "text-foreground text-lg"
              : "text-sm text-foreground",
        )}
      >
        {value}
      </p>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function ReviewStepPage() {
  const router = useRouter();
  const [checkout, setCheckout] = useAtom(checkoutAtom);
  const { cart, getTotals } = useCart();

  // Guard: redirect if no address selected
  React.useEffect(() => {
    if (!checkout.selectedAddress) {
      router.replace("/checkout/delivery");
    }
  }, [checkout.selectedAddress, router]);

  // Fetch delivery info when address is set
  const vendorId = cart[0]?.vendorId;
  const coords = checkout.selectedAddress?.coordinates;

  const { data: deliveryData, isLoading: isCalculating } = useQuery({
    queryKey: ["delivery-calc", vendorId, coords?.lat, coords?.long],
    queryFn: () =>
      api.fetchDeliveryCalculation({
        vendorId: vendorId!,
        lat: coords!.lat,
        lng: coords!.long,
      }),
    enabled: !!vendorId && !!coords,
    staleTime: 60_000,
  });

  // Persist delivery info to atom
  React.useEffect(() => {
    if (deliveryData && !isCalculating) {
      setCheckout((s) => ({
        ...s,
        deliveryInfo: {
          fee: deliveryData.fee ?? 0,
          distance: deliveryData.distance ?? 0,
          estimatedTime: deliveryData.estimatedTime ?? "30–45 min",
          isCalculating: false,
        },
      }));
    }
  }, [deliveryData, isCalculating, setCheckout]);

  const totals = getTotals();
  const deliveryFee =
    checkout.deliveryInfo?.fee ?? deliveryData?.fee ?? totals.deliveryFee;
  const platformCharge = totals.subtotal * 0.1;
  const total =
    totals.subtotal + deliveryFee + platformCharge + totals.smallOrderFee;

  if (!checkout.selectedAddress || cart.length === 0) return null;

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Checkout" />
      <StepProgress current={2} />

      <div className="max-w-lg mx-auto px-4 pb-36 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-4"
        >
          {/* Delivery address */}
          <SectionCard
            title="Delivery address"
            icon={<MapPin className="w-3.5 h-3.5 text-primary" />}
            action={
              <button
                onClick={() => router.push("/checkout/delivery")}
                className="flex items-center gap-1 text-xs text-primary font-semibold hover:text-primary/80 transition-colors touch-manipulation"
              >
                <Edit2 className="w-3 h-3" />
                Change
              </button>
            }
          >
            <p className="text-sm font-semibold text-foreground">
              {checkout.selectedAddress.address}
            </p>
            {(checkout.selectedAddress.state ||
              checkout.selectedAddress.country) && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {[
                  checkout.selectedAddress.state,
                  checkout.selectedAddress.country,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            )}
          </SectionCard>

          {/* Delivery info banner */}
          <DeliveryInfoBanner
            isCalculating={isCalculating}
            info={
              checkout.deliveryInfo
                ? {
                    fee: checkout.deliveryInfo.fee,
                    distance: checkout.deliveryInfo.distance,
                    estimatedTime: checkout.deliveryInfo.estimatedTime,
                  }
                : null
            }
          />

          {/* Order items */}
          <SectionCard
            title={`Order items (${cart.length})`}
            icon={<ShoppingBag className="w-3.5 h-3.5 text-primary" />}
          >
            <div>
              {cart.map((item) => (
                <OrderItemRow key={item.id} item={item as CartItem} />
              ))}
            </div>
          </SectionCard>

          {/* Delivery instructions */}
          <SectionCard
            title="Delivery instructions"
            icon={<MessageSquare className="w-3.5 h-3.5 text-primary" />}
          >
            <Textarea
              value={checkout.instructions}
              onChange={(e) =>
                setCheckout((s) => ({ ...s, instructions: e.target.value }))
              }
              placeholder="Gate code, landmark, leave at door…"
              className="rounded-xl resize-none min-h-[80px] text-sm border-border"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Optional — these notes go directly to your rider
            </p>
          </SectionCard>

          {/* Cost breakdown */}
          <SectionCard
            title="Cost breakdown"
            icon={<Bike className="w-3.5 h-3.5 text-primary" />}
          >
            <div className="space-y-3">
              <CostRow label="Subtotal" value={fmt(totals.subtotal)} />

              {isCalculating ? (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Delivery fee</p>
                  <div className="flex items-center gap-1.5 text-xs text-primary">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Calculating…
                  </div>
                </div>
              ) : (
                <CostRow
                  label="Delivery fee"
                  value={fmt(deliveryFee)}
                  sub={
                    checkout.deliveryInfo
                      ? `${checkout.deliveryInfo.distance.toFixed(1)} km · ${checkout.deliveryInfo.estimatedTime}`
                      : undefined
                  }
                />
              )}

              {totals.smallOrderFee > 0 && (
                <CostRow
                  label="Small order fee"
                  value={fmt(totals.smallOrderFee)}
                />
              )}

              <CostRow
                label="Platform charge"
                value={fmt(platformCharge)}
                sub="10% of subtotal"
              />

              <Separator />

              <CostRow label="Total" value={fmt(total)} bold highlight />
            </div>
          </SectionCard>
        </motion.div>
      </div>

      {/* Sticky footer CTA */}
      <div className="fixed bottom-20 inset-x-0 bg-card/95 backdrop-blur-md border-t border-border">
        <div className="max-w-lg mx-auto px-4 py-4">
          <Button
            onClick={() => router.push("/checkout/payment")}
            className="w-full h-12 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground
              font-bold text-base shadow-md shadow-primary/25 gap-2"
          >
            Continue to payment
            <ChevronRight className="w-5 h-5" />
          </Button>
          <p className="text-center text-xs text-muted-foreground mt-2">
            Total:{" "}
            <span className="font-bold text-foreground">
              {isCalculating ? "Calculating…" : fmt(total)}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
