"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Map, { Marker } from "react-map-gl/mapbox"; // Changed import to standard 'react-map-gl
import type { ViewState } from "react-map-gl";
import { DeckGL } from "@deck.gl/react";
import { PathLayer } from "@deck.gl/layers";
import { type ViewStateChangeParameters } from "@deck.gl/core"; // Import DeckGL core types
import { Navigation, MapPin, Package } from "lucide-react";
import { useRiderLocation } from "@/hooks/use-rider-location";

import { Card, CardContent } from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";
import { Badge } from "@repo/ui/components/badge";
import { getStatusLabel, formatTime } from "@/libs/helper";

import "mapbox-gl/dist/mapbox-gl.css";

// --- Type Definitions ---
// interface Coordinates {
//   lat: number;
//   long: number;
// }

// interface Order {
//   id: string;
//   status: string;
//   estimatedDelivery: string | null;
//   totalAmount: number;
//   items: unknown[];
//   deliveryAddress: {
//     coordinates: Coordinates | null;
//   };
// }

interface ActiveOrderTrackerProps {
  order: Order;
}

// Define the custom ViewState which extends the core DeckGL ViewState
interface CustomViewState extends ViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch?: number;
  bearing?: number;
}

export default function ActiveOrderTracker({ order }: ActiveOrderTrackerProps) {
  const router = useRouter();

  // Using the custom hook to manage rider location
  const riderLocation = useRiderLocation(order.id);

  const [viewState, setViewState] = React.useState<CustomViewState>({
    longitude: order.deliveryAddress.coordinates?.long || 3.3792,
    latitude: order.deliveryAddress.coordinates?.lat || 6.5244,
    zoom: 13,
    pitch: 0,
    bearing: 0,
  });

  // FIX: Correctly type the event handler for DeckGL
  const handleViewStateChange = ({ viewState }: ViewStateChangeParameters) => {
    setViewState(viewState);
  };

  // Update viewport to center between rider and destination
  React.useEffect(() => {
    if (riderLocation && order.deliveryAddress.coordinates) {
      const centerLat =
        (riderLocation.lat + order.deliveryAddress.coordinates.lat) / 2;
      const centerLong =
        (riderLocation.long + order.deliveryAddress.coordinates.long) / 2;

      setViewState((prev) => ({
        ...prev,
        longitude: centerLong,
        latitude: centerLat,
      }));
    }
  }, [riderLocation, order.deliveryAddress.coordinates]);

  // deck.gl layers for the route path
  const deckLayers = React.useMemo(() => {
    const layers = [];

    // Route path layer (using PathLayer from DeckGL)
    if (riderLocation && order.deliveryAddress.coordinates) {
      layers.push(
        new PathLayer({
          id: "route-path",
          data: [
            {
              path: [
                [riderLocation.long, riderLocation.lat],
                [
                  order.deliveryAddress.coordinates.long,
                  order.deliveryAddress.coordinates.lat,
                ],
              ],
              color: [59, 130, 246], // Blue
            },
          ],
          getPath: (d) => d.path,
          getColor: (d) => d.color,
          getWidth: 5,
          widthMinPixels: 3,
          getDashArray: [3, 2],
          dashJustified: true,
          opacity: 0.7,
        }),
      );
    }

    return layers;
  }, [riderLocation, order.deliveryAddress.coordinates]);

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <CardContent className="p-0">
        <div className="relative h-64 sm:h-80">
          <DeckGL
            viewState={viewState}
            onViewStateChange={handleViewStateChange}
            controller={true}
            layers={deckLayers}
            style={{ position: "relative", width: "100%", height: "100%" }}
          >
            {/* The Map component receives the synchronized viewState implicitly from DeckGL */}
            <Map
              mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN!}
              mapStyle="mapbox://styles/mapbox/streets-v12"
              attributionControl={false}
              // Do not pass {...viewState} to Map here. DeckGL handles synchronization.
            >
              {/* Destination marker */}
              {order.deliveryAddress.coordinates && (
                <Marker
                  longitude={order.deliveryAddress.coordinates.long}
                  latitude={order.deliveryAddress.coordinates.lat}
                  anchor="bottom"
                >
                  <div className="relative">
                    <div className="absolute inset-0 animate-ping bg-red-500 rounded-full opacity-75 w-8 h-8 -translate-x-4 -translate-y-4" />
                    <MapPin className="w-10 h-10 text-red-600 fill-red-500 drop-shadow-lg" />
                  </div>
                </Marker>
              )}

              {/* Rider location marker */}
              {riderLocation && (
                <Marker
                  longitude={riderLocation.long}
                  latitude={riderLocation.lat}
                  anchor="center"
                >
                  <div className="relative">
                    <div className="absolute inset-0 animate-pulse bg-blue-500 rounded-full opacity-75" />
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                      <Navigation className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </Marker>
              )}
            </Map>
          </DeckGL>

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
            {order.items.length} item{order.items.length !== 1 ? "s" : ""} •{" "}
            <span className="font-semibold">
              ${order.totalAmount.toFixed(2)}
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
