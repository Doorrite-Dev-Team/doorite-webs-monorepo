"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Clock,
  Star,
  Store,
  ChevronLeft,
  Search,
  X,
  Bike,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@repo/ui/components/badge";
import { Card, CardContent } from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import CartSummaryFloat from "@/components/cart/CartSummaryFloat";
import { api } from "@/actions/api";
import { cn } from "@repo/ui/lib/utils";

interface VendorPageClientProps {
  vendorId: string;
  initialVendor: Vendor;
  relatedVendors: Vendor[];
}

function groupByCategory(products: Product[]): Record<string, Product[]> {
  return products.reduce(
    (acc, product) => {
      const cat = (product.attributes?.category as string) || "Uncategorized";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(product);
      return acc;
    },
    {} as Record<string, Product[]>,
  );
}

function StickyHeader({
  vendorName,
  showSearch,
  searchQuery,
  onSearchChange,
  onSearchToggle,
}: {
  vendorName: string;
  showSearch: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchToggle: () => void;
}) {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          onClick={() => router.back()}
          className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>

        {showSearch ? (
          <div className="flex-1 flex items-center gap-2">
            <Input
              autoFocus
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search menu..."
              className="flex-1 h-9 text-sm"
            />
            <button
              onClick={onSearchToggle}
              className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        ) : (
          <>
            <h1 className="flex-1 font-bold text-gray-900 text-base truncate leading-tight">
              {vendorName}
            </h1>
            <button
              onClick={onSearchToggle}
              className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
            >
              <Search className="w-4 h-4 text-gray-600" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function HeroBanner({ vendor }: { vendor: Vendor }) {
  const categories = vendor.category ? [vendor.category] : [];

  return (
    <div className="relative">
      <div className="relative h-40 sm:h-48 w-full overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
        {vendor.logoUrl ? (
          <Image
            src={vendor.logoUrl}
            alt={vendor.businessName}
            fill
            className="object-cover opacity-70"
            sizes="100vw"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Store className="w-16 h-16 text-white/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {categories.length > 0 && (
          <div className="absolute bottom-3 left-4 flex flex-wrap gap-1.5">
            {categories.slice(0, 3).map((c) => (
              <span
                key={c}
                className="inline-block rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-semibold text-gray-800"
              >
                {c.split("/")[0]?.trim() ?? c}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 -mt-8">
        <Card className="shadow-lg border border-gray-100">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-gray-900 text-lg sm:text-xl leading-tight line-clamp-2">
                  {vendor.businessName}
                </h2>
                {vendor.address?.address && (
                  <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{vendor.address.address}</span>
                  </p>
                )}
              </div>

              {vendor.rating && (
                <div className="flex items-center gap-1 shrink-0 bg-amber-50 rounded-lg px-2.5 py-1.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-sm text-gray-900 tabular-nums">
                    {vendor.rating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-gray-600">
              <Badge
                variant={vendor.isOpen ? "default" : "secondary"}
                className={cn(
                  "text-[10px] font-semibold",
                  vendor.isOpen
                    ? "bg-green-100 text-green-700 hover:bg-green-100"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-100",
                )}
              >
                {vendor.isOpen ? "Open Now" : "Closed"}
              </Badge>

              {vendor.avrgPreparationTime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  {vendor.avrgPreparationTime}
                </span>
              )}

              {vendor.deliveryFee !== undefined &&
                vendor.deliveryFee !== null && (
                  <span className="flex items-center gap-1">
                    <Bike className="w-3.5 h-3.5 text-gray-400" />
                    {vendor.deliveryFee === 0 ? (
                      <span className="text-green-600 font-semibold">
                        Free delivery
                      </span>
                    ) : (
                      `₦${vendor.deliveryFee.toLocaleString()}`
                    )}
                  </span>
                )}

              {vendor.distance != null && (
                <span className="flex items-center gap-1 ml-auto text-gray-400">
                  <MapPin className="w-3 h-3" />
                  {vendor.distance < 1
                    ? `${Math.round(vendor.distance * 1000)} m`
                    : `${vendor.distance.toFixed(1)} km`}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.id}`}
      className={cn(
        "flex gap-3 p-3 rounded-xl bg-white border border-gray-100",
        "hover:border-amber-300 hover:shadow-sm",
        "active:scale-[0.98] transition-all duration-150 touch-manipulation",
        !product.isAvailable && "opacity-60",
      )}
    >
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-gray-100 shrink-0">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="96px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 text-gray-300" />
          </div>
        )}
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white text-[10px] font-bold bg-gray-900/80 px-2 py-0.5 rounded-full">
              Sold Out
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col">
        <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 leading-tight mb-0.5">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-xs text-gray-500 line-clamp-1 mb-auto">
            {product.description}
          </p>
        )}
        <div className="flex items-center justify-between gap-2 mt-1.5">
          <p className="font-bold text-amber-600 text-sm">
            ₦{product.basePrice.toLocaleString()}
          </p>
          {product.variants && product.variants.length > 0 && (
            <Badge variant="outline" className="text-[10px] shrink-0">
              {product.variants.length} option
              {product.variants.length !== 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      </div>
    </Link>
  );
}

function CategorySection({
  category,
  products,
}: {
  category: string;
  products: Product[];
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between px-4">
        <h3 className="font-bold text-gray-900 text-base">{category}</h3>
        <span className="text-xs text-gray-400">{products.length} items</span>
      </div>
      <div className="space-y-2 px-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
        <Search className="w-8 h-8 text-gray-400" />
      </div>
      <p className="font-semibold text-gray-700 mb-1">No items found</p>
      <p className="text-sm text-gray-500 text-center max-w-xs">{message}</p>
    </div>
  );
}

function RelatedVendorsStrip({ vendors }: { vendors: Vendor[] }) {
  if (vendors.length === 0) return null;

  return (
    <div className="bg-gray-50 py-6 -mx-4 px-4 sm:-mx-6 sm:px-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-900 text-base">
          You might also like
        </h3>
        <Link
          href="/explore"
          className="text-xs font-semibold text-amber-600 flex items-center gap-0.5"
        >
          See all
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="flex gap-3 overflow-x-auto scrollbar-none pb-1">
        {vendors.slice(0, 6).map((vendor) => (
          <Link
            key={vendor.id}
            href={`/vendor/${vendor.id}`}
            className={cn(
              "shrink-0 w-[140px] flex flex-col rounded-xl overflow-hidden",
              "bg-white border border-gray-100 shadow-sm",
              "hover:shadow-md active:scale-95 transition-all touch-manipulation",
            )}
          >
            <div className="relative h-20 w-full overflow-hidden bg-gray-100">
              {vendor.logoUrl ? (
                <Image
                  src={vendor.logoUrl}
                  alt={vendor.businessName}
                  fill
                  className="object-cover"
                  sizes="140px"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
              )}
            </div>

            <div className="p-2 space-y-0.5">
              <p className="font-semibold text-xs text-gray-900 line-clamp-1">
                {vendor.businessName}
              </p>
              <div className="flex items-center gap-1 text-[10px] text-gray-500">
                {vendor.rating && (
                  <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                    <Star className="w-2.5 h-2.5 fill-current" />
                    {vendor.rating.toFixed(1)}
                  </span>
                )}
                {vendor.deliveryTime && (
                  <>
                    <span className="text-gray-300">·</span>
                    <span>{vendor.deliveryTime}</span>
                  </>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function VendorPageClient({
  vendorId,
  initialVendor,
  relatedVendors,
}: VendorPageClientProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 50;

  const { data: productData, isLoading } = useQuery({
    queryKey: ["vendor-products", vendorId, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
      });
      return api.fetchVendorsProduct(vendorId, params.toString());
    },
  });

  const allProducts = productData?.products ?? [];

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return allProducts;
    const q = searchQuery.toLowerCase();
    return allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q),
    );
  }, [allProducts, searchQuery]);

  const groupedProducts = useMemo(
    () => groupByCategory(filteredProducts),
    [filteredProducts],
  );

  const categories = Object.keys(groupedProducts).sort();

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <StickyHeader
        vendorName={initialVendor.businessName}
        showSearch={showSearch}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchToggle={() => {
          setShowSearch(!showSearch);
          if (showSearch) setSearchQuery("");
        }}
      />

      <HeroBanner vendor={initialVendor} />

      <div className="mt-6 space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <EmptyState
            message={
              searchQuery
                ? `No items match "${searchQuery}"`
                : "This vendor has no menu items yet."
            }
          />
        ) : (
          <>
            {categories.map((cat) => (
              <CategorySection
                key={cat}
                category={cat}
                products={groupedProducts[cat] ?? []}
              />
            ))}
          </>
        )}

        <RelatedVendorsStrip vendors={relatedVendors} />
      </div>

      <CartSummaryFloat />
    </div>
  );
}
