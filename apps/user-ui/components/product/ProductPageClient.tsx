// components/product/ProductPageClient.tsx (Client Component)
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Store,
  Clock,
  Info,
  MapPin,
  ChevronRight,
  Star,
  Share2,
  Heart,
} from "lucide-react";
import { motion } from "framer-motion";

import { Badge } from "@repo/ui/components/badge";
import { Card, CardContent } from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";
import { imageBurger as productFallbackImage } from "@repo/ui/assets";

import { PageHeaderWithActions } from "@/components/headers/PageHeader";
import ProductActions from "@/components/product/ProductActions";
import ProductAttributes from "@/components/product/ProductAttributes";
import RelatedProducts from "@/components/product/RelatedProducts";
import CartSummaryFloat from "@/components/cart/CartSummaryFloat";
import { isVendorOpen } from "@/libs/utils";
import { toast } from "@repo/ui/components/sonner";
import { api } from "@/actions/api";

interface ProductPageClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductPageClient({
  product,
  relatedProducts,
}: ProductPageClientProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [, setIsLoadingFavorite] = useState(true);
  const isOpen = product.vendor.isActive && isVendorOpen(product.vendor);

  // Load user's favorites on mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const result = await api.fetchFavorites();
        if (result.success) {
          const isFav = result.favorites.some((fav) => fav.id === product.id);
          setIsFavorite(isFav);
        }
      } catch (error) {
        console.error("Failed to load favorites:", error);
      } finally {
        setIsLoadingFavorite(false);
      }
    };

    loadFavorites();
  }, [product.id]);

  const handleFavorite = async () => {
    setIsFavorite((prev) => {
      const newState = !prev;
      // Optimistically update UI
      setIsFavorite(newState);
      return newState;
    });

    try {
      if (isFavorite) {
        // Remove from favorites
        const result = await api.removeFromFavorites(product.id);
        if (!result.success) {
          // Revert on failure
          setIsFavorite(!isFavorite);
          toast.error(result.error || "Failed to remove from favorites");
        } else {
          toast.success("Removed from favorites");
        }
      } else {
        // Add to favorites
        const result = await api.addToFavorites(product.id);
        if (!result.success) {
          // Revert on failure
          setIsFavorite(!isFavorite);
          toast.error(result.error || "Failed to add to favorites");
        } else {
          toast.success("Added to favorites");
        }
      }
    } catch {
      // Revert on error
      setIsFavorite(!isFavorite);
      toast.error("Failed to update favorites");
    }
  };

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
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24 sm:pb-8">
      <PageHeaderWithActions
        title={product.name}
        sticky
        actions={
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFavorite}
              className="rounded-full"
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
                }`}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="rounded-full"
            >
              <Share2 className="w-5 h-5 text-gray-600" />
            </Button>
          </>
        }
      />

      <div className="container max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Product Image - 2/5 width on large screens */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-2 lg:sticky lg:top-24 lg:h-fit"
          >
            <Card className="overflow-hidden border-0 shadow-xl">
              <CardContent className="p-0">
                <div className="relative w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200">
                  <Image
                    src={product.imageUrl || productFallbackImage}
                    alt={product.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                    priority
                  />

                  {/* Badges Overlay */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    {!product.isAvailable && (
                      <Badge className="bg-red-500 text-white shadow-lg">
                        Out of Stock
                      </Badge>
                    )}
                    {isOpen ? (
                      <Badge className="bg-green-500 text-white shadow-lg">
                        Available Now
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-700 text-white shadow-lg">
                        Vendor Closed
                      </Badge>
                    )}
                  </div>

                  {/* Rating Badge */}
                  {product.rating && product.rating > 0 && (
                    <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-gray-900">
                          {product.rating.toFixed(1)}
                        </span>
                        {product.reviewCount != null &&
                          product.reviewCount > 0 && (
                            <span className="text-sm text-gray-500">
                              ({product.reviewCount})
                            </span>
                          )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Product Details - 3/5 width on large screens */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-3 space-y-6"
          >
            {/* Product Info Card */}
            <Card className="border-0 shadow-xl">
              <CardContent className="p-6 sm:p-8 space-y-6">
                {/* Header */}
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 leading-tight">
                    {product.name}
                  </h1>
                  {product.sku && (
                    <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                  )}
                </div>

                {/* Description */}
                {product.description && (
                  <div className="pt-4 border-t">
                    <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Price Section */}
                <div className="pt-6 border-t">
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Price</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl sm:text-5xl font-bold text-primary">
                          ₦{product.basePrice.toLocaleString()}
                        </span>
                        <span className="text-gray-500">per item</span>
                      </div>
                    </div>

                    {/* Stock Status */}
                    {product.isAvailable ? (
                      <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                        <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                        <span className="font-medium text-sm">In Stock</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg">
                        <span className="font-medium text-sm">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Vendor Info */}
                <div className="pt-6 border-t">
                  <Link
                    href={`/vendor/${product.vendorId}`}
                    className="flex items-center gap-4 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl hover:shadow-md transition-all duration-300 group border border-gray-100"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Store className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-0.5">Sold by</p>
                      <p className="font-bold text-gray-900 truncate text-lg">
                        {product.vendor.businessName}
                      </p>
                      {product.vendor.address && (
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {product.vendor.address.address}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </Link>
                </div>

                {/* Actions */}
                <div className="pt-6 border-t">
                  <ProductActions product={product} />
                </div>
              </CardContent>
            </Card>

            {/* Product Attributes */}
            {product.attributes &&
              Object.keys(product.attributes).length > 0 && (
                <ProductAttributes attributes={product.attributes} />
              )}

            {/* Additional Info */}
            <Card className="border-0 shadow-xl">
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" />
                  Additional Information
                </h3>

                <div className="space-y-4">
                  <InfoItem
                    icon={<Clock className="w-5 h-5" />}
                    label="Availability"
                    value={
                      product.isAvailable && isOpen
                        ? "Available for order now"
                        : !product.isAvailable
                          ? "Currently out of stock"
                          : "Vendor is currently closed"
                    }
                  />

                  {product.vendor.isActive && (
                    <>
                      <InfoItem
                        icon={<Store className="w-5 h-5" />}
                        label="Vendor Status"
                        value={isOpen ? "Open now" : "Closed"}
                      />
                      {product.vendor.deliveryTime && (
                        <InfoItem
                          icon={<Clock className="w-5 h-5" />}
                          label="Estimated Prep Time"
                          value={product.vendor.deliveryTime}
                        />
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-12 sm:mt-16"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                More from {product.vendor.businessName}
              </h2>
              <Link
                href={`/vendor/${product.vendorId}`}
                className="text-primary hover:text-primary/80 font-medium text-sm sm:text-base flex items-center gap-1 transition-colors group"
              >
                View All
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <RelatedProducts products={relatedProducts} />
          </motion.div>
        )}
      </div>

      {/* Floating Cart Summary */}
      <CartSummaryFloat />
    </div>
  );
}

// Info Item Component
function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50">
      <div className="text-gray-500 mt-0.5 flex-shrink-0">{icon}</div>
      <div className="flex-1">
        <p className="text-sm text-gray-600 mb-0.5">{label}</p>
        <p className="font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}
