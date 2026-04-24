"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { Map, Marker, NavigationControl, LngLatBounds } from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { useAtomValue } from "jotai";
import { activeOrderAtom } from "@/store/orderAtom";
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

export default function RiderMap({ markers = [] }: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const pickupMarkerRef = useRef<Marker | null>(null);
  const dropoffMarkerRef = useRef<Marker | null>(null);
  const riderMarkerRef = useRef<Marker | null>(null);
  const activeOrder = useAtomValue(activeOrderAtom);

  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Create a colored marker element
  const createMarkerEl = useCallback(
    (type: "pickup" | "dropoff" | "rider") => {
      const el = document.createElement("div");

      if (type === "rider") {
        el.className = "rider-marker";
        el.innerHTML = `
        <div style="position:relative;width:20px;height:20px;">
          <span style="position:absolute;display:inline-flex;width:100%;height:100%;border-radius:50%;background:rgba(59,130,246,0.4);animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></span>
          <span style="position:relative;display:inline-flex;width:20px;height:20px;border-radius:50%;background:#2563eb;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></span>
        </div>
      `;
      } else {
        const color = type === "pickup" ? "#16a34a" : "#dc2626";
        const label = type === "pickup" ? "P" : "D";
        el.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;">
          <div style="width:32px;height:32px;border-radius:50%;background:${color};color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);">${label}</div>
          <div style="width:3px;height:8px;background:${color};border-radius:0 0 2px 2px;"></div>
        </div>
      `;
      }
      return el;
    },
    [],
  );

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new Map({
      container: mapContainerRef.current,
      style: "https://api.maptiler.com/maps/streets-v2/style.json",
      center: DEFAULT_MAP_CENTER as [number, number],
      zoom: DEFAULT_MAP_ZOOM,
      apiKey: maptilerConfig.apiKey || "",
    });

    map.addControl(new NavigationControl({ showCompass: true }), "top-right");
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Get user location
  useEffect(() => {
    if (!("geolocation" in navigator)) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(loc);

        if (mapRef.current) {
          mapRef.current.flyTo({
            center: [loc.lng, loc.lat],
            zoom: 14,
          });
        }
      },
      (error) => console.error("Error getting location:", error),
    );
  }, []);

  // Place rider marker
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;

    if (riderMarkerRef.current) {
      riderMarkerRef.current.setLngLat([userLocation.lng, userLocation.lat]);
    } else {
      const el = createMarkerEl("rider");
      riderMarkerRef.current = new Marker({ element: el })
        .setLngLat([userLocation.lng, userLocation.lat])
        .addTo(mapRef.current);
    }
  }, [userLocation, createMarkerEl]);

  // Place pickup/dropoff markers + fitBounds when active order changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clean up old markers
    if (pickupMarkerRef.current) {
      pickupMarkerRef.current.remove();
      pickupMarkerRef.current = null;
    }
    if (dropoffMarkerRef.current) {
      dropoffMarkerRef.current.remove();
      dropoffMarkerRef.current = null;
    }

    if (!activeOrder) return;

    const { pickupLocation, dropoffLocation } = activeOrder;

    // Add pickup marker
    const pickupEl = createMarkerEl("pickup");
    pickupMarkerRef.current = new Marker({ element: pickupEl })
      .setLngLat([pickupLocation.lng, pickupLocation.lat])
      .addTo(map);

    // Add dropoff marker
    const dropoffEl = createMarkerEl("dropoff");
    dropoffMarkerRef.current = new Marker({ element: dropoffEl })
      .setLngLat([dropoffLocation.lng, dropoffLocation.lat])
      .addTo(map);

    // fitBounds to show both points (and rider if available)
    const bounds = new LngLatBounds();
    bounds.extend([pickupLocation.lng, pickupLocation.lat]);
    bounds.extend([dropoffLocation.lng, dropoffLocation.lat]);

    if (userLocation) {
      bounds.extend([userLocation.lng, userLocation.lat]);
    }

    map.fitBounds(bounds, {
      padding: { top: 80, bottom: 250, left: 50, right: 50 },
      maxZoom: 15,
    });
  }, [activeOrder, userLocation, createMarkerEl]);

  if (!maptilerConfig.apiKey) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center p-6">
          <p className="text-red-500 font-medium">Missing MapTiler API Key</p>
          <p className="text-sm text-gray-500 mt-1">
            Set NEXT_PUBLIC_MAPTILER_API_KEY in your environment
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Add ping animation style */}
      <style jsx global>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>

      {/* Order Status Card */}
      <OrderStatusCard />
    </div>
  );
}
