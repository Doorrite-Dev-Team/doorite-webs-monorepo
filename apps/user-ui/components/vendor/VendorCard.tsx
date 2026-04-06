"use client";

// components/explore/VendorCard.tsx

import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, Star, ChevronRight, Bike } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";
import { isVendorOpen } from "@/libs/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface VendorAddress {
  address: string;
  state?: string;
  country?: string;
  coordinates?: { lat: number; long: number };
}

export interface VendorCardProps {
  vendor: {
    id: string;
    businessName: string;
    logoUrl?: string | null;
    rating?: number | null;
    openingTime?: string | null;
    closingTime?: string | null;
    avrgPreparationTime?: string | null;
    categories?: string[] | null; // backend strings e.g. "Nigerian / Local"
    address: VendorAddress;
    isActive: boolean;
    isOpen?: boolean; // backend pre-computed — preferred
    deliveryTime?: string | null; // e.g. "25–35 mins"
    deliveryFee?: number | null; // Naira
    distance?: number | null; // km
  };
  priority?: boolean; // true for above-fold LCP images
  compact?: boolean; // horizontal strip variant
}

// ─── Cuisine map ──────────────────────────────────────────────────────────────

const CUISINE_MAP: Record<string, { label: string; icon: string }> = {
  "Nigerian / Local": { label: "Nigerian", icon: "🍛" },
  "African (non-Nigerian)": { label: "African", icon: "🌍" },
  "International (Indian, Chinese, Italian, etc.)": {
    label: "International",
    icon: "🍝",
  },
  "Fast Food / Snacks": { label: "Fast Food", icon: "🍔" },
  "Healthy / Fit Fam": { label: "Healthy", icon: "🥗" },
  "Bakery / Pastries": { label: "Bakery", icon: "🍰" },
  Seafood: { label: "Seafood", icon: "🦐" },
  "Drinks / Beverages": { label: "Drinks", icon: "🥤" },
};

function toDisplay(raw: string) {
  return CUISINE_MAP[raw] ?? { label: raw.split("/")?.[0]?.trim(), icon: "🍽️" };
}

// ─── Atoms ────────────────────────────────────────────────────────────────────

function RatingBadge({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 shrink-0">
      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
      <span className="text-xs font-bold text-gray-900 tabular-nums">
        {rating.toFixed(1)}
      </span>
    </span>
  );
}

function StatusPill({ isOpen }: { isOpen: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5",
        "text-[10px] font-semibold leading-none whitespace-nowrap",
        isOpen ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500",
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full shrink-0",
          isOpen ? "bg-green-500 animate-pulse" : "bg-gray-400",
        )}
      />
      {isOpen ? "Open" : "Closed"}
    </span>
  );
}

function FallbackAvatar({
  name,
  textSize = "text-3xl",
}: {
  name: string;
  textSize?: string;
}) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const hue =
    Array.from(name).reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;

  return (
    <div
      className={cn(
        "w-full h-full flex items-center justify-center font-extrabold text-white select-none",
        textSize,
      )}
      style={{ background: `hsl(${hue}, 52%, 50%)` }}
    >
      {initials}
    </div>
  );
}

// ─── Compact variant ──────────────────────────────────────────────────────────

function CompactCard({
  vendor,
  isOpen,
}: {
  vendor: VendorCardProps["vendor"];
  isOpen: boolean;
}) {
  const cuisineLabel = (vendor.categories ?? [])
    .slice(0, 2)
    .map((c) => toDisplay(c).label)
    .join(" · ");

  return (
    <Link
      href={`/vendor/${vendor.id}`}
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100",
        "hover:border-primary/40 hover:shadow-sm",
        "active:scale-[0.98] transition-all duration-150 touch-manipulation",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        !isOpen && "opacity-70",
      )}
    >
      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
        {vendor.logoUrl ? (
          <Image
            src={vendor.logoUrl}
            alt={vendor.businessName}
            fill
            sizes="48px"
            className="object-cover"
          />
        ) : (
          <FallbackAvatar name={vendor.businessName} textSize="text-sm" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1.5 mb-0.5">
          <p className="font-semibold text-sm text-gray-900 truncate">
            {vendor.businessName}
          </p>
          <StatusPill isOpen={isOpen} />
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          {vendor.rating ? <RatingBadge rating={vendor.rating} /> : null}
          {vendor.deliveryTime ? (
            <span className="flex items-center gap-0.5 truncate">
              <Clock className="w-3 h-3 shrink-0" />
              {vendor.deliveryTime}
            </span>
          ) : cuisineLabel ? (
            <span className="truncate">{cuisineLabel}</span>
          ) : null}
          {vendor.distance != null && (
            <span className="flex items-center gap-0.5 ml-auto text-gray-400 shrink-0">
              <MapPin className="w-3 h-3" />
              {vendor.distance < 1
                ? `${Math.round(vendor.distance * 1000)} m`
                : `${vendor.distance.toFixed(1)} km`}
            </span>
          )}
        </div>
      </div>

      <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
    </Link>
  );
}

// ─── Full card ────────────────────────────────────────────────────────────────

export default function VendorCard({
  vendor,
  priority = false,
  compact = false,
}: VendorCardProps) {
  const isOpen =
    vendor.isOpen ??
    (vendor.isActive &&
      isVendorOpen({
        openingTime: vendor.openingTime ?? undefined,
        closingTime: vendor.closingTime ?? undefined,
      }));

  if (compact) return <CompactCard vendor={vendor} isOpen={isOpen} />;

  const cuisines = (vendor.categories ?? []).slice(0, 2);

  return (
    <Link
      href={`/vendor/${vendor.id}`}
      className={cn(
        "group flex flex-col rounded-2xl overflow-hidden bg-white",
        "border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200",
        "transition-all duration-200",
        "active:scale-[0.98] touch-manipulation",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        !isOpen && "opacity-75",
      )}
    >
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <div className="relative w-full aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {vendor.logoUrl ? (
          <Image
            src={vendor.logoUrl}
            alt={`${vendor.businessName} cover`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            priority={priority}
            loading={priority ? "eager" : "lazy"}
          />
        ) : (
          <FallbackAvatar
            name={vendor.businessName}
            textSize="text-4xl sm:text-5xl"
          />
        )}

        {/* Gradient scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent pointer-events-none" />

        {/* Status pill */}
        <div className="absolute top-3 right-3 z-10">
          <StatusPill isOpen={isOpen} />
        </div>

        {/* Cuisine badges */}
        {cuisines.length > 0 && (
          <div className="absolute bottom-2.5 left-3 z-10 flex flex-wrap gap-1.5">
            {cuisines.map((c) => {
              const { label, icon } = toDisplay(c);
              return (
                <span
                  key={c}
                  className="inline-flex items-center gap-0.5 rounded-full bg-white/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium text-gray-800 leading-none"
                >
                  <span aria-hidden>{icon}</span>
                  {label}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1.5 p-3 sm:p-4 flex-1">
        {/* Name + rating */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-snug line-clamp-1 flex-1">
            {vendor.businessName}
          </h3>
          {vendor.rating ? <RatingBadge rating={vendor.rating} /> : null}
        </div>

        {/* Address */}
        {vendor.address?.address && (
          <p className="flex items-center gap-1 text-xs text-gray-500 line-clamp-1">
            <MapPin className="w-3 h-3 shrink-0 text-gray-400" aria-hidden />
            <span className="truncate">{vendor.address.address}</span>
          </p>
        )}

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 mt-auto border-t border-gray-100 text-xs text-gray-600">
          {vendor.deliveryTime && (
            <span className="flex items-center gap-1">
              <Clock
                className="w-3.5 h-3.5 text-gray-400 shrink-0"
                aria-hidden
              />
              {vendor.deliveryTime}
            </span>
          )}

          {!vendor.deliveryTime && vendor.avrgPreparationTime && (
            <span className="flex items-center gap-1">
              <Clock
                className="w-3.5 h-3.5 text-gray-400 shrink-0"
                aria-hidden
              />
              {vendor.avrgPreparationTime}
            </span>
          )}

          {vendor.deliveryFee !== undefined && vendor.deliveryFee !== null && (
            <span className="flex items-center gap-1">
              <Bike
                className="w-3.5 h-3.5 text-gray-400 shrink-0"
                aria-hidden
              />
              {vendor.deliveryFee === 0 ? (
                <span className="text-green-600 font-medium">
                  Free delivery
                </span>
              ) : (
                `₦${vendor.deliveryFee.toLocaleString()}`
              )}
            </span>
          )}

          {vendor.distance != null && (
            <span className="flex items-center gap-0.5 ml-auto text-gray-400">
              <MapPin className="w-3 h-3 shrink-0" aria-hidden />
              {vendor.distance < 1
                ? `${Math.round(vendor.distance * 1000)} m`
                : `${vendor.distance.toFixed(1)} km`}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─── Skeleton loaders ─────────────────────────────────────────────────────────

export function VendorCardSkeleton() {
  return (
    <div
      className="flex flex-col rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm animate-pulse"
      aria-hidden
    >
      <div className="w-full aspect-[16/9] bg-gray-200" />
      <div className="p-3 sm:p-4 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="h-4 bg-gray-200 rounded w-3/5" />
          <div className="h-4 bg-gray-200 rounded w-8" />
        </div>
        <div className="h-3 bg-gray-100 rounded w-2/5" />
        <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
          <div className="h-3 bg-gray-100 rounded w-16" />
          <div className="h-3 bg-gray-100 rounded w-12" />
          <div className="h-3 bg-gray-100 rounded w-8 ml-auto" />
        </div>
      </div>
    </div>
  );
}

export function VendorCardCompactSkeleton() {
  return (
    <div
      className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 animate-pulse"
      aria-hidden
    >
      <div className="w-12 h-12 rounded-xl bg-gray-200 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 bg-gray-200 rounded w-2/3" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
      </div>
      <div className="w-4 h-4 bg-gray-100 rounded shrink-0" />
    </div>
  );
}

// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import * as React from "react";
// import {
//   MapPin,
//   Clock,
//   Star,
//   ChevronRight,
//   Store,
//   CheckCircle2,
//   XCircle,
// } from "lucide-react";

// import { Badge } from "@repo/ui/components/badge";
// import { Card, CardContent } from "@repo/ui/components/card";
// import { vendorImage } from "@/libs/utils";

// interface VendorCardProps {
//   vendor: Vendor;
// }

// export default function VendorCard({ vendor }: VendorCardProps) {
//   const [imageError, setImageError] = React.useState(false);
//   const vendorLogo = vendorImage(vendor.logoUrl);

//   return (
//     <Link
//       href={`/vendor/${vendor.id}`}
//       className="block group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl"
//     >
//       <Card className="border-0 bg-white shadow-sm hover:shadow-lg transition-all duration-300 group-hover:scale-[1.01] overflow-hidden rounded-xl">
//         <CardContent className="p-0">
//           {/* Mobile Layout (< 640px) - Vertical */}
//           <div className="sm:hidden">
//             {/* Image Section */}
//             <div className="relative w-full aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-200">
//               {!imageError && vendorLogo ? (
//                 <Image
//                   src={vendorLogo}
//                   alt={vendor.businessName}
//                   fill
//                   sizes="100vw"
//                   className="object-cover transition-transform duration-300 group-hover:scale-105"
//                   onError={() => setImageError(true)}
//                   loading="lazy"
//                 />
//               ) : (
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <Store className="w-16 h-16 text-gray-400" />
//                 </div>
//               )}

//               {/* Status Badge Overlay */}
//               <div className="absolute top-3 left-3">
//                 <Badge
//                   variant={vendor.isOpen ? "default" : "secondary"}
//                   className={`text-xs font-medium shadow-md ${
//                     vendor.isOpen
//                       ? "bg-green-500 text-white"
//                       : "bg-gray-700 text-white"
//                   }`}
//                 >
//                   {vendor.isOpen ? (
//                     <CheckCircle2 className="w-3 h-3 mr-1" />
//                   ) : (
//                     <XCircle className="w-3 h-3 mr-1" />
//                   )}
//                   {vendor.isOpen ? "Open Now" : "Closed"}
//                 </Badge>
//               </div>

//               {/* Rating Badge */}
//               {vendor.rating && (
//                 <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-md flex items-center gap-1">
//                   <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
//                   <span className="text-sm font-bold text-gray-900">
//                     {vendor.rating.toFixed(1)}
//                   </span>
//                 </div>
//               )}
//             </div>

//             {/* Content Section */}
//             <div className="p-4 space-y-3">
//               {/* Title & Category */}
//               <div>
//                 <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-primary transition-colors mb-1">
//                   {vendor.businessName}
//                 </h3>
//                 <p className="text-sm text-gray-600 capitalize flex items-center gap-1">
//                   <Store className="w-3.5 h-3.5" />
//                   {vendor.category}
//                 </p>
//               </div>

//               {/* Description */}
//               {vendor.description && (
//                 <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
//                   {vendor.description}
//                 </p>
//               )}

//               {/* Meta Information */}
//               <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
//                 {vendor.distance !== undefined && (
//                   <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 rounded-full px-2.5 py-1">
//                     <MapPin className="w-3.5 h-3.5" />
//                     <span className="font-medium">
//                       {vendor.distance.toFixed(1)} km
//                     </span>
//                   </div>
//                 )}

//                 {vendor.avrgPreparationTime && (
//                   <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 rounded-full px-2.5 py-1">
//                     <Clock className="w-3.5 h-3.5" />
//                     <span className="font-medium">
//                       {vendor.avrgPreparationTime}
//                     </span>
//                   </div>
//                 )}

//                 {/*{vendor.priceRange && (
//                   <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 rounded-full px-2.5 py-1">
//                     <span className="font-medium">
//                       ₦{vendor.priceRange ?? 2000}
//                     </span>
//                   </div>
//                 )}*/}
//               </div>

//               {/* Tags */}
//               {/*{vendor.tags && vendor.tags.length > 0 && (
//                 <div className="flex flex-wrap gap-1.5">
//                   {vendor.tags.slice(0, 3).map((tag) => (
//                     <Badge
//                       key={tag}
//                       variant="outline"
//                       className="text-xs bg-blue-50 text-blue-700 border-blue-200"
//                     >
//                       {tag}
//                     </Badge>
//                   ))}
//                 </div>
//               )}*/}
//             </div>
//           </div>

//           {/* Desktop/Tablet Layout (>= 640px) - Horizontal */}
//           <div className="hidden sm:block p-4">
//             <div className="flex gap-4">
//               {/* Image */}
//               <div className="relative w-28 h-28 lg:w-32 lg:h-32 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-sm">
//                 {!imageError && vendorLogo ? (
//                   <Image
//                     src={vendorLogo}
//                     alt={vendor.businessName}
//                     fill
//                     sizes="(max-width: 1024px) 112px, 128px"
//                     className="object-cover transition-transform duration-300 group-hover:scale-110"
//                     onError={() => setImageError(true)}
//                     loading="lazy"
//                   />
//                 ) : (
//                   <div className="absolute inset-0 flex items-center justify-center">
//                     <Store className="w-12 h-12 text-gray-400" />
//                   </div>
//                 )}
//               </div>

//               {/* Info Section */}
//               <div className="flex-1 min-w-0 flex flex-col justify-between">
//                 {/* Top Section */}
//                 <div>
//                   <div className="flex items-start justify-between gap-3 mb-2">
//                     <div className="flex-1 min-w-0">
//                       <h3 className="text-lg lg:text-xl font-bold text-gray-900 truncate group-hover:text-primary transition-colors mb-1">
//                         {vendor.businessName}
//                       </h3>
//                       <p className="text-sm text-gray-600 capitalize flex items-center gap-1.5">
//                         <Store className="w-3.5 h-3.5 flex-shrink-0" />
//                         <span>{vendor.category}</span>
//                         {vendor.avrgPreparationTime && (
//                           <>
//                             <span className="text-gray-400">•</span>
//                             <Clock className="w-3.5 h-3.5 flex-shrink-0" />
//                             <span>{vendor.avrgPreparationTime}</span>
//                           </>
//                         )}
//                       </p>
//                     </div>

//                     {/* Rating & Price */}
//                     <div className="flex flex-col items-end gap-1">
//                       {vendor.rating && (
//                         <div className="flex items-center gap-1 bg-yellow-50 rounded-full px-2 py-0.5">
//                           <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
//                           <span className="text-sm font-bold text-gray-900">
//                             {vendor.rating.toFixed(1)}
//                           </span>
//                         </div>
//                       )}
//                       {/*{vendor.priceRange && (
//                         <span className="text-xs font-medium text-gray-600 flex items-center gap-0.5">
//                           ₦{vendor.priceRange ?? 2000}
//                         </span>
//                       )}*/}
//                     </div>
//                   </div>

//                   {/* Description */}
//                   {vendor.description && (
//                     <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-3">
//                       {vendor.description}
//                     </p>
//                   )}
//                 </div>

//                 {/* Bottom Section */}
//                 <div className="flex items-center justify-between gap-3">
//                   <div className="flex items-center gap-2 flex-wrap">
//                     <Badge
//                       variant={vendor.isOpen ? "default" : "secondary"}
//                       className={`text-xs font-medium ${
//                         vendor.isOpen
//                           ? "bg-green-500 text-white"
//                           : "bg-gray-500 text-white"
//                       }`}
//                     >
//                       {vendor.isOpen ? (
//                         <CheckCircle2 className="w-3 h-3 mr-1" />
//                       ) : (
//                         <XCircle className="w-3 h-3 mr-1" />
//                       )}
//                       {vendor.isOpen ? "Open" : "Closed"}
//                     </Badge>

//                     {vendor.distance !== undefined && (
//                       <div className="flex items-center gap-1 text-xs text-gray-600">
//                         <MapPin className="w-3.5 h-3.5" />
//                         <span className="font-medium">
//                           {vendor.distance.toFixed(1)} km
//                         </span>
//                       </div>
//                     )}

//                     {/* Tags */}
//                     {/*{vendor.tags &&
//                       vendor.tags.slice(0, 2).map((tag) => (
//                         <Badge
//                           key={tag}
//                           variant="outline"
//                           className="text-xs bg-blue-50 text-blue-700 border-blue-200"
//                         >
//                           {tag}
//                         </Badge>
//                       ))}
//                   </div>*/}

//                     <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </Link>
//   );
// }
