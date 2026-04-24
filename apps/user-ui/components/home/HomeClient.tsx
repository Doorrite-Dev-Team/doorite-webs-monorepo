"use client";

import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { userAtom } from "@/store/userAtom";
import { HeroBanner } from "./sections/HeroBanner";
import { CategoryPills } from "./sections/CategoryPills";
import { ActiveOrderBanner } from "./sections/ActiveOrderBanner";
import { PromoBanner } from "./sections/PromoBanner";
import { PopularVendorsSection } from "./sections/PopularVendorsSection";
import { LiveTrackingSection } from "./sections/LiveTrackingSection";
import { RecentOrdersSection } from "./sections/RecentOrdersSection";
import { MoreVendorsGrid } from "./sections/MoreVendorsGrid";
import { FooterCTA } from "./sections/FooterCTA";
import { ReferralCard } from "./sections/ReferralCard";
import { findActiveOrder } from "@/libs/home";
import { api } from "@/actions/api";
import LocationConsent from "@/components/explore/LocationConsent";
import SavedAddressPicker from "@/components/explore/SavedAddressPicker";
import AddAddressDialog from "@/components/account/address/Dialogue";
import { toast } from "@repo/ui/components/sonner";

const SESSION_LOCATION_KEY = "session_location_data";

type LocationData =
  | { type: "browser"; coords: { lat: number; long: number } }
  | {
      type: "address";
      address: string;
      state?: string;
      country?: string;
      coords: { lat: number; long: number };
    }
  | { type: "denied" };

interface HomeClientProps {
  user: User | null;
  recentOrders: Order[];
  topVendors: Vendor[];
  message?: string;
  addresses?: Address[];
}

/**
 * Main home page client component
 *
 * Mobile-first responsive layout based on h.tsx design:
 * - Dark hero banner with search and avatar
 * - Horizontal scrolling cuisine category pills
 * - Active order banner (when applicable)
 * - Promo banner for top rated
 * - Horizontal vendor strip
 * - Live order tracking map (when applicable)
 * - Recent orders horizontal scroll
 * - More restaurants grid
 * - Footer CTA button
 */
export default function HomeClient({
  user,
  recentOrders,
  topVendors,
  message,
  addresses,
}: HomeClientProps) {
  const [userFromAtom] = useAtom(userAtom);
  const [userCoords, setUserCoords] = useState<{
    lat: number;
    long: number;
  } | null>(null);
  const [sessionAddress, setSessionAddress] = useState<string | null>(null);
  const [showLocationConsent, setShowLocationConsent] = useState(false);
  const [showAddressPicker, setShowAddressPicker] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);

  const activeOrder = findActiveOrder(recentOrders);

  // Initialize location
  useEffect(() => {
    const initLocation = () => {
      try {
        const sessionData = sessionStorage.getItem(SESSION_LOCATION_KEY);
        if (sessionData) {
          const data: LocationData = JSON.parse(sessionData);
          if (data.type !== "denied") {
            setUserCoords(data.coords);
            if (data.type === "address") {
              setSessionAddress(data.address);
            }
          } else {
            setShowLocationConsent(true);
          }
        } else {
          setShowLocationConsent(true);
        }
      } catch {
        sessionStorage.removeItem(SESSION_LOCATION_KEY);
        setShowLocationConsent(true);
      }
    };

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      window.requestIdleCallback(initLocation);
    } else {
      setTimeout(initLocation, 0);
    }
  }, []);

  const handleLocationAccept = (coords: { lat: number; long: number }) => {
    const data: LocationData = { type: "browser", coords };
    sessionStorage.setItem(SESSION_LOCATION_KEY, JSON.stringify(data));
    setUserCoords(coords);
    setSessionAddress(null);
    setShowLocationConsent(false);
  };

  const handleLocationDeny = () => {
    const data: LocationData = { type: "denied" };
    sessionStorage.setItem(SESSION_LOCATION_KEY, JSON.stringify(data));

    const addressesWithCoords = (userFromAtom?.address || []).filter(
      (addr) => addr.coordinates?.lat && addr.coordinates?.long,
    );

    if (addressesWithCoords.length > 0) {
      setShowLocationConsent(false);
      setShowAddressPicker(true);
    } else {
      setShowLocationConsent(false);
    }
  };

  const handleSelectSavedAddress = (coords: { lat: number; long: number }) => {
    // Find the full address from user's saved addresses
    const fullAddr = userFromAtom?.address?.find(
      (a) =>
        a.coordinates?.lat === coords.lat &&
        a.coordinates?.long === coords.long,
    );

    // Build display address: use address field, or fallback to state, country
    const displayAddr =
      fullAddr?.address ||
      [fullAddr?.state, fullAddr?.country].filter(Boolean).join(", ");

    const data: LocationData = {
      type: "address",
      address: displayAddr,
      state: fullAddr?.state,
      country: fullAddr?.country,
      coords,
    };
    sessionStorage.setItem(SESSION_LOCATION_KEY, JSON.stringify(data));
    setUserCoords(coords);
    setSessionAddress(displayAddr);
    setShowAddressPicker(false);
  };

  const handleRequestLocation = () => {
    setShowLocationConsent(true);
  };

  const handleSelectAddress = (address: Address) => {
    if (address.coordinates) {
      // Build display address: use address field, or fallback to state, country
      const displayAddr =
        address.address ||
        [address.state, address.country].filter(Boolean).join(", ");

      const data: LocationData = {
        type: "address",
        address: displayAddr,
        state: address.state,
        country: address.country,
        coords: address.coordinates,
      };
      sessionStorage.setItem(SESSION_LOCATION_KEY, JSON.stringify(data));
      setUserCoords(address.coordinates);
      setSessionAddress(displayAddr);
    }
  };

  const handleAddAddress = async (addressData: DeliveryAddressForm) => {
    try {
      await api.addAddress(addressData);
      toast.success("Address added successfully");
    } catch {
      toast.error("Failed to add address");
    }
    setShowAddAddress(false);
  };

  // Split vendors: first 6 in horizontal strip, remaining in grid below
  const stripVendors = topVendors.slice(0, 6);
  const gridVendors = topVendors.slice(6);

  return (
    <div className="min-h-screen bg-background pb-28">
      <LocationConsent
        open={showLocationConsent}
        onAccept={handleLocationAccept}
        onDeny={handleLocationDeny}
      />
      <SavedAddressPicker
        open={showAddressPicker}
        addresses={userFromAtom?.address || []}
        onSelect={handleSelectSavedAddress}
        onSkip={() => setShowAddressPicker(false)}
      />
      <AddAddressDialog
        open={showAddAddress}
        onOpenChange={(open) => setShowAddAddress(open)}
        onSubmit={handleAddAddress}
        isLoading={false}
      />

      {/* Hero Banner with Search */}
      <HeroBanner
        user={user}
        userCoords={userCoords}
        sessionAddress={sessionAddress}
        onRequestLocation={handleRequestLocation}
        onAddAddress={() => setShowAddAddress(true)}
        addresses={addresses}
        selectedAddress={sessionAddress || undefined}
        onSelectAddress={handleSelectAddress}
      />

      {/* Category Pills */}
      <div className="bg-white pt-4 pb-3 shadow-sm">
        <CategoryPills />
      </div>

      <div className="space-y-7 pt-6">
        {/* Active Order Banner */}
        {activeOrder && <ActiveOrderBanner order={activeOrder} />}

         {/* Promo Banner */}
         <PromoBanner />
         <ReferralCard />
 
         {/* Popular Vendors Strip */}

        <PopularVendorsSection vendors={stripVendors} />

        {/* Live Order Tracker */}
        {activeOrder && <LiveTrackingSection order={activeOrder} />}

        {/* Recent Orders */}
        <RecentOrdersSection orders={recentOrders} />

        {/* More Restaurants Grid */}
        <MoreVendorsGrid vendors={gridVendors} message={message} />

        {/* Footer CTA */}
        <FooterCTA />
      </div>
    </div>
  );
}
