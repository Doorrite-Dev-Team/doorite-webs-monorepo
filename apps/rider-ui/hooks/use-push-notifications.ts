"use client";

import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/libs/api-client";

interface PushSubscriptionJSON {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

interface UsePushNotificationsReturn {
  permission: NotificationPermission | "unsupported";
  isSubscribed: boolean;
  isLoading: boolean;
  subscribe: () => Promise<boolean>;
  unsubscribe: () => Promise<void>;
}

export function usePushNotifications(): UsePushNotificationsReturn {
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("default");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("Notification" in window) ||
      !("serviceWorker" in navigator)
    ) {
      setPermission("unsupported");
      setIsLoading(false);
      return;
    }

    setPermission(Notification.permission);

    navigator.serviceWorker.ready.then((registration) => {
      registration.pushManager.getSubscription().then((sub) => {
        setSubscription(sub);
        setIsSubscribed(!!sub);
        setIsLoading(false);
      });
    });
  }, []);

  const subscribe = useCallback(async (): Promise<boolean> => {
    if (permission === "denied") {
      return false;
    }

    if (!VAPID_PUBLIC_KEY) {
      console.warn("VAPID public key not configured");
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result !== "granted") {
        return false;
      }

      const registration = await navigator.serviceWorker.ready;

      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      const subJSON = sub.toJSON() as PushSubscriptionJSON;

      await apiClient.post("/push/subscribe", {
        endpoint: subJSON.endpoint,
        p256dh: subJSON.keys.p256dh,
        auth: subJSON.keys.auth,
      });

      setSubscription(sub);
      setIsSubscribed(true);
      return true;
    } catch (error) {
      console.error("Failed to subscribe to push notifications:", error);
      return false;
    }
  }, [permission, VAPID_PUBLIC_KEY]);

  const unsubscribe = useCallback(async (): Promise<void> => {
    try {
      if (subscription) {
        await subscription.unsubscribe();
      }

      try {
        if (subscription) {
          await apiClient.delete("/push/unsubscribe", {
            data: { endpoint: subscription.endpoint },
          });
        }
      } catch {
        // Backend may not have this endpoint yet
      }

      setSubscription(null);
      setIsSubscribed(false);
    } catch (error) {
      console.error("Failed to unsubscribe from push notifications:", error);
    }
  }, [subscription]);

  return {
    permission,
    isSubscribed,
    isLoading,
    subscribe,
    unsubscribe,
  };
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}