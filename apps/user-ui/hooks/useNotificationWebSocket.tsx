"use client";

// hooks/useNotificationWebSocket.ts
import { useCallback, useEffect } from "react";
import { useSetAtom, useAtomValue } from "jotai";
import useWebSocket, { ReadyState } from "react-use-websocket";
import {
  notificationStateAtom,
  wsConnectionAtom,
} from "@/store/notificationAtom";
import { toast } from "@repo/ui/components/sonner";
import { Notification, WebSocketMessage } from "@/types/notification";
import { clientToken } from "@/libs/utils/client-tokens";
import "io";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:4000";
const token = clientToken.getAccess();

const RECONNECT_INTERVAL = 5000; // 5 seconds
const MAX_RECONNECT_ATTEMPTS = 10;

export function useNotificationWebSocket(shouldConnect: boolean = true) {
  const setNotificationState = useSetAtom(notificationStateAtom);
  const setConnectionStatus = useSetAtom(wsConnectionAtom);
  const notificationState = useAtomValue(notificationStateAtom);

  // Add new notification
  const addNotification = useCallback(
    (notification: Notification) => {
      setNotificationState((prev) => {
        // Check for duplicates
        const exists = prev.notifications.some((n) => n.id === notification.id);
        if (exists) {
          console.warn("Duplicate notification received:", notification.id);
          return prev;
        }

        const newNotifications = [notification, ...prev.notifications];
        // Limit to 100 most recent notifications
        const limited = newNotifications.slice(0, 100);

        return {
          notifications: limited,
          lastSync: new Date().toISOString(),
          unreadCount: limited.filter((n) => !n.read).length,
        };
      });

      // Show toast for high priority notifications
      if (
        notification.priority === "high" ||
        notification.priority === "urgent"
      ) {
        toast(notification.title, {
          description: notification.message,
          duration: 5000,
        });
      }
    },
    [setNotificationState],
  );

  // Handle incoming messages
  const handleMessage = useCallback(
    (event: MessageEvent) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);

        switch (message.type) {
          case "notification":
            if (message.data) {
              addNotification(message.data);
            }
            break;

          case "pong":
            // Connection alive confirmation
            console.debug("Pong received");
            break;

          case "error":
            console.error("WebSocket error message:", message.error);
            toast.error("Notification error", {
              description: message.error,
            });
            break;

          default:
            console.warn("Unknown message type:", message.type);
        }
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    },
    [addNotification],
  );

  // WebSocket hook configuration
  const { sendJsonMessage, readyState } = useWebSocket(
    `${WS_URL}?token=${token}`,
    {
      onOpen: () => {
        console.log("WebSocket connected");
        setConnectionStatus("connected");

        // Send initial sync request
        sendJsonMessage({
          type: "sync",
          lastSync: notificationState.lastSync,
          timestamp: new Date().toISOString(),
        });
      },
      onMessage: handleMessage,
      onError: (error) => {
        console.error("WebSocket error:", error);
        setConnectionStatus("error");
      },
      onClose: (event) => {
        console.log("WebSocket closed:", event.code, event.reason);
        setConnectionStatus("disconnected");
      },
      shouldReconnect: () => shouldConnect,
      reconnectAttempts: MAX_RECONNECT_ATTEMPTS,
      reconnectInterval: RECONNECT_INTERVAL,
      share: false, // Don't share connection across components
      heartbeat: {
        message: JSON.stringify({
          type: "ping",
          timestamp: new Date().toISOString(),
        }),
        returnMessage: "pong",
        timeout: 60000, // 60 seconds
        interval: 30000, // 30 seconds
      },
      protocols: ["json"],
    },
    shouldConnect, // Only connect when enabled
  );

  // Update connection status based on readyState
  useEffect(() => {
    switch (readyState) {
      case ReadyState.CONNECTING:
        setConnectionStatus("connecting");
        break;
      case ReadyState.OPEN:
        setConnectionStatus("connected");
        break;
      case ReadyState.CLOSING:
      case ReadyState.CLOSED:
        setConnectionStatus("disconnected");
        break;
      default:
        setConnectionStatus("disconnected");
    }
  }, [readyState, setConnectionStatus]);

  return {
    sendMessage: sendJsonMessage,
    isConnected: readyState === ReadyState.OPEN,
    connectionState: readyState,
  };
}
