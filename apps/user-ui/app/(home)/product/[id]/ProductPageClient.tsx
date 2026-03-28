"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Store,
  MapPin,
  Star,
  Share2,
  Heart,
  ShoppingBag,
  Clock,
  Bike,
  ChevronRight,
  Plus,
  Minus,
} from "lucide-react";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import { toast } from "@repo/ui/components/sonner";
import { useAtom } from "jotai";
import { cartAtom } from "@/store/cartAtom";
import { CartService } from "@/services/cart-service";
import CartSummaryFloat from "@/components/cart/CartSummaryFloat";
import { isVendorOpen } from "@/libs/utils";
import { cn } from "@repo/ui/lib/utils";

interface ProductPageClientProps {
  product: Product;
  relatedProducts: Product[];
}

function StickyHeader({ productName }: { productName: string }) {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          onClick={() => router.back()}
          className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="flex-1 font-bold text-gray-900 text-base truncate leading-tight">
          {productName}
        </h1>
      </div>
    </div>
  );
}

function ProductImageHero({
  product,
  isOpen,
  onFavorite,
  onShare,
  isFavorite,
}: {
  product: Product;
  isOpen: boolean;
  onFavorite: () => void;
  onShare: () => void;
  isFavorite: boolean;
}) {
  return (
    <div className="relative w-full aspect-square sm:aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200">
      {product.imageUrl ? (
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <ShoppingBag className="w-24 h-24 text-gray-300" />
        </div>
      )}

      <div className="absolute top-3 right-3 flex gap-2">
        <button
          onClick={onFavorite}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            "bg-white/90 backdrop-blur-sm shadow-lg",
            "hover:bg-white active:scale-95 transition-all touch-manipulation",
          )}
        >
          <Heart
            className={cn(
              "w-5 h-5 transition-colors",
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-700",
            )}
          />
        </button>
        <button
          onClick={onShare}
          className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white active:scale-95 transition-all touch-manipulation"
        >
          <Share2 className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
        {!product.isAvailable ? (
          <Badge className="bg-red-500 text-white shadow-lg font-semibold">
            Sold Out
          </Badge>
        ) : isOpen ? (
          <Badge className="bg-green-500 text-white shadow-lg font-semibold">
            Available Now
          </Badge>
        ) : (
          <Badge className="bg-gray-700 text-white shadow-lg font-semibold">
            Vendor Closed
          </Badge>
        )}

        {product.rating && product.rating > 0 && (
          <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-bold text-sm text-gray-900 tabular-nums">
              {product.rating.toFixed(1)}
            </span>
            {product.reviewCount > 0 && (
              <span className="text-xs text-gray-500">
                ({product.reviewCount})
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductInfoSection({ product }: { product: Product }) {
  return (
    <div className="px-4 pt-4 pb-3 space-y-3">
      <div>
        <h2 className="font-bold text-gray-900 text-xl sm:text-2xl leading-tight mb-1">
          {product.name}
        </h2>
        {product.sku && (
          <p className="text-xs text-gray-400">SKU: {product.sku}</p>
        )}
      </div>

      {product.description && (
        <p className="text-sm text-gray-600 leading-relaxed">
          {product.description}
        </p>
      )}

      <div className="flex items-baseline gap-2 pt-2">
        <span className="text-3xl font-extrabold text-amber-600">
          ₦{product.basePrice.toLocaleString()}
        </span>
        <span className="text-sm text-gray-500">per item</span>
      </div>
    </div>
  );
}

function VendorInfoCard({ vendor }: { vendor: Product["vendor"] }) {
  const isOpen = vendor.isActive && isVendorOpen(vendor);

  return (
    <div className="px-4 pb-4">
      <Link
        href={`/vendor/${vendor.id}`}
        className={cn(
          "flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200",
          "hover:border-amber-300 hover:bg-amber-50/50",
          "active:scale-[0.98] transition-all touch-manipulation",
        )}
      >
        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
          <Store className="w-6 h-6 text-amber-600" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 mb-0.5">Sold by</p>
          <p className="font-bold text-gray-900 text-sm truncate">
            {vendor.businessName}
          </p>
          {vendor.address?.address && (
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5 truncate">
              <MapPin className="w-3 h-3 shrink-0" />
              {vendor.address.address}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Badge
            variant={isOpen ? "default" : "secondary"}
            className={cn(
              "text-[10px] font-semibold",
              isOpen
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-600",
            )}
          >
            {isOpen ? "Open" : "Closed"}
          </Badge>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>
      </Link>
    </div>
  );
}

function ProductDetailsCard({
  attributes,
  vendor,
}: {
  attributes?: Record<string, unknown>;
  vendor: Product["vendor"];
}) {
  const entries = attributes
    ? Object.entries(attributes).filter(
        ([, value]) => value !== null && value !== undefined && value !== "",
      )
    : [];

  if (
    entries.length === 0 &&
    !(vendor as { avrgPreparationTime?: string }).avrgPreparationTime &&
    !(vendor as { deliveryFee?: number }).deliveryFee
  ) {
    return null;
  }

  return (
    <div className="px-4 pb-4">
      <Card className="border border-gray-200">
        <CardContent className="p-4 space-y-3">
          <h3 className="font-bold text-gray-900 text-sm">Product Details</h3>

          <div className="space-y-2.5">
            {entries.map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between text-xs py-2 border-b border-gray-100 last:border-0"
              >
                <span className="text-gray-500 capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </span>
                <span className="font-medium text-gray-900 text-right max-w-[60%] truncate">
                  {typeof value === "boolean"
                    ? value
                      ? "Yes"
                      : "No"
                    : String(value)}
                </span>
              </div>
            ))}

            {(vendor as { avrgPreparationTime?: string })
              .avrgPreparationTime && (
              <div className="flex items-center justify-between text-xs py-2 border-b border-gray-100 last:border-0">
                <span className="text-gray-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Prep Time
                </span>
                <span className="font-medium text-gray-900">
                  {
                    (vendor as { avrgPreparationTime?: string })
                      .avrgPreparationTime
                  }
                </span>
              </div>
            )}

            {(vendor as { deliveryFee?: number }).deliveryFee !== undefined &&
              (vendor as { deliveryFee?: number }).deliveryFee !== null && (
                <div className="flex items-center justify-between text-xs py-2">
                  <span className="text-gray-500 flex items-center gap-1">
                    <Bike className="w-3.5 h-3.5" />
                    Delivery Fee
                  </span>
                  <span className="font-medium text-gray-900">
                    {(vendor as { deliveryFee?: number }).deliveryFee === 0
                      ? "Free"
                      : `₦${(vendor as { deliveryFee?: number }).deliveryFee?.toLocaleString()}`}
                  </span>
                </div>
              )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AddToCartSection({
  product,
  isOpen,
}: {
  product: Product;
  isOpen: boolean;
}) {
  const [cart, setCart] = useAtom(cartAtom);
  const [showAdded, setShowAdded] = useState(false);

  const cartItem = cart.find((item) => item.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const isDisabled =
    !product.isAvailable || !product.vendor.isActive || !isOpen;

  const addToCart = useCallback(() => {
    const newItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.basePrice,
      quantity: 1,
      vendorName: product.vendor.businessName,
      vendorId: product.vendorId,
    };

    const conflict = CartService.checkVendorConflict(
      cart,
      product.vendor.businessName,
    );

    if (conflict.hasConflict) {
      toast.error("Items from different vendors not allowed in same cart");
      return;
    }

    const newCart = CartService.addItem(cart, newItem);
    setCart(newCart);
    setShowAdded(true);
    setTimeout(() => setShowAdded(false), 1500);
  }, [cart, setCart, product]);

  const updateQuantity = useCallback(
    (delta: number) => {
      if (!cartItem) return;
      const newQuantity = cartItem.quantity + delta;
      const newCart = CartService.updateQuantity(
        cart,
        cartItem.id,
        newQuantity,
      );
      setCart(newCart);
    },
    [cart, cartItem, setCart],
  );

  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 shadow-lg">
      {quantity > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Quantity</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateQuantity(-1)}
                disabled={isDisabled}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 flex items-center justify-center disabled:opacity-40 transition-colors touch-manipulation"
              >
                <Minus className="w-4 h-4 text-gray-700" />
              </button>
              <span className="text-xl font-bold text-gray-900 min-w-[32px] text-center tabular-nums">
                {quantity}
              </span>
              <button
                onClick={() => updateQuantity(1)}
                disabled={isDisabled}
                className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-600 active:bg-amber-700 flex items-center justify-center disabled:opacity-40 transition-colors touch-manipulation"
              >
                <Plus className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <span className="text-sm font-medium text-gray-600">Subtotal</span>
            <span className="text-2xl font-extrabold text-amber-600 tabular-nums">
              ₦{(product.basePrice * quantity).toLocaleString()}
            </span>
          </div>
        </div>
      ) : (
        <Button
          onClick={addToCart}
          disabled={isDisabled}
          className={cn(
            "w-full h-13 rounded-xl text-base font-bold",
            "bg-amber-500 hover:bg-amber-600 active:bg-amber-700",
            "disabled:bg-gray-300 disabled:text-gray-500",
            "transition-all touch-manipulation",
            showAdded && "bg-green-500 hover:bg-green-500",
          )}
        >
          {showAdded ? (
            "Added to Cart! ✓"
          ) : isDisabled ? (
            !product.isAvailable ? (
              "Sold Out"
            ) : (
              "Vendor Closed"
            )
          ) : (
            <>
              <ShoppingBag className="w-5 h-5 mr-2" />
              Add to Cart
            </>
          )}
        </Button>
      )}
    </div>
  );
}

function RelatedProductsStrip({
  products,
  vendorName,
}: {
  products: Product[];
  vendorName: string;
}) {
  if (products.length === 0) return null;

  return (
    <div className="bg-gray-50 py-6 -mx-4 px-4 sm:-mx-6 sm:px-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-900 text-base">
          More from {vendorName}
        </h3>
        <Link
          href={`/vendor/${products[0]?.vendorId ?? ""}`}
          className="text-xs font-semibold text-amber-600 flex items-center gap-0.5"
        >
          View all
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="flex gap-3 overflow-x-auto scrollbar-none pb-1">
        {products.slice(0, 6).map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className={cn(
              "shrink-0 w-[140px] flex flex-col rounded-xl overflow-hidden",
              "bg-white border border-gray-100 shadow-sm",
              "hover:shadow-md active:scale-95 transition-all touch-manipulation",
            )}
          >
            <div className="relative h-28 w-full overflow-hidden bg-gray-100">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="140px"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
              )}
              {!product.isAvailable && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold bg-red-500 px-2 py-0.5 rounded-full">
                    Sold Out
                  </span>
                </div>
              )}
            </div>

            <div className="p-2 space-y-1">
              <p className="font-semibold text-xs text-gray-900 line-clamp-2 leading-tight">
                {product.name}
              </p>
              <p className="font-bold text-sm text-amber-600">
                ₦{product.basePrice.toLocaleString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function ProductPageClient({
  product,
  relatedProducts,
}: ProductPageClientProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const isOpen =
    product.vendor.isActive &&
    isVendorOpen({
      openingTime: product.vendor.openingTime ?? undefined,
      closingTime: product.vendor.closingTime ?? undefined,
    });

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: product.description || `Check out ${product.name}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied!");
      }
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
  };

  return (
    <div className="min-h-screen bg-white pb-32">
      <StickyHeader productName={product.name} />

      <ProductImageHero
        product={product}
        isOpen={isOpen}
        onFavorite={handleFavorite}
        onShare={handleShare}
        isFavorite={isFavorite}
      />

      <div className="pb-6">
        <ProductInfoSection product={product} />
        <VendorInfoCard vendor={product.vendor} />
        <ProductDetailsCard
          attributes={product.attributes}
          vendor={product.vendor}
        />
        <RelatedProductsStrip
          products={relatedProducts}
          vendorName={product.vendor.businessName}
        />
      </div>

      <AddToCartSection product={product} isOpen={isOpen} />

      <CartSummaryFloat />
    </div>
  );
}
