"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  MapPin,
  Plus,
  Check,
  User,
  Phone,
  Mail,
  Loader2,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { Textarea } from "@repo/ui/components/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@repo/ui/components/sheet";
import { toast } from "@repo/ui/components/sonner";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/actions/api";
import { checkoutAtom, CheckoutAddress } from "@/store/checkoutAtom";
import { cn } from "@repo/ui/lib/utils";

// ── Constants ──────────────────────────────────────────────────────────────

const NIGERIAN_STATES = [
  "Abia",
  "Abuja",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

// ── Shared Header (consistent with other pages) ────────────────────────────

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

// ── Address Card ───────────────────────────────────────────────────────────

function AddressCard({
  addr,
  selected,
  onSelect,
}: {
  addr: CheckoutAddress & { id: string };
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 touch-manipulation",
        selected
          ? "border-primary bg-primary/5 shadow-sm shadow-primary/10"
          : "border-border bg-card hover:border-primary/30 hover:bg-muted/30",
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
            selected
              ? "bg-primary border-primary"
              : "border-muted-foreground/30 bg-transparent",
          )}
        >
          {selected ? (
            <Check className="w-3 h-3 text-primary-foreground" />
          ) : (
            <div className="w-3 h-3 bg-background rounded-full" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-foreground leading-snug">
            {addr.address}
          </p>
          {(addr.state || addr.country) && (
            <p className="text-xs text-muted-foreground mt-1">
              {[addr.state, addr.country].filter(Boolean).join(", ")}
            </p>
          )}
        </div>
        <MapPin
          className={cn(
            "w-4 h-4 shrink-0 mt-0.5 transition-colors",
            selected ? "text-primary" : "text-muted-foreground/40",
          )}
        />
      </div>
    </button>
  );
}

// ── New Address Sheet ──────────────────────────────────────────────────────

function NewAddressSheet({
  open,
  onOpenChange,
  user,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  user?: { fullName: string; phoneNumber: string; email: string } | null;
  onSubmit: (
    addr: CheckoutAddress,
    contact: { fullName: string; phoneNumber: string; email: string },
    instructions: string,
  ) => void;
}) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [form, setForm] = React.useState({
    fullName: user?.fullName ?? "",
    phoneNumber: user?.phoneNumber ?? "",
    email: user?.email ?? "",
    address: "",
    state: "",
    country: "Nigeria",
    instructions: "",
  });

  React.useEffect(() => {
    if (open && user) {
      setForm((f) => ({
        ...f,
        fullName: user.fullName ?? "",
        phoneNumber: user.phoneNumber ?? "",
        email: user.email ?? "",
      }));
    }
  }, [open, user]);

  const field =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.fullName ||
      !form.phoneNumber ||
      !form.email ||
      !form.address ||
      !form.state
    ) {
      toast.error("Please fill all required fields");
      return;
    }
    setIsLoading(true);
    try {
      const coordinates = { lat: 6.5244, long: 3.3792 }; // Default Lagos; replace with geocoding
      onSubmit(
        {
          address: form.address,
          state: form.state,
          country: form.country,
          coordinates,
        },
        {
          fullName: form.fullName,
          phoneNumber: form.phoneNumber,
          email: form.email,
        },
        form.instructions,
      );
      onOpenChange(false);
    } catch {
      toast.error("Failed to save address");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl max-h-[92dvh] overflow-y-auto pb-safe"
      >
        <SheetHeader className="text-left pb-2">
          <SheetTitle className="text-lg font-bold">
            Add delivery address
          </SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            Enter where you&apos;d like your order delivered
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2 pb-6">
          {/* Contact info section */}
          <div className="bg-muted/40 rounded-2xl p-4 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Contact details
            </p>
            <div className="space-y-3">
              <div>
                <Label
                  htmlFor="fullName"
                  className="text-xs font-semibold mb-1.5 block"
                >
                  Full name <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    value={form.fullName}
                    onChange={field("fullName")}
                    placeholder="John Doe"
                    className="pl-9 rounded-xl"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label
                    htmlFor="phone"
                    className="text-xs font-semibold mb-1.5 block"
                  >
                    Phone <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      value={form.phoneNumber}
                      onChange={field("phoneNumber")}
                      placeholder="+2348012345678"
                      className="pl-9 rounded-xl text-sm"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor="email"
                    className="text-xs font-semibold mb-1.5 block"
                  >
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={field("email")}
                      placeholder="you@email.com"
                      className="pl-9 rounded-xl text-sm"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Address section */}
          <div className="bg-muted/40 rounded-2xl p-4 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Delivery location
            </p>
            <div className="space-y-3">
              <div>
                <Label
                  htmlFor="address"
                  className="text-xs font-semibold mb-1.5 block"
                >
                  Street address <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="address"
                    value={form.address}
                    onChange={field("address")}
                    placeholder="123 Main Street"
                    className="pl-9 rounded-xl"
                    required
                  />
                </div>
              </div>
              <div>
                <Label
                  htmlFor="state"
                  className="text-xs font-semibold mb-1.5 block"
                >
                  State <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={form.state}
                  onValueChange={(v) => setForm((f) => ({ ...f, state: v }))}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select your state" />
                  </SelectTrigger>
                  <SelectContent>
                    {NIGERIAN_STATES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label
                  htmlFor="instructions"
                  className="text-xs font-semibold mb-1.5 block"
                >
                  Instructions{" "}
                  <span className="text-muted-foreground font-normal">
                    (optional)
                  </span>
                </Label>
                <Textarea
                  id="instructions"
                  value={form.instructions}
                  onChange={field("instructions")}
                  placeholder="Gate code, landmark, leave at door..."
                  className="rounded-xl resize-none min-h-[72px] text-sm"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground
              font-bold text-base shadow-md shadow-primary/25"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving…
              </>
            ) : (
              "Use this address"
            )}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function DeliveryStepPage() {
  const router = useRouter();
  const [checkout, setCheckout] = useAtom(checkoutAtom);
  const [sheetOpen, setSheetOpen] = React.useState(false);

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user-profile"],
    queryFn: api.fetchProfile,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const addresses = (
    (user?.address ?? []) as Array<CheckoutAddress & { id: string }>
  ).map((a, i) => ({ ...a, id: `addr-${i}` }));

  const handleSelect = (addr: CheckoutAddress) => {
    setCheckout((s) => ({
      ...s,
      selectedAddress: addr,
      contact: user
        ? {
            fullName: user.fullName,
            phoneNumber: user.phoneNumber,
            email: user.email,
          }
        : null,
      deliveryInfo: null,
    }));
  };

  const handleNewAddress = (
    addr: CheckoutAddress,
    contact: { fullName: string; phoneNumber: string; email: string },
    instructions: string,
  ) => {
    setCheckout((s) => ({
      ...s,
      selectedAddress: addr,
      contact,
      instructions,
      deliveryInfo: null,
    }));
  };

  const canContinue = !!checkout.selectedAddress;

  // useEffect(() => { }, [checkout])

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Checkout" />
      <StepProgress current={1} />

      <div className="max-w-lg mx-auto px-4 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Section heading */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-foreground text-base">
                Where should we deliver?
              </h2>
              <p className="text-xs text-muted-foreground">
                Choose a saved address or add a new one
              </p>
            </div>
          </div>

          {/* Address list */}
          {isLoading ? (
            <div className="space-y-3 animate-pulse">
              {[1, 2].map((i) => (
                <div key={i} className="h-20 bg-muted rounded-2xl" />
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <AlertCircle className="w-10 h-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                Couldn&apos;t load saved addresses
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSheetOpen(true)}
                className="rounded-xl"
              >
                Add address manually
              </Button>
            </div>
          ) : addresses.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <MapPin className="w-8 h-8 text-muted-foreground/30" />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  No saved addresses
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Add a delivery address to continue
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              <AnimatePresence>
                {addresses.map((addr, i) => {
                  return (
                    <motion.div
                      key={addr.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <AddressCard
                        addr={addr}
                        selected={checkout.selectedAddress?.id === addr.id}
                        onSelect={() => handleSelect(addr)}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {/* Add new address button */}
          <button
            onClick={() => setSheetOpen(true)}
            className="w-full mt-3 flex items-center gap-3 px-4 py-4 rounded-2xl border-2 border-dashed
              border-border hover:border-primary/40 hover:bg-muted/30 transition-all touch-manipulation"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Plus className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-semibold text-foreground">
              Add new address
            </span>
          </button>
        </motion.div>
      </div>

      {/* Sticky footer CTA */}
      <div className="fixed bottom-20 inset-x-0 bg-card/95 backdrop-blur-md border-t border-border">
        <div className="max-w-lg mx-auto px-4 py-4">
          <Button
            onClick={() => router.push("/checkout/review")}
            disabled={!canContinue}
            className="w-full h-12 rounded-2xl bg-primary hover:bg-primary/90 disabled:opacity-40
              text-primary-foreground font-bold text-base shadow-md shadow-primary/25 gap-2"
          >
            Continue to review
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* New address sheet */}
      <NewAddressSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        user={user}
        onSubmit={handleNewAddress}
      />
    </div>
  );
}
