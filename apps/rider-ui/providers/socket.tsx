"use client";

/**
 * SocketProvider — manages socket connection + live GPS broadcast
 *
 * - Initialises the socket connection with the rider's auth token
 * - Starts a `watchPosition` loop that emits `update-rider-location`
 *   to the backend, throttled to at most once every 3 seconds
 * - Cleans up the GPS watcher on unmount or disconnect
 * - Renders the `NewOrderAlert` dialog for incoming ride requests
 */

import { useEffect, useRef } from "react";
import { useSetAtom, useAtomValue } from "jotai";
import { initSocketAtom, socketAtom, isConnectedAtom } from "@/store/socketAtom";
import { NewOrderAlert } from "@/components/dialogs/new-order";

const LOCATION_THROTTLE_MS = 3000;

export function SocketProvider({
  children,
  token,
}: {
  children: React.ReactNode;
  token: string;
}) {
  const initSocket = useSetAtom(initSocketAtom);
  const socket = useAtomValue(socketAtom);
  const isConnected = useAtomValue(isConnectedAtom);

  const watcherRef = useRef<number | null>(null);
  const lastEmitRef = useRef<number>(0);

  // 1. Initialise socket on mount
  useEffect(() => {
    if (token) {
      initSocket(token);
    }
  }, [initSocket, token]);

  // 2. Start GPS watcher once socket is connected
  useEffect(() => {
    if (!socket || !isConnected) return;

    if (!("geolocation" in navigator)) {
      console.warn("Geolocation not supported on this device");
      return;
    }

    const handlePosition = (position: GeolocationPosition) => {
      const now = Date.now();

      // Throttle: skip if we emitted less than LOCATION_THROTTLE_MS ago
      if (now - lastEmitRef.current < LOCATION_THROTTLE_MS) return;

      lastEmitRef.current = now;

      socket.emit("update-rider-location", {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    };

    const handleError = (error: GeolocationPositionError) => {
      console.error("GPS error:", error.message);
    };

    watcherRef.current = navigator.geolocation.watchPosition(
      handlePosition,
      handleError,
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      },
    );

    return () => {
      if (watcherRef.current !== null) {
        navigator.geolocation.clearWatch(watcherRef.current);
        watcherRef.current = null;
      }
    };
  }, [socket, isConnected]);

  return (
    <>
      {children}
      <NewOrderAlert />
    </>
  );
}
