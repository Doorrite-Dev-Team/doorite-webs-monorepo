"use client";

import React, { useEffect, useState } from "react";
import Map, { Marker, NavigationControl, GeolocateControl, Layer, Source } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useAtomValue } from "jotai";
import { activeOrderAtom } from "@/store/orderAtom";
import { MapPin, Package, Home } from "lucide-react";
import OrderStatusCard from "./OrderStatusCard";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

interface MapProps {
  markers?: {
    id: string;
    lat: number;
    lng: number;
    type: "pickup" | "dropoff" | "rider";
  }[];
}

export default function RiderMap({ markers = [] }: MapProps) {
  const activeOrder = useAtomValue(activeOrderAtom);

  const [viewState, setViewState] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    zoom: 14,
  });
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Get user location on mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setViewState((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
        },
        (error) => console.error("Error getting location:", error),
      );
    }
  }, []);

  // Auto-fit bounds when active order changes
  useEffect(() => {
    if (activeOrder && userLocation) {
      const bounds: [[number, number], [number, number]] = [
        [
          Math.min(activeOrder.pickupLocation.lng, activeOrder.dropoffLocation.lng, userLocation.lng),
          Math.min(activeOrder.pickupLocation.lat, activeOrder.dropoffLocation.lat, userLocation.lat),
        ],
        [
          Math.max(activeOrder.pickupLocation.lng, activeOrder.dropoffLocation.lng, userLocation.lng),
          Math.max(activeOrder.pickupLocation.lat, activeOrder.dropoffLocation.lat, userLocation.lat),
        ],
      ];
      // TODO: Implement fitBounds using map ref
    }
  }, [activeOrder, userLocation]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 text-red-500">
        Missing Mapbox Token - Set NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <GeolocateControl position="top-left" />
        <NavigationControl position="top-left" />

        {/* User Location Marker */}
        {userLocation && (
          <Marker
            latitude={userLocation.lat}
            longitude={userLocation.lng}
            anchor="bottom"
          >
            <div className="relative">
              <span className="flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-blue-600 border-2 border-white shadow-lg"></span>
              </span>
            </div>
          </Marker>
        )}

        {/* Active Order Markers */}
        {activeOrder && (
          <>
            {/* Pickup Location */}
            <Marker
              latitude={activeOrder.pickupLocation.lat}
              longitude={activeOrder.pickupLocation.lng}
              anchor="bottom"
            >
              <div className="flex flex-col items-center">
                <div className="bg-green-500 rounded-full p-2 shadow-lg">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div className="mt-1 bg-white px-2 py-1 rounded shadow text-xs font-semibold">
                  Pickup
                </div>
              </div>
            </Marker>

            {/* Dropoff Location */}
            <Marker
              latitude={activeOrder.dropoffLocation.lat}
              longitude={activeOrder.dropoffLocation.lng}
              anchor="bottom"
            >
              <div className="flex flex-col items-center">
                <div className="bg-red-500 rounded-full p-2 shadow-lg">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <div className="mt-1 bg-white px-2 py-1 rounded shadow text-xs font-semibold">
                  Drop-off
                </div>
              </div>
            </Marker>
          </>
        )}

        {/* Other Markers */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            latitude={marker.lat}
            longitude={marker.lng}
            anchor="bottom"
          >
            <MapPin
              className={`w-8 h-8 ${marker.type === "pickup"
                ? "text-green-500 fill-green-100"
                : "text-red-500 fill-red-100"
                }`}
            />
          </Marker>
        ))}
      </Map>

      {/* Order Status Card */}
      <OrderStatusCard />
    </div>
  );
}
