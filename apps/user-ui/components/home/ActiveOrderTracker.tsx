"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Map, Marker } from "@maptiler/sdk";
import { Package } from "lucide-react";
import { useRiderLocation } from "@/hooks/use-rider-location";
import { maptilerConfig } from "@/libs/maptiler";

import { Card, CardContent } from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";
import { Badge } from "@repo/ui/components/badge";
import { getStatusLabel, formatTime } from "@/libs/helper";

// import "@maptiler/sdk/dist/maptiler-sdk.css";

interface ActiveOrderTrackerProps {
  order: Order;
}

export default function ActiveOrderTracker({ order }: ActiveOrderTrackerProps) {
  const router = useRouter();
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const riderMarkerRef = useRef<Marker | null>(null);
  const destinationMarkerRef = useRef<Marker | null>(null);
  const routeLineRef = useRef<ReturnType<Map["getSource"]> | null>(null);

  // Track rider location via WebSocket
  const riderLocation = useRiderLocation(order.riderId, order.id);

  const [isMapReady, setIsMapReady] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const center: [number, number] = order.deliveryAddress.coordinates
      ? [
          order.deliveryAddress.coordinates.long,
          order.deliveryAddress.coordinates.lat,
        ]
      : [3.3792, 6.5244]; // Lagos default

    const map = new Map({
      container: mapContainer.current,
      style: "https://api.maptiler.com/maps/streets-v2/style.json",
      center,
      zoom: 13,
      apiKey: maptilerConfig.apiKey || "",
    });

    map.on("load", () => {
      setIsMapReady(true);

      // Add route line source and layer
      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: [],
          },
        },
      });

      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#3b82f6",
          "line-width": 4,
          "line-dasharray": [2, 1],
        },
      });

      routeLineRef.current = map.getSource("route");
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add/update destination marker
  useEffect(() => {
    if (!mapRef.current || !isMapReady) return;

    if (order.deliveryAddress.coordinates) {
      if (destinationMarkerRef.current) {
        destinationMarkerRef.current.setLngLat([
          order.deliveryAddress.coordinates.long,
          order.deliveryAddress.coordinates.lat,
        ]);
      } else {
        const el = document.createElement("div");
        el.innerHTML = `
          <div class="relative">
            <div class="absolute inset-0 animate-ping bg-red-500 rounded-full opacity-75 w-8 h-8 -translate-x-4 -translate-y-4"></div>
            <svg class="w-10 h-10 text-red-600 drop-shadow-lg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
        `;
        const marker = new Marker({ element: el })
          .setLngLat([
            order.deliveryAddress.coordinates.long,
            order.deliveryAddress.coordinates.lat,
          ])
          .addTo(mapRef.current);
        destinationMarkerRef.current = marker;
      }
    }
  }, [order.deliveryAddress.coordinates, isMapReady]);

  // Add/update rider marker
  useEffect(() => {
    if (!mapRef.current || !isMapReady || !riderLocation) return;

    if (riderMarkerRef.current) {
      riderMarkerRef.current.setLngLat([riderLocation.long, riderLocation.lat]);
    } else {
      const el = document.createElement("div");
      el.innerHTML = `
        <div class="relative">
          <div class="absolute inset-0 animate-pulse bg-blue-500 rounded-full opacity-75"></div>
          <div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
            <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 2 22 12 18 22 22 12 2"/>
            </svg>
          </div>
        </div>
      `;
      const marker = new Marker({ element: el })
        .setLngLat([riderLocation.long, riderLocation.lat])
        .addTo(mapRef.current);
      riderMarkerRef.current = marker;
    }
  }, [riderLocation, isMapReady]);

  // Update route line and center map
  useEffect(() => {
    if (!mapRef.current || !isMapReady) return;

    if (riderLocation && order.deliveryAddress.coordinates) {
      // Update route line
      if (routeLineRef.current) {
        (routeLineRef.current as unknown as mapboxgl.GeoJSONSource).setData({
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: [
              [riderLocation.long, riderLocation.lat],
              [
                order.deliveryAddress.coordinates.long,
                order.deliveryAddress.coordinates.lat,
              ],
            ],
          },
        });
      }

      // Center map between rider and destination
      const centerLat =
        (riderLocation.lat + order.deliveryAddress.coordinates.lat) / 2;
      const centerLong =
        (riderLocation.long + order.deliveryAddress.coordinates.long) / 2;

      mapRef.current.flyTo({
        center: [centerLong, centerLat],
        zoom: 13,
        duration: 1000,
      });
    }
  }, [riderLocation, order.deliveryAddress.coordinates, isMapReady]);

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <CardContent className="p-0">
        <div className="relative h-64 sm:h-80">
          {/* Map Container */}
          <div ref={mapContainer} className="w-full h-full" />

          {/* Map overlay info */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            <Badge className="bg-white/95 backdrop-blur-sm text-gray-900 shadow-lg pointer-events-auto">
              {getStatusLabel(order.status)}
            </Badge>
            {order.estimatedDelivery && (
              <div className="bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg pointer-events-auto">
                <p className="text-xs text-gray-600">Arrives in</p>
                <p className="text-sm font-bold text-gray-900">
                  {formatTime(order.estimatedDelivery)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Order Info */}
        <div className="p-4 bg-gradient-to-br from-blue-50 to-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Order</p>
                <p className="font-semibold text-gray-900">
                  #{order.id.slice(-8).toUpperCase()}
                </p>
              </div>
            </div>

            <Button
              size="sm"
              onClick={() => router.push(`/order/${order.id}`)}
              className="gap-2"
            >
              Track Details
            </Button>
          </div>

          <p className="text-sm text-gray-700">
            {order.items.length} item{order.items.length !== 1 ? "s" : ""} ·{" "}
            <span className="font-semibold">
              ${order.totalAmount.toFixed(2)}
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

/*
// ============================================================================
// DECK.GL APPROACH (Preserved for reference)
// ============================================================================
// This approach uses deck.gl for advanced route visualization with animated
// dashed lines and smoother interactions.
//
// Pros:
// - Better performance for complex visualizations
// - Built-in animation support
// - Advanced layer system
//
// Cons:
// - Additional dependencies (deck.gl, react-map-gl)
// - More complex setup
// - Larger bundle size
//
// Dependencies needed:
// npm install deck.gl react-map-gl/maplibre
//
// Example implementation:
//
// import { DeckGL } from "@deck.gl/react";
// import { PathLayer } from "@deck.gl/layers";
// import { type ViewStateChangeParameters } from "@deck.gl/core";
// import Map, { Marker } from "react-map-gl/maplibre";
//
// const deckLayers = React.useMemo(() => {
//   if (riderLocation && order.deliveryAddress.coordinates) {
//     return [
//       new PathLayer({
//         id: "route-path",
//         data: [{
//           path: [
//             [riderLocation.long, riderLocation.lat],
//             [order.deliveryAddress.coordinates.long, order.deliveryAddress.coordinates.lat],
//           ],
//           color: [59, 130, 246],
//         }],
//         getPath: (d) => d.path,
//         getColor: (d) => d.color,
//         getWidth: 5,
//         widthMinPixels: 3,
//         getDashArray: [3, 2],
//         dashJustified: true,
//         opacity: 0.7,
//       }),
//     ];
//   }
//   return [];
// }, [riderLocation, order.deliveryAddress.coordinates]);
//
// <DeckGL
//   viewState={viewState}
//   onViewStateChange={handleViewStateChange}
//   controller={true}
//   layers={deckLayers}
// >
//   <Map
//     mapStyle={`https://api.maptiler.com/maps/streets-v2/style.json?key=${maptilerConfig.apiKey}`}
//   >
//     // Markers here
//   </Map>
// </DeckGL>
// ============================================================================
*/
