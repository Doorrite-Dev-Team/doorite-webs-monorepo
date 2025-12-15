import { Suspense } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { MapPin, Clock, Star, Store, ChevronRight } from "lucide-react";

import { Badge } from "@repo/ui/components/badge";
import { Card, CardContent } from "@repo/ui/components/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";

import VendorMenuSection from "@/components/vendor/VendorMenuSection";
import VendorReviewsSection from "@/components/vendor/VendorReviewsSection";
import CartSummaryFloat from "@/components/cart/CartSummaryFloat";
import RelatedVendors from "@/components/vendor/RelatedVendors";
import VendorSkeleton from "@/components/vendor/VendorSkeleton";
import { Metadata } from "next";
import { api } from "@/actions/api";
import { calculateVendorPriceRange } from "@/libs/helper";

// Metadata generation for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const vendor = await api.fetchVendor(id);

  if (!vendor) {
    return {
      title: "Vendor Not Found",
    };
  }

  return {
    title: `${vendor.businessName} - Order Now`,
    description: vendor.description || `Order from ${vendor.businessName}`,
    openGraph: {
      title: vendor.businessName,
      description: vendor.description,
      images: vendor.logoUrl ? [vendor.logoUrl] : [],
    },
  };
}

export default async function VendorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vendor = await api.fetchVendor(id);

  if (!vendor) {
    notFound();
  }

  // Fetch products and related vendors in parallel
  const [products, relatedVendors] = await Promise.all([
    api.fetchVendorsProduct(id),
    api.fetchRelatedVendors(vendor.category, vendor.id),
  ]);

  // Group products by category
  const groupedProducts = products.reduce(
    (acc, product) => {
      const category = product.attributes?.category || "Other";
      if (!acc[category]) acc[category] = [];
      acc[category].push(product);
      return acc;
    },
    {} as Record<string, Product[]>,
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24 sm:pb-8">
      {/* Hero Section */}
      <div className="relative h-48 sm:h-64 lg:h-80 w-full bg-gradient-to-br from-gray-800 to-gray-900">
        {vendor.logoUrl && (
          <Image
            src={vendor.logoUrl}
            alt={vendor.businessName}
            fill
            className="object-cover opacity-60"
            priority
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Floating Info Card */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-1/2">
          <div className="container max-w-6xl mx-auto px-4">
            <Card className="shadow-xl border-0">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <Store className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                          {vendor.businessName}
                        </h1>
                        <p className="text-gray-600 text-sm sm:text-base capitalize">
                          {vendor.category}
                        </p>
                      </div>
                    </div>

                    {vendor.description && (
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-3">
                        {vendor.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <Badge
                        variant={vendor.isOpen ? "default" : "secondary"}
                        className={`text-xs sm:text-sm ${
                          vendor.isOpen
                            ? "bg-green-500 text-white"
                            : "bg-gray-500 text-white"
                        }`}
                      >
                        {vendor.isOpen ? "Open Now" : "Closed"}
                      </Badge>

                      {vendor.rating && (
                        <div className="flex items-center gap-1 bg-yellow-50 rounded-full px-2 sm:px-3 py-1">
                          <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm sm:text-base font-bold text-gray-900">
                            {vendor.rating.toFixed(1)}
                          </span>
                        </div>
                      )}

                      {products && (
                        <Badge variant="outline" className="text-xs sm:text-sm">
                          {calculateVendorPriceRange(products)}
                        </Badge>
                      )}

                      {vendor.avrgPreparationTime && (
                        <div className="flex items-center gap-1 text-gray-600 text-xs sm:text-sm">
                          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span>{vendor.avrgPreparationTime}</span>
                        </div>
                      )}

                      {vendor.distance !== undefined && (
                        <div className="flex items-center gap-1 text-gray-600 text-xs sm:text-sm">
                          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span>{vendor.distance.toFixed(1)} km</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-6xl mx-auto px-4 mt-24 sm:mt-32 lg:mt-36">
        <Tabs defaultValue="menu" className="w-full">
          <TabsList className="w-full justify-start mb-6 bg-white shadow-sm p-1 rounded-lg overflow-x-auto">
            <TabsTrigger value="menu" className="flex-1 sm:flex-none">
              Menu
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex-1 sm:flex-none">
              Reviews
            </TabsTrigger>
            <TabsTrigger value="info" className="flex-1 sm:flex-none">
              Info
            </TabsTrigger>
          </TabsList>

          <TabsContent value="menu" className="space-y-6">
            <Suspense fallback={<VendorSkeleton />}>
              <VendorMenuSection
                groupedProducts={groupedProducts}
                vendorId={vendor.id.toString()}
              />
            </Suspense>
          </TabsContent>

          <TabsContent value="reviews">
            <Suspense fallback={<VendorSkeleton />}>
              <VendorReviewsSection vendorId={vendor.id.toString()} />
            </Suspense>
          </TabsContent>

          <TabsContent value="info">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Contact Information
                </h3>

                <div className="space-y-3">
                  {vendor.distance !== undefined && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-medium text-gray-900">
                          {vendor.distance.toFixed(1)} km away
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">Hours</p>
                      <p className="font-medium text-gray-900">
                        {vendor.isOpen ? "Open Now" : "Closed"}
                      </p>
                    </div>
                  </div>

                  {/*{vendor.tags && vendor.tags.length > 0 && (
                    <div className="pt-4 border-t">
                      <p className="text-sm text-gray-600 mb-2">Specialties</p>
                      <div className="flex flex-wrap gap-2">
                        {vendor.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}*/}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Related Vendors */}
        {relatedVendors.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Similar Vendors
              </h2>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
            <RelatedVendors vendors={relatedVendors} />
          </div>
        )}
      </div>

      {/* Floating Cart Summary */}
      <CartSummaryFloat />
    </div>
  );
}
