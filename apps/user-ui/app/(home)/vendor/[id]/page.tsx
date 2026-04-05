import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { serverApi } from "@/actions/server";
import VendorPageClient from "./VendorPageClient";

interface VendorPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const vendor = await serverApi.fetchVendor(id);

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

export default async function VendorPage({ params }: VendorPageProps) {
  const { id } = await params;

  // Fetch vendor server-side
  const vendor = await serverApi.fetchVendor(id);

  if (!vendor) {
    notFound();
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <VendorPageClient vendor={vendor} />
    </Suspense>
  );
}
