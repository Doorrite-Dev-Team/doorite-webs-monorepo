"use client";

import * as React from "react";
import { MapPin, Navigation } from "lucide-react";

interface DeliveryMapProps {
  orderId: string;
  deliveryAddress: Address;
}

export default function DeliveryMap({
  orderId,
  deliveryAddress,
}: DeliveryMapProps) {
  const [riderLocation, setRiderLocation] = React.useState<Coordinates | null>(
    null,
  );

  // Simulate rider location updates (replace with real API)
  React.useEffect(() => {
    const interval = setInterval(() => {
      // In production, fetch from: /api/orders/${orderId}/rider-location
      setRiderLocation({
        lat: 6.5244 + Math.random() * 0.01,
        long: 3.3792 + Math.random() * 0.01,
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [orderId]);

  return (
    <div className="relative w-full h-64 sm:h-80 bg-gradient-to-br from-blue-100 to-blue-200 rounded-t-lg">
      {/* Map placeholder - Replace with actual map library like Google Maps or Mapbox */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <Navigation className="w-16 h-16 text-blue-600 mx-auto mb-3 animate-pulse" />
          <p className="text-blue-900 font-medium">Tracking your delivery...</p>
          <p className="text-sm text-blue-700 mt-1">
            {deliveryAddress.state || "On the way"}
          </p>
        </div>
      </div>

      {/* Delivery pin */}
      <div className="absolute bottom-4 left-4 bg-white rounded-full p-3 shadow-lg">
        <MapPin className="w-5 h-5 text-red-600" />
      </div>

      {/* Rider pin */}
      {riderLocation && (
        <div className="absolute top-4 right-4 bg-primary rounded-full p-3 shadow-lg animate-bounce">
          <Navigation className="w-5 h-5 text-white" />
        </div>
      )}

      {/* Integration Guide Comment */}
      {/*
        To integrate a real map:

        1. Google Maps:
        - Install: npm install @react-google-maps/api
        - Get API key from Google Cloud Console
        - Use GoogleMap and Marker components

        2. Mapbox:
        - Install: npm install react-map-gl
        - Get API token from Mapbox
        - Use Map and Marker components

        3. Fetch rider location:
        - Create endpoint: GET /api/orders/${orderId}/rider-location
        - Return: { lat: number, long: number }
        - Poll every 5-10 seconds
      */}
    </div>
  );
}
