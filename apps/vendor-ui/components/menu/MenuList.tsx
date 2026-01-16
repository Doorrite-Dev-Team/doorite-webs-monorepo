"use client";

import api, { type ProductsResponse } from "@/actions/api";
import apiClient from "@/libs/api/client";
import { deriveError } from "@/libs/utils/errorHandler";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Skeleton } from "@repo/ui/components/skeleton";
import { toast } from "@repo/ui/components/sonner";
import { Switch } from "@repo/ui/components/switch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Package, Plus, Search } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import CreateProductSheet from "./CreateProduct";

const updateProductAvailability = async ({
  productId,
  isAvailable,
}: {
  productId: string;
  isAvailable: boolean;
}) => {
  const response = await apiClient.put(`vendors/products/${productId}`, {
    isAvailable,
  });
  return response.data;
};

export default function MenuList() {
  const queryClient = useQueryClient();
  const [showCreateSheet, setShowCreateSheet] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Fetch products with TanStack Query
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["vendor-products", currentPage, pageSize],
    queryFn: () => api.fetchProducts(currentPage, pageSize),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });

  // Mutation for updating product availability
  const updateAvailabilityMutation = useMutation({
    mutationFn: updateProductAvailability,
    onMutate: async ({ productId, isAvailable }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["vendor-products"],
      });

      // Snapshot previous value
      const previousData = queryClient.getQueryData<ProductsResponse>([
        "vendor-products",
        currentPage,
        pageSize,
      ]);

      // Optimistically update
      if (previousData) {
        queryClient.setQueryData<ProductsResponse>(
          ["vendor-products", currentPage, pageSize],
          {
            ...previousData,
            products: previousData.products.map((p) =>
              p.id === productId ? { ...p, isAvailable } : p,
            ),
          },
        );
      }

      return { previousData };
    },
    onSuccess: (_, variables) => {
      toast.success(
        `Product ${variables.isAvailable ? "enabled" : "disabled"}`,
        {
          description: `Product is now ${variables.isAvailable ? "available" : "unavailable"} for orders`,
        },
      );
    },
    onError: (error, _, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(
          ["vendor-products", currentPage, pageSize],
          context.previousData,
        );
      }

      const message = deriveError(error);
      console.warn(error);
      toast.error("Failed to update product", {
        description: message || "Please try again",
      });
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({
        queryKey: ["vendor-products"],
      });
    },
  });

  const handleToggleAvailability = (
    productId: string,
    currentStatus: boolean,
  ) => {
    updateAvailabilityMutation.mutate({
      productId,
      isAvailable: !currentStatus,
    });
  };

  const handleProductCreated = () => {
    // Invalidate and refetch products after creation
    queryClient.invalidateQueries({
      queryKey: ["vendor-products"],
    });

    // If we're not on page 1, go to page 1 to see the new product
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  };

  const products = data?.products || [];
  const pagination = data?.pagination || {
    totalProducts: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 10,
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Error State
  if (isError) {
    return (
      <div className="p-4 md:p-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Failed to load products
            </h3>
            <p className="text-sm text-gray-600 text-center mb-6 max-w-sm">
              {error?.message || "Something went wrong. Please try again."}
            </p>
            <Button onClick={() => refetch()} variant="outline">
              <Loader2 className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading State
  if (isLoading) {
    return (
      <div className="p-4 md:p-8">
        <div className="mb-6">
          <Skeleton className="h-8 w-32 mb-4" />
          <Skeleton className="h-10 w-full max-w-sm" />
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-20 h-20 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="w-12 h-6 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 pb-24">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Menu</h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage your products and availability
            </p>
          </div>
          <Button
            onClick={() => setShowCreateSheet(true)}
            className="hidden md:flex bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Search */}
        {products.length > 0 && (
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        )}
      </div>

      {/* Empty State */}
      {products.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No products yet
            </h3>
            <p className="text-sm text-gray-500 text-center mb-6 max-w-sm">
              Start building your menu by adding your first product. Your
              customers will be able to browse and order from your menu.
            </p>
            <Button
              onClick={() => setShowCreateSheet(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Product
            </Button>
          </CardContent>
        </Card>
      ) : filteredProducts.length === 0 && searchQuery ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-sm text-gray-500 text-center mb-6 max-w-sm">
              No products match <q>{searchQuery}</q>. Try a different search
              term.
            </p>
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Clear Search
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Products List */}
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden hover:shadow-md transition-shadow"
              >
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 p-4">
                    {/* Product Image */}
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-300" />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 text-lg truncate">
                          {product.name}
                        </h3>
                        <Badge
                          variant={
                            product.isAvailable ? "default" : "secondary"
                          }
                          className={
                            product.isAvailable
                              ? "bg-green-100 text-green-700 hover:bg-green-100"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                          }
                        >
                          {product.isAvailable ? "Available" : "Unavailable"}
                        </Badge>
                      </div>

                      {product.description && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {product.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="font-semibold text-green-600">
                          ₦{product.basePrice.toLocaleString()}
                        </span>
                        {product.sku && (
                          <>
                            <span className="text-gray-300">•</span>
                            <span className="text-gray-500">
                              SKU: {product.sku}
                            </span>
                          </>
                        )}
                        {product.variants && product.variants.length > 0 && (
                          <>
                            <span className="text-gray-300">•</span>
                            <Badge variant="outline" className="text-xs">
                              {product.variants.length} variant
                              {product.variants.length !== 1 ? "s" : ""}
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Availability Toggle */}
                    <div className="flex items-center gap-3 md:flex-col md:items-end">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 hidden md:block">
                          {product.isAvailable ? "Disable" : "Enable"}
                        </span>
                        <Switch
                          checked={product.isAvailable}
                          disabled={updateAvailabilityMutation.isPending}
                          onCheckedChange={() =>
                            handleToggleAvailability(
                              product.id,
                              product.isAvailable,
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-600">
                Showing {filteredProducts.length} of {pagination.totalProducts}{" "}
                products
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1 || isLoading}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                >
                  Previous
                </Button>
                <div className="flex items-center px-3 text-sm text-gray-600">
                  Page {currentPage} of {pagination.totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === pagination.totalPages || isLoading}
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(pagination.totalPages, prev + 1),
                    )
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Floating Action Button (Mobile) */}
      <Button
        onClick={() => setShowCreateSheet(true)}
        className="md:hidden fixed bottom-20 right-6 w-14 h-14 rounded-full shadow-lg bg-green-600 hover:bg-green-700 p-0"
        size="icon"
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Create Product Sheet */}
      <CreateProductSheet
        open={showCreateSheet}
        onOpenChangeAction={setShowCreateSheet}
        onSuccessAction={handleProductCreated}
      />
    </div>
  );
}
