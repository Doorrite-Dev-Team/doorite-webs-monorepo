"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@repo/ui/components/dialog";
import { Button } from "@repo/ui/components/button";
import { Textarea } from "@repo/ui/components/textarea";
import { toast } from "@repo/ui/components/sonner";
import { Star } from "lucide-react";
import { api } from "@/actions/api";
import { cn } from "@repo/ui/lib/utils";

interface PendingOrder {
  id: string;
  vendor: { id: string; businessName: string; logoUrl?: string };
  totalAmount: number;
  deliveredAt: string;
  items: Array<{ product: { id: string; name: string }; quantity: number }>;
}

interface ReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: PendingOrder | null;
  onSuccess?: () => void;
}

export function ReviewModal({
  open,
  onOpenChange,
  order,
  onSuccess,
}: ReviewModalProps) {
  const [vendorRating, setVendorRating] = useState(0);
  const [riderRating, setRiderRating] = useState(0);
  const [productRatings, setProductRatings] = useState<Record<string, number>>(
    {},
  );
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!order) return;

    if (vendorRating === 0) {
      toast.error("Please rate the vendor");
      return;
    }

    setIsSubmitting(true);

    const result = await api.submitReview({
      orderId: order.id,
      vendorRating,
      riderRating: riderRating > 0 ? riderRating : undefined,
      comment: comment.trim() || undefined,
      productRatings: Object.entries(productRatings)
        .filter(([, rating]) => rating > 0)
        .map(([productId, rating]) => ({ productId, rating })),
    });

    setIsSubmitting(false);

    if (result.success) {
      toast.success("Review submitted! Thanks for your feedback.");
      handleClose();
      onSuccess?.();
    } else {
      toast.error(result.error || "Failed to submit review");
    }
  };

  const handleClose = () => {
    if (order) {
      sessionStorage.setItem(`hasDismissedReview_${order.id}`, "true");
    }
    setVendorRating(0);
    setRiderRating(0);
    setProductRatings({});
    setComment("");
    onOpenChange(false);
  };

  if (!order) return null;

  const hasProductRatings = order.items.length > 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">Rate Your Order</DialogTitle>
          <DialogDescription>
            How was your experience with {order.vendor.businessName}?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Vendor Rating */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              {order.vendor.logoUrl && (
                <Image
                  src={order.vendor.logoUrl}
                  alt={order.vendor.businessName}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              )}
              <div>
                <p className="font-medium text-sm">
                  {order.vendor.businessName}
                </p>
                <p className="text-xs text-gray-500">Vendor</p>
              </div>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setVendorRating(star)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={cn(
                      "w-7 h-7",
                      star <= vendorRating
                        ? "fill-amber-400 text-amber-400"
                        : "fill-gray-200 text-gray-300",
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Rider Rating (Optional) */}
          <div className="space-y-2">
            <p className="font-medium text-sm">How was your rider?</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRiderRating(star)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={cn(
                      "w-6 h-6",
                      star <= riderRating
                        ? "fill-blue-400 text-blue-400"
                        : "fill-gray-200 text-gray-300",
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Ratings */}
          {hasProductRatings && (
            <div className="space-y-3">
              <p className="font-medium text-sm">Rate your items</p>
              {order.items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-gray-700 flex-1 truncate">
                    {item.product.name}
                    {item.quantity > 1 && (
                      <span className="text-gray-400"> x{item.quantity}</span>
                    )}
                  </span>
                  <div className="flex gap-1 ml-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() =>
                          setProductRatings((prev) => ({
                            ...prev,
                            [item.product.id]: star,
                          }))
                        }
                        className="p-0.5 transition-transform hover:scale-110"
                      >
                        <Star
                          className={cn(
                            "w-5 h-5",
                            (productRatings[item.product.id] || 0) >= star
                              ? "fill-green-500 text-green-500"
                              : "fill-gray-200 text-gray-300",
                          )}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Comment */}
          <div className="space-y-2">
            <p className="font-medium text-sm">Comments (optional)</p>
            <Textarea
              placeholder="Tell us more about your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Skip
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
