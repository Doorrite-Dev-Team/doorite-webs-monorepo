import { Suspense } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Store,
  Clock,
  ArrowLeft,
  Info,
  MapPin,
  ChevronRight,
} from "lucide-react";

import { Badge } from "@repo/ui/components/badge";
import { Card, CardContent } from "@repo/ui/components/card";
import { imageBurger as productFallbackImage } from "@repo/ui/assets";

import ProductActions from "@/components/product/ProductActions";
import ProductAttributes from "@/components/product/ProductAttributes";
import RelatedProducts from "@/components/product/RelatedProducts";
import ProductSkeleton from "@/components/product/ProductSkeleton";
import CartSummaryFloat from "@/components/cart/CartSummaryFloat";
import { Metadata } from "next";
import { api } from "@/actions/api";
import { isVendorOpen } from "@/libs/utils";

// Metadata generation for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await api.fetchProduct(id);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.name} - ${product.vendor.businessName}`,
    description:
      product.description ||
      `Order ${product.name} from ${product.vendor.businessName}`,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.imageUrl ? [product.imageUrl] : [],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await api.fetchProduct(id);

  if (!product) {
    notFound();
  }

  const relatedProducts = await api.fetchVendorsProduct(
    product.vendorId,
    product.id,
  );

  // revalidateCache.product(product.id);
  // revalidateCache.vendorProducts(product.vendorId);

  return (
    <div className="min-h-screen bg-gray-50 pb-24 sm:pb-8">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b shadow-sm">
        <div className="container max-w-6xl mx-auto px-4 py-3">
          <Link
            href={`/vendor/${product.vendorId}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">
              Back to {product.vendor.businessName}
            </span>
          </Link>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-6 sm:py-8">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Product Image */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <Card className="overflow-hidden border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="relative w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200">
                  <Image
                    src={product.imageUrl || productFallbackImage}
                    alt={product.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />

                  {/* Badges Overlay */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    {!product.isAvailable && (
                      <Badge
                        variant="secondary"
                        className="bg-red-500 text-white shadow-lg"
                      >
                        Out of Stock
                      </Badge>
                    )}
                    {product.vendor.isActive && isVendorOpen(product.vendor) ? (
                      <Badge
                        variant="default"
                        className="bg-green-500 text-white shadow-lg"
                      >
                        Available Now
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-gray-700 text-white shadow-lg"
                      >
                        Vendor Closed
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Product Info Card */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                    {product.name}
                  </h1>
                  {product.sku && (
                    <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                  )}
                </div>

                {product.description && (
                  <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                    {product.description}
                  </p>
                )}

                {/* Price */}
                <div className="flex items-baseline gap-2 pt-4 border-t">
                  <span className="text-4xl font-bold text-primary">
                    ₦{product.basePrice.toFixed(2)}
                  </span>
                  <span className="text-gray-500">per item</span>
                </div>

                {/* Vendor Info */}
                <Link
                  href={`/vendor/${product.vendorId}`}
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                >
                  <Store className="w-5 h-5 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-600">Sold by</p>
                    <p className="font-semibold text-gray-900 truncate">
                      {product.vendor.businessName}
                    </p>
                    {product.vendor.address && (
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {product.vendor.address.address}
                      </p>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </Link>

                {/* Actions */}
                <ProductActions product={product} />
              </CardContent>
            </Card>

            {/* Product Attributes */}
            {product.attributes &&
              Object.keys(product.attributes).length > 0 && (
                <Suspense fallback={<ProductSkeleton />}>
                  <ProductAttributes attributes={product.attributes} />
                </Suspense>
              )}

            {/* Additional Info */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" />
                  Additional Information
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3 py-2 border-b last:border-b-0">
                    <Clock className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-gray-600">Availability</p>
                      <p className="font-medium text-gray-900">
                        {product.isAvailable && isVendorOpen(product.vendor)
                          ? "Available for order now"
                          : !product.isAvailable
                            ? "Currently out of stock"
                            : "Vendor is currently closed"}
                      </p>
                    </div>
                  </div>

                  {product.vendor.isActive && (
                    <div className="flex items-start gap-3 py-2 border-b last:border-b-0">
                      <Store className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-gray-600">Vendor Hours</p>
                        <p className="font-medium text-gray-900">
                          Opens at {product.vendor.openingTime}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 sm:mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                More from {product.vendor.businessName}
              </h2>
              <Link
                href={`/vendor/${product.vendorId}`}
                className="text-primary hover:text-primary/80 font-medium text-sm sm:text-base flex items-center gap-1 transition-colors"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <Suspense fallback={<ProductSkeleton />}>
              <RelatedProducts products={relatedProducts} />
            </Suspense>
          </div>
        )}
      </div>

      {/* Floating Cart Summary */}
      <CartSummaryFloat />
    </div>
  );
}
