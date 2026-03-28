"use client";

import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { socketAtom } from "@/store/socketAtom";

interface Coordinates {
  lat: number;
  long: number;
}

/**
 * Hook to track rider location via WebSocket
 * Listens for events in format: rider:${riderId}-order:${orderId}
 *
 * @param riderId - The ID of the rider
 * @param orderId - The ID of the order
 * @returns The current rider coordinates or null if not available
 */
export function useRiderLocation(
  riderId: string | undefined,
  orderId: string | undefined,
): Coordinates | null {
  const socket = useAtomValue(socketAtom);
  const [location, setLocation] = useState<Coordinates | null>(null);

  useEffect(() => {
    if (!socket || !riderId || !orderId) {
      return;
    }

    const eventName = `rider:${riderId}-order:${orderId}`;

    // Handler for rider location updates
    const handleLocationUpdate = (coord: Coordinates) => {
      console.log(`📍 Rider location update for order ${orderId}:`, coord);
      setLocation(coord);
    };

    // Subscribe to rider location events using typed handler
    const typedHandler = handleLocationUpdate as (coord: {
      lat: number;
      long: number;
    }) => void;
    socket.on(eventName as `rider:${string}-order:${string}`, typedHandler);

    // Cleanup on unmount or when dependencies change
    return () => {
      socket.off(eventName as `rider:${string}-order:${string}`, typedHandler);
    };
  }, [socket, riderId, orderId]);

  return location;
}
