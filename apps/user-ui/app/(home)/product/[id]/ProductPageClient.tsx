"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Heart,
  Share2,
  Star,
  ShoppingBag,
  Plus,
  Minus,
  Store,
  Clock,
  Bike,
  ChevronRight,
  Check,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Separator } from "@repo/ui/components/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";
import { toast } from "@repo/ui/components/sonner";
import { useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { cartAtom } from "@/store/cartAtom";
import { CartService } from "@/services/cart-service";
import { api } from "@/actions/api";
import { cn } from "@repo/ui/lib/utils";
// import RelatedProducts from "@/components/product/RelatedProducts";

const fmt = (n: number) => `₦${n.toLocaleString("en-NG")}`;

function timeAgo(date: string) {
  const d = Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 30) return `${d}d ago`;
  return `${Math.floor(d / 30)}mo ago`;
}

function PageHeader({
  title,
  rightSlot,
}: {
  title: string;
  rightSlot?: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="flex items-center h-14 px-4 gap-2 max-w-2xl mx-auto">
        <button
          onClick={() => router.back()}
          aria-label="Go back"
          className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted active:bg-muted/60 transition-colors touch-manipulation"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="flex-1 font-semibold text-foreground text-base truncate leading-tight">
          {title}
        </h1>
        {rightSlot && (
          <div className="flex items-center gap-0.5 shrink-0">{rightSlot}</div>
        )}
      </div>
    </header>
  );
}

function IconBtn({
  onClick,
  label,
  active,
  children,
}: {
  onClick: () => void;
  label: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(
        "w-9 h-9 rounded-full flex items-center justify-center transition-colors touch-manipulation",
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          style={{ width: size, height: size }}
          className={
            s <= Math.round(rating)
              ? "fill-secondary text-secondary"
              : "fill-muted text-muted-foreground/20"
          }
        />
      ))}
    </span>
  );
}

function RatingBreakdown({ stats }: { stats: ProductStats }) {
  return (
    <div className="flex items-start gap-5">
      <div className="flex flex-col items-center justify-center gap-1 w-20 shrink-0">
        <span className="text-4xl font-bold text-foreground leading-none">
          {stats.averageRating.toFixed(1)}
        </span>
        <Stars rating={stats.averageRating} size={14} />
        <span className="text-xs text-muted-foreground">
          {stats.totalReviews} reviews
        </span>
      </div>
      <div className="flex-1 space-y-1.5">
        {[...stats.ratingDistribution].reverse().map((d) => (
          <div key={d.stars} className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-2.5 text-right">
              {d.stars}
            </span>
            <Star className="w-3 h-3 fill-secondary text-secondary shrink-0" />
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-secondary rounded-full"
                style={{ width: `${d.percentage}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground w-5 text-right">
              {d.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewCard({ review }: { review: ReviewItem }) {
  return (
    <div className="py-4 first:pt-0 border-b border-border last:border-0">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
          {review.userAvatar ? (
            <Image
              src={review.userAvatar}
              alt={review.userName}
              width={36}
              height={36}
              className="object-cover w-full h-full"
            />
          ) : (
            <span className="text-primary font-bold text-sm">
              {review.userName[0]?.toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-sm text-foreground truncate">
              {review.userName}
            </p>
            <span className="text-xs text-muted-foreground shrink-0">
              {timeAgo(review.createdAt)}
            </span>
          </div>
          <div className="mt-0.5">
            <Stars rating={review.rating} size={11} />
          </div>
          {review.comment && (
            <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
              {review.comment}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function ModifierGroupCard({
  group,
  selected,
  onToggle,
}: {
  group: ModifierGroup;
  selected: string[];
  onToggle: (optionId: string) => void;
}) {
  const isMulti = group.maxSelect > 1;

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="px-4 py-3 bg-muted/40 flex items-center justify-between gap-2">
        <div>
          <p className="font-semibold text-sm text-foreground">{group.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {group.isRequired ? "Required" : "Optional"}
            {" · "}
            {group.minSelect === group.maxSelect
              ? `Choose ${group.minSelect}`
              : `Up to ${group.maxSelect}`}
          </p>
        </div>
        <Badge
          variant={group.isRequired ? "default" : "outline"}
          className={cn(
            "text-xs shrink-0",
            group.isRequired
              ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/10"
              : "",
          )}
        >
          {group.isRequired ? "Required" : "Optional"}
        </Badge>
      </div>

      <div className="divide-y divide-border">
        {group.options.map((opt) => {
          const isSelected = selected.includes(opt.id);
          const isAvailable = opt.isAvailable !== false;
          return (
            <button
              key={opt.id}
              onClick={() => isAvailable && onToggle(opt.id)}
              disabled={!isAvailable}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors touch-manipulation",
                isSelected ? "bg-primary/5" : "hover:bg-muted/40",
                !isAvailable && "opacity-40 cursor-not-allowed",
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 shrink-0 flex items-center justify-center border-2 transition-all",
                  isMulti ? "rounded-md" : "rounded-full",
                  isSelected
                    ? "bg-primary border-primary"
                    : "border-muted-foreground/30",
                )}
              >
                {isSelected && (
                  <Check className="w-3 h-3 text-primary-foreground" />
                )}
              </div>

              <span className="flex-1 text-sm text-foreground">{opt.name}</span>

              {opt.priceAdjustment !== 0 && (
                <span
                  className={cn(
                    "text-sm font-semibold shrink-0",
                    opt.priceAdjustment > 0
                      ? "text-foreground"
                      : "text-primary",
                  )}
                >
                  {opt.priceAdjustment > 0 ? "+" : ""}
                  {fmt(opt.priceAdjustment)}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function FloatingActionButton({
  quantity,
  total,
  onQuantityChange,
  onAddToCart,
  className,
}: {
  quantity: number;
  total: number;
  onQuantityChange: (q: number) => void;
  onAddToCart: () => void;
  className?: string;
}) {
  const isExpanded = quantity > 1;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Quantity Controls - Animated */}
      <div
        className={cn(
          "flex items-center bg-muted rounded-2xl overflow-hidden transition-all duration-300 ease-out",
          isExpanded
            ? "opacity-100 scale-100 translate-x-0"
            : "opacity-0 scale-75 -translate-x-4 pointer-events-none",
        )}
      >
        <button
          onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
          className="w-10 h-10 flex items-center justify-center hover:bg-muted/60 active:bg-muted/40 transition-colors touch-manipulation"
          aria-label="Decrease quantity"
        >
          <Minus className="w-4 h-4 text-foreground" />
        </button>
        <span className="w-8 text-center font-bold text-foreground text-sm select-none">
          {quantity}
        </span>
        <button
          onClick={() => onQuantityChange(quantity + 1)}
          className="w-10 h-10 flex items-center justify-center hover:bg-muted/60 active:bg-muted/40 transition-colors touch-manipulation"
          aria-label="Increase quantity"
        >
          <Plus className="w-4 h-4 text-foreground" />
        </button>
      </div>

      {/* Main FAB Button */}
      <Button
        onClick={onAddToCart}
        className={cn(
          "h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/30 transition-all duration-300 ease-out flex items-center gap-2",
          isExpanded ? "px-6" : "px-4",
        )}
      >
        <ShoppingBag
          className={cn(
            "transition-all duration-300",
            isExpanded ? "w-5 h-5" : "w-6 h-6",
          )}
        />
        <span
          className={cn(
            "transition-all duration-300 whitespace-nowrap",
            isExpanded
              ? "opacity-100 scale-100"
              : "opacity-0 scale-75 w-0 overflow-hidden",
          )}
        >
          {fmt(total)}
        </span>
        {!isExpanded && (
          <span className="text-sm font-bold ml-1">{fmt(total)}</span>
        )}
      </Button>
    </div>
  );
}

function RelatedProductsSkeleton() {
  return (
    <div className="overflow-x-auto no-scrollbar">
      <div className="flex gap-4 pb-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-48">
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="aspect-square bg-muted animate-pulse" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-muted animate-pulse rounded" />
                <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProductPageClient({ product }: { product: Product }) {
  const setCart = useSetAtom(cartAtom);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviewPage, setReviewPage] = useState(1);
  const [selected, setSelected] = useState<Record<string, string[]>>({});

  const { data: reviewsData } = useQuery({
    queryKey: ["product-reviews", product.id, reviewPage],
    queryFn: () => api.fetchProductReviews(product.id, reviewPage, 10),
    placeholderData: (prev) => prev,
  });

  const { data: relatedProducts, isLoading: relatedProductsLoading } = useQuery(
    {
      queryKey: ["vendor-products", product.vendorId, product.id],
      queryFn: () =>
        api
          .fetchVendorsProduct(product.vendorId, `exclude=${product.id}`)
          .then((res) => res.products.slice(0, 6)),
      enabled: !!product.vendorId && !!product.id,
    },
  );

  const stats = product.stats ?? reviewsData?.stats;
  const reviews = reviewsData?.reviews ?? product.reviews ?? [];
  const pagination = reviewsData?.pagination;

  const modGroups = (product.modifierGroups ?? []).filter(
    (g) => g.isRequired || g.options.some((o) => o.isAvailable !== false),
  );

  const handleToggle = useCallback(
    (groupId: string, optId: string, maxSelect: number) => {
      setSelected((prev) => {
        const curr = prev[groupId] ?? [];
        if (curr.includes(optId)) {
          return { ...prev, [groupId]: curr.filter((id) => id !== optId) };
        }
        if (maxSelect === 1) return { ...prev, [groupId]: [optId] };
        if (curr.length < maxSelect)
          return { ...prev, [groupId]: [...curr, optId] };
        return prev;
      });
    },
    [],
  );

  const modifiersTotal = Object.entries(selected).reduce(
    (sum, [gid, optIds]) => {
      const group = modGroups.find((g) => g.id === gid);
      if (!group) return sum;
      return (
        sum +
        optIds.reduce((s, oid) => {
          const opt = group.options.find((o) => o.id === oid);
          return s + (opt?.priceAdjustment ?? 0);
        }, 0)
      );
    },
    0,
  );
  const total = (product.basePrice + modifiersTotal) * quantity;

  const handleAddToCart = () => {
    const missing = modGroups
      .filter((g) => g.isRequired)
      .find((g) => !selected[g.id]?.length);
    if (missing) {
      toast.error(`Please select an option for "${missing.name}"`);
      return;
    }
    const currentCart = [] as CartItem[];
    const updatedCart = CartService.addItem(currentCart, {
      productId: product.id,
      productName: product.name,
      basePrice: product.basePrice,
      imageUrl: product.imageUrl,
      vendorId: product.vendor.id,
      vendorName: product.vendor.businessName,
      vendorDeliveryFee: product.vendor.deliveryFee ?? 0,
      quantity,
      modifiers: Object.entries(selected).map(([gid, opts]) => ({
        modifierGroupId: gid,
        selectedOptions: opts.map((id) => {
          const group = modGroups.find((g) => g.id === gid)!;
          const opt = group.options.find((o) => o.id === id)!;
          return {
            modifierOptionId: id,
            name: opt.name,
            priceAdjustment: opt.priceAdjustment,
          };
        }),
      })),
    });
    setCart(updatedCart);
    toast.success("Added to cart!", {
      description: `${product.name} × ${quantity}`,
    });
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.name,
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied!");
    }
  };

  const defaultTab = modGroups.length > 0 ? "customize" : "reviews";

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title={product.name}
        rightSlot={
          <>
            <IconBtn
              label="Favourite"
              active={isFavorite}
              onClick={() => setIsFavorite((f) => !f)}
            >
              <Heart
                className={cn(
                  "w-5 h-5 transition-all",
                  isFavorite && "fill-destructive text-destructive",
                )}
              />
            </IconBtn>
            <IconBtn label="Share" onClick={handleShare}>
              <Share2 className="w-5 h-5" />
            </IconBtn>
          </>
        }
      />

      <div className="max-w-2xl mx-auto pb-36">
        <div className="relative w-full aspect-[4/3] bg-muted overflow-hidden">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 672px) 100vw, 672px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag className="w-20 h-20 text-muted-foreground/20" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

          <div className="absolute bottom-4 left-4">
            <div className="bg-primary px-4 py-2 rounded-2xl shadow-lg shadow-primary/30">
              <span className="text-primary-foreground font-bold text-xl tracking-tight">
                {fmt(product.basePrice)}
              </span>
            </div>
          </div>

          {!product.isAvailable && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2">
              <AlertCircle className="w-10 h-10 text-white/80" />
              <span className="text-white font-semibold text-lg">
                Currently Unavailable
              </span>
            </div>
          )}
        </div>

        <div className="px-4 pt-5 pb-4 space-y-3">
          <h2 className="text-xl font-bold text-foreground leading-tight">
            {product.name}
          </h2>

          {product.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          )}

          {typeof product.rating === "number" && (
            <div className="flex items-center gap-2">
              <Stars rating={product.rating} size={15} />
              <span className="text-sm font-bold text-foreground">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground">
                ({product.reviewCount?.toLocaleString()} reviews)
              </span>
            </div>
          )}

          <Link href={`/vendor/${product.vendor.id}`}>
            <div className="flex items-center gap-3 bg-muted/50 hover:bg-muted rounded-2xl px-4 py-3 transition-colors mt-1">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
                {product.vendor.logoUrl ? (
                  <Image
                    src={product.vendor.logoUrl}
                    alt={product.vendor.businessName}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <Store className="w-5 h-5 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-foreground truncate">
                  {product.vendor.businessName}
                </p>
                <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                  {product.vendor.isOpen !== undefined && (
                    <span
                      className={cn(
                        "text-xs font-semibold",
                        product.vendor.isOpen
                          ? "text-primary"
                          : "text-destructive",
                      )}
                    >
                      {product.vendor.isOpen ? "Open now" : "Closed"}
                    </span>
                  )}
                  {product.vendor.avrgPreparationTime && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {product.vendor.avrgPreparationTime}
                    </span>
                  )}
                  {product.vendor.deliveryFee !== undefined && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Bike className="w-3 h-3" />
                      {product.vendor.deliveryFee === 0
                        ? "Free delivery"
                        : fmt(product.vendor.deliveryFee)}
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            </div>
          </Link>
        </div>

        <Separator />

        {relatedProductsLoading ? (
          <div className="px-4 py-6">
            <h3 className="font-bold text-lg text-foreground mb-4">
              You might also like
            </h3>
            <RelatedProductsSkeleton />
          </div>
        ) : relatedProducts && relatedProducts.length > 0 ? (
          <div className="px-4 py-6">
            <h3 className="font-bold text-lg text-foreground mb-4">
              You might also like
            </h3>
            <div className="overflow-x-auto no-scrollbar">
              <div className="flex gap-4 pb-2">
                {relatedProducts.map((relatedProduct) => (
                  <div key={relatedProduct.id} className="flex-shrink-0 w-48">
                    <Link href={`/product/${relatedProduct.id}`}>
                      <div className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-md transition-shadow">
                        <div className="aspect-square relative">
                          <Image
                            src={relatedProduct.imageUrl || "/no-image.png"}
                            alt={relatedProduct.name}
                            fill
                            sizes="192px"
                            className="object-cover"
                          />
                          {!relatedProduct.isAvailable && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <span className="text-white text-sm font-semibold">
                                Unavailable
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <p className="font-semibold text-sm text-foreground line-clamp-2 mb-1">
                            {relatedProduct.name}
                          </p>
                          <p className="font-bold text-primary text-sm">
                            {fmt(relatedProduct.basePrice)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          !relatedProductsLoading && (
            <div className="px-4 py-6">
              <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                  <ShoppingBag className="w-7 h-7 text-muted-foreground/40" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    No other products
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    This vendor has no other products available
                  </p>
                </div>
              </div>
            </div>
          )
        )}

        <Separator />

        <div className="px-4 pt-4">
          <Tabs defaultValue={defaultTab}>
            <TabsList className="w-full bg-muted rounded-2xl h-11 p-1 gap-1">
              {modGroups.length > 0 && (
                <TabsTrigger
                  value="customize"
                  className="flex-1 rounded-xl font-semibold text-sm
                    data-[state=active]:bg-card data-[state=active]:text-primary
                    data-[state=active]:shadow-sm transition-all"
                >
                  Customize
                </TabsTrigger>
              )}
              <TabsTrigger
                value="reviews"
                className="flex-1 rounded-xl font-semibold text-sm
                  data-[state=active]:bg-card data-[state=active]:text-primary
                  data-[state=active]:shadow-sm transition-all"
              >
                Reviews{stats ? ` (${stats.totalReviews})` : ""}
              </TabsTrigger>
            </TabsList>

            {modGroups.length > 0 && (
              <TabsContent value="customize" className="mt-4 space-y-3 pb-6">
                {modGroups.map((group) => (
                  <ModifierGroupCard
                    key={group.id}
                    group={group}
                    selected={selected[group.id] ?? []}
                    onToggle={(optId) =>
                      handleToggle(group.id, optId, group.maxSelect)
                    }
                  />
                ))}
              </TabsContent>
            )}

            <TabsContent value="reviews" className="mt-4 pb-6 space-y-4">
              {stats && (
                <div className="bg-card rounded-2xl border border-border p-4">
                  <RatingBreakdown stats={stats} />
                </div>
              )}

              {reviews.length > 0 ? (
                <div className="bg-card rounded-2xl border border-border px-4">
                  {reviews.map((r) => (
                    <ReviewCard key={r.id} review={r} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-14 text-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                    <Star className="w-7 h-7 text-muted-foreground/40" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      No reviews yet
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Be the first to review this product
                    </p>
                  </div>
                </div>
              )}

              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!pagination.hasPrev}
                    onClick={() => setReviewPage((p) => p - 1)}
                    className="rounded-xl"
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {pagination.currentPage} / {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!pagination.hasNext}
                    onClick={() => setReviewPage((p) => p + 1)}
                    className="rounded-xl"
                  >
                    Next
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {product.isAvailable && (
        <div className="fixed bottom-20 inset-x-0 z-50 bg-card/95 backdrop-blur-md border-t border-border">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
            <div className="flex items-center bg-muted rounded-2xl overflow-hidden shrink-0">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-11 h-11 flex items-center justify-center hover:bg-muted/60 active:bg-muted/40 transition-colors touch-manipulation"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4 text-foreground" />
              </button>
              <span className="w-8 text-center font-bold text-foreground text-base select-none">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-11 h-11 flex items-center justify-center hover:bg-muted/60 active:bg-muted/40 transition-colors touch-manipulation"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4 text-foreground" />
              </button>
            </div>

            <Button
              onClick={handleAddToCart}
              className="flex-1 h-12 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base gap-2 shadow-md shadow-primary/25"
            >
              <ShoppingBag className="w-5 h-5" />
              Add to Cart · {fmt(total)}
            </Button>
          </div>
        </div>
      )}

      {/* FAB Implementation - Commented Out */}
      {/*
      {product.isAvailable && (
        <FloatingActionButton
          quantity={quantity}
          total={total}
          onQuantityChange={setQuantity}
          onAddToCart={handleAddToCart}
          className="fixed bottom-20 right-4 z-50"
        />
      )}
      */}
    </div>
  );
}
