// useRiderLocation.ts or use-rider-location.ts

import * as React from "react";

interface Coordinates {
  lat: number;
  long: number;
}

/**
 * Manages the WebSocket connection to track the rider's real-time location.
 * @param orderId The ID of the order to track.
 * @returns The current Coordinates of the rider or null.
 */
export const useRiderLocation = (
  orderId: string | undefined,
): Coordinates | null => {
  const [riderLocation, setRiderLocation] = React.useState<Coordinates | null>(
    null,
  );

  React.useEffect(() => {
    if (!orderId) return;

    // Construct the WSL endpoint based on the exposed order:{orderId}:location
    const wsUrl = `${process.env.NEXT_PUBLIC_WSL_URL}/order/${orderId}/location`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("WebSocket connection established.");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setRiderLocation(data);
      } catch (e) {
        console.error("Failed to parse rider location data:", e);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    return () => {
      ws.close();
    };
  }, [orderId]);

  return riderLocation;
};
