"use client";

import React, { useEffect, useState, useRef } from "react";
import { Map, Marker, NavigationControl } from "@maptiler/sdk";
import { useAtomValue } from "jotai";
import { activeOrderAtom } from "@/store/orderAtom";
import { MapPin, Package, Home } from "lucide-react";
import OrderStatusCard from "./OrderStatusCard";
import {
  maptilerConfig,
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
} from "@/libs/maptiler";

interface MapProps {
  markers?: {
    id: string;
    lat: number;
    lng: number;
    type: "pickup" | "dropoff" | "rider";
  }[];
}

interface ViewState {
  latitude: number;
  longitude: number;
  zoom: number;
}

export default function RiderMap({ markers = [] }: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const activeOrder = useAtomValue(activeOrderAtom);

  const [viewState, setViewState] = useState<ViewState>({
    latitude: DEFAULT_MAP_CENTER[1],
    longitude: DEFAULT_MAP_CENTER[0],
    zoom: DEFAULT_MAP_ZOOM,
  });
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new Map({
      container: mapContainerRef.current,
      style: "https://api.maptiler.com/maps/streets-v2/style.json",
      center: [viewState.longitude, viewState.latitude],
      zoom: viewState.zoom,
      apiKey: maptilerConfig.apiKey || "",
    });

    map.on("move", () => {
      setViewState({
        latitude: map.getCenter().lat,
        longitude: map.getCenter().lng,
        zoom: map.getZoom(),
      });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

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
          if (mapRef.current) {
            mapRef.current.flyTo({
              center: [position.coords.longitude, position.coords.latitude],
              zoom: 14,
            });
          }
        },
        (error) => console.error("Error getting location:", error),
      );
    }
  }, []);

  useEffect(() => {
    if (activeOrder && userLocation && mapRef.current) {
      // TODO: Implement fitBounds using map ref
    }
  }, [activeOrder, userLocation]);

  if (!maptilerConfig.apiKey) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 text-red-500">
        Missing MapTiler API Key - Set NEXT_PUBLIC_MAPTILER_API_KEY
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* User Location Marker */}
      {userLocation && (
        <div
          className="absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 z-10"
          style={{
            transform: `translate(${(userLocation.lng - viewState.longitude) * 100}px, ${(userLocation.lat - viewState.latitude) * 100}px)`,
          }}
        >
          <div className="relative">
            <span className="flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-blue-600 border-2 border-white shadow-lg"></span>
            </span>
          </div>
        </div>
      )}

      {/* Order Status Card */}
      <OrderStatusCard />
    </div>
  );
}
