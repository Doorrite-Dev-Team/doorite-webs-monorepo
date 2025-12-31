// app/products/[id]/page.tsx (Server Component)
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";

import ProductPageClient from "@/components/product/ProductPageClient";
import ProductSkeleton from "@/components/product/ProductSkeleton";
import { api } from "@/actions/api";

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
    title: `${product.name} - ${product.vendor.businessName} | Doorrite`,
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

  // Fetch data in parallel
  const [product, relatedProducts] = await Promise.all([
    api.fetchProduct(id),
    api
      .fetchProduct(id)
      .then((p) => (p ? api.fetchVendorsProduct(p.vendorId, p.id) : [])),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductPageClient product={product} relatedProducts={relatedProducts} />
    </Suspense>
  );
}
