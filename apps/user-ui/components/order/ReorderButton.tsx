"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@repo/ui/components/sonner";
import { Button } from "@repo/ui/components/button";
import { RotateCcw } from "lucide-react";
import { api } from "@/actions/api";
import { cartAtom } from "@/store/cartAtom";
import { useSetAtom } from "jotai";

interface ReorderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  variantId?: string;
  variantName?: string;
  modifiers?: Array<{
    modifierGroupId: string;
    modifierOptionId: string;
    name: string;
    price: number;
  }>;
  productId: string;
  vendorId: string;
  vendorName: string;
  vendorDeliveryFee: number;
  imageUrl?: string;
}

interface ReorderButtonProps {
  orderId: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
  onReorderSuccess?: (items: CartItem[]) => void;
}

export function ReorderButton({
  orderId,
  variant = "outline",
  size = "sm",
  className = "",
  onReorderSuccess,
}: ReorderButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const setCart = useSetAtom(cartAtom);

  const handleReorder = async () => {
    setIsLoading(true);
    try {
      const result = await api.reorderOrder(orderId);

      if (!result.success) {
        toast.error(result.error || "Failed to reorder. Please try again.");
        return;
      }

      toast.success("Items added to cart");

      if (result.items && result.items.length > 0) {
        const items = result.items as ReorderItem[];
        const cartItems: CartItem[] = items.map((item) => ({
          id: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          vendorName: item.vendorName,
          vendorId: item.vendorId,
          imageUrl: item.imageUrl,
          vendorDeliveryFee: item.vendorDeliveryFee ?? 0,
          variantId: item.variantId,
          variantName: item.variantName,
          modifiers: item.modifiers,
        }));

        setCart(cartItems);
      }

      onReorderSuccess?.((result.items as unknown as CartItem[]) || []);
      router.push("/checkout");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={(e) => {
        e.stopPropagation();
        handleReorder();
      }}
      disabled={isLoading}
    >
      <RotateCcw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
      {isLoading ? "Adding..." : "Reorder"}
    </Button>
  );
}
