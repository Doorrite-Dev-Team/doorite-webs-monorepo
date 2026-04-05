"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Share2,
  Star,
  Clock,
  Bike,
  MapPin,
  Search,
  ShoppingBag,
  Store,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { Skeleton } from "@repo/ui/components/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";
import { Input } from "@repo/ui/components/input";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/actions/api";
import { cn } from "@repo/ui/lib/utils";

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
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors touch-manipulation"
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

function RatingBreakdown({ stats }: { stats: NonNullable<Vendor["stats"]> }) {
  return (
    <div className="flex items-start gap-5">
      <div className="flex flex-col items-center gap-1 w-20 shrink-0">
        <span className="text-4xl font-bold text-foreground leading-none">
          {stats.averageRating.toFixed(1)}
        </span>
        <Stars rating={stats.averageRating} size={14} />
        <span className="text-xs text-muted-foreground text-center">
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
                className="h-full bg-secondary rounded-full transition-all duration-500"
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

function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.id}`}>
      <div
        className={cn(
          "flex items-center gap-3 bg-card rounded-2xl border border-border p-3",
          "hover:shadow-md hover:border-primary/20 transition-all duration-200",
          !product.isAvailable && "opacity-60",
        )}
      >
        <div className="w-20 h-20 rounded-xl bg-muted flex items-center justify-center shrink-0 overflow-hidden">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
          ) : (
            <ShoppingBag className="w-8 h-8 text-muted-foreground/30" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-foreground truncate">
            {product.name}
          </p>
          {product.description && (
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}
          <div className="flex items-center justify-between mt-2">
            <span className="font-bold text-sm text-primary">
              {fmt(product.basePrice)}
            </span>
            {typeof product.rating === "number" && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="w-3 h-3 fill-secondary text-secondary" />
                {product.rating.toFixed(1)}
              </span>
            )}
          </div>
        </div>

        <div className="shrink-0">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <ChevronRight className="w-4 h-4 text-primary" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function VendorReviewsTab({ vendorId }: { vendorId: string }) {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["vendor-reviews", vendorId, page],
    queryFn: () => api.fetchVendorReviews(vendorId, page, limit),
    placeholderData: (prev) => prev,
  });

  const stats = data?.reviewsData;
  const reviews = stats?.reviews ?? [];
  const total = stats?.totalReviews ?? 0;
  const totalPages = Math.ceil(total / limit);

  if (isLoading && !data) {
    return (
      <div className="space-y-3 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-muted rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-8">
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
            <p className="font-semibold text-foreground">No reviews yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Be the first to review this vendor
            </p>
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-xl"
          >
            Previous
          </Button>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum = i + 1;
              if (totalPages > 5 && page > 3) {
                pageNum = page - 2 + i;
              }
              if (pageNum > totalPages) return null;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={cn(
                    "w-8 h-8 rounded-xl text-xs font-semibold transition-colors",
                    pageNum === page
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/70",
                  )}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-xl"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

function EmptyProductsState({ search }: { search: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center gap-3">
      <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
        <ShoppingBag className="w-7 h-7 text-muted-foreground/40" />
      </div>
      <div>
        <p className="font-semibold text-foreground">
          {search ? "No results found" : "No products available"}
        </p>
        {search ? (
          <p className="text-sm text-muted-foreground mt-1">
            Try a different search term
          </p>
        ) : (
          <p className="text-sm text-muted-foreground mt-1">
            This vendor hasn&apos;t added any products yet
          </p>
        )}
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function VendorProductsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-5 w-24" />
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-card rounded-2xl border border-border p-3"
            >
              <Skeleton className="w-20 h-20 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function VendorPageClient({ vendor }: { vendor: Vendor }) {
  const [search, setSearch] = useState("");

  const handleShare = async () => {
    try {
      await navigator.share({
        title: vendor.businessName,
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // Fetch nearby vendors (related vendors)
  const { data: nearbyVendors, isLoading: nearbyLoading } = useQuery({
    queryKey: ["nearby-vendors", vendor.id, vendor.category],
    queryFn: () =>
      api
        .fetchRelatedVendors(vendor.category || "", vendor.id)
        .then((vendors) => vendors.slice(0, 6)),
    enabled: !!vendor.category || !!vendor.id,
  });

  const products = vendor.products ?? [];
  const filtered = search.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description?.toLowerCase().includes(search.toLowerCase()),
      )
    : products;

  const categories = Array.from(
    new Set(filtered.map((p) => p.category ?? "Menu")),
  );

  const isOpen = vendor.isOpen;

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title={vendor.businessName}
        rightSlot={
          <IconBtn label="Share" onClick={handleShare}>
            <Share2 className="w-5 h-5" />
          </IconBtn>
        }
      />

      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <div className="relative w-full h-44 bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/10 overflow-hidden">
            {vendor.bannerUrl && (
              <Image
                src={vendor.bannerUrl}
                alt=""
                fill
                className="object-cover opacity-60"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          </div>

          <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
            <div className="flex items-end gap-3">
              <div className="w-16 h-16 rounded-2xl bg-card border-2 border-border shadow-lg flex items-center justify-center overflow-hidden shrink-0">
                {vendor.logoUrl ? (
                  <Image
                    src={vendor.logoUrl}
                    alt={vendor.businessName}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <Store className="w-8 h-8 text-primary" />
                )}
              </div>

              <div className="flex-1 min-w-0 pb-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h2 className="font-bold text-lg text-foreground leading-tight truncate">
                    {vendor.businessName}
                  </h2>
                  {vendor.isVerified && (
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  )}
                </div>
                {vendor.category && (
                  <p className="text-xs text-muted-foreground">
                    {vendor.category}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-4 flex items-center gap-0 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 shrink-0 pr-4 border-r border-border">
            <div
              className={cn(
                "w-2 h-2 rounded-full shrink-0",
                isOpen ? "bg-primary" : "bg-destructive",
              )}
            />
            <span
              className={cn(
                "text-sm font-semibold",
                isOpen ? "text-primary" : "text-destructive",
              )}
            >
              {isOpen ? "Open" : "Closed"}
            </span>
          </div>

          {vendor.rating !== undefined && (
            <div className="flex items-center gap-1.5 shrink-0 px-4 border-r border-border">
              <Star className="w-4 h-4 fill-secondary text-secondary shrink-0" />
              <span className="text-sm font-semibold text-foreground">
                {vendor.rating?.toFixed(1)}
              </span>
              <span className="text-xs text-muted-foreground">
                ({vendor.reviewCount})
              </span>
            </div>
          )}

          {vendor.deliveryFee !== undefined && (
            <div className="flex items-center gap-1.5 shrink-0 px-4 border-r border-border">
              <Bike className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-sm text-foreground">
                {vendor.deliveryFee === 0 ? "Free" : fmt(vendor.deliveryFee)}
              </span>
            </div>
          )}

          {vendor.avrgPreparationTime && (
            <div className="flex items-center gap-1.5 shrink-0 px-4 border-r border-border">
              <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-sm text-foreground">
                {vendor.avrgPreparationTime}
              </span>
            </div>
          )}

          {vendor.distance !== undefined && (
            <div className="flex items-center gap-1.5 shrink-0 pl-4">
              <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-sm text-foreground">
                {vendor.distance < 1
                  ? `${(vendor.distance * 1000).toFixed(0)}m`
                  : `${vendor.distance.toFixed(1)}km`}
              </span>
            </div>
          )}
        </div>

        {vendor.description && (
          <div className="px-4 pb-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {vendor.description}
            </p>
          </div>
        )}

        <div className="px-4">
          <Tabs defaultValue="menu">
            <TabsList className="w-full bg-muted rounded-2xl h-11 p-1 gap-1">
              <TabsTrigger
                value="menu"
                className="flex-1 rounded-xl font-semibold text-sm
                  data-[state=active]:bg-card data-[state=active]:text-primary
                  data-[state=active]:shadow-sm transition-all"
              >
                Menu ({products.length})
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="flex-1 rounded-xl font-semibold text-sm
                  data-[state=active]:bg-card data-[state=active]:text-primary
                  data-[state=active]:shadow-sm transition-all"
              >
                Reviews{vendor.stats ? ` (${vendor.stats.totalReviews})` : ""}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="menu" className="mt-4 pb-8">
              <div className="relative mb-4">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search menu..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 rounded-2xl border-border bg-muted/50 h-11"
                />
              </div>

              {filtered.length === 0 ? (
                <EmptyProductsState search={search} />
              ) : (
                <div className="space-y-6">
                  {categories.map((cat) => {
                    const catProducts = filtered.filter(
                      (p) => (p.category ?? "Menu") === cat,
                    );
                    return (
                      <div key={cat}>
                        <h3 className="font-bold text-sm text-foreground uppercase tracking-wider mb-3 px-1">
                          {cat}
                          <span className="ml-2 font-normal text-muted-foreground normal-case tracking-normal">
                            ({catProducts.length})
                          </span>
                        </h3>
                        <div className="space-y-2">
                          {catProducts.map((p) => (
                            <ProductCard key={p.id} product={p} />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="reviews" className="mt-4">
              <VendorReviewsTab vendorId={vendor.id} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Related Vendors Section */}
      <div className="px-4 py-6 border-t border-border">
        <h3 className="font-bold text-lg text-foreground mb-4">
          Nearby Vendors
        </h3>
        {nearbyLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-card rounded-2xl border border-border p-3"
              >
                <Skeleton className="w-12 h-12 rounded-xl mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            ))}
          </div>
        ) : nearbyVendors && nearbyVendors.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {nearbyVendors.map((v) => (
              <Link key={v.id} href={`/vendor/${v.id}`}>
                <div className="bg-card rounded-2xl border border-border p-3 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2 overflow-hidden">
                    {v.logoUrl ? (
                      <Image
                        src={v.logoUrl}
                        alt={v.businessName}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <Store className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <p className="font-semibold text-sm text-foreground truncate">
                    {v.businessName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {v.distance !== undefined
                      ? v.distance < 1
                        ? `${(v.distance * 1000).toFixed(0)}m away`
                        : `${v.distance.toFixed(1)}km away`
                      : v.category}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
              <MapPin className="w-7 h-7 text-muted-foreground/40" />
            </div>
            <div>
              <p className="font-semibold text-foreground">No nearby vendors</p>
              <p className="text-sm text-muted-foreground mt-1">
                No other vendors found in this area
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
