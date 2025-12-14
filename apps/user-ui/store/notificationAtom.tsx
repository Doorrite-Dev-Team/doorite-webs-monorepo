// store/notificationAtom.ts
import { defaultNotifications } from "@/libs/contant";
import { Notification, NotificationState } from "@/types/notification";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// Main notification state stored in localStorage
export const notificationStateAtom = atomWithStorage<NotificationState>(
  "doorrite-notifications",
  {
    notifications: defaultNotifications,
    lastSync: null,
    unreadCount: 0,
  },
  {
    getItem: (key, initialValue) => {
      try {
        const item = localStorage.getItem(key);
        if (!item) return initialValue;

        const parsed = JSON.parse(item);

        // Cleanup expired notifications
        const now = new Date().toISOString();
        const validNotifications = parsed.notifications.filter(
          (n: Notification) => !n.expiresAt || n.expiresAt > now,
        );

        return {
          notifications: validNotifications,
          lastSync: parsed.lastSync,
          unreadCount: validNotifications.filter((n: Notification) => !n.read)
            .length,
        };
      } catch (error) {
        console.error(
          "Failed to parse notifications from localStorage:",
          error,
        );
        return initialValue;
      }
    },
    setItem: (key, value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error("Failed to save notifications to localStorage:", error);
      }
    },
    removeItem: (key) => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error(
          "Failed to remove notifications from localStorage:",
          error,
        );
      }
    },
  },
);

// Derived atom for unread count
export const unreadCountAtom = atom((get) => {
  const state = get(notificationStateAtom);
  return state.notifications.filter((n) => !n.read && !n.archived).length;
});

// Derived atom for active (non-archived) notifications
export const activeNotificationsAtom = atom((get) => {
  const state = get(notificationStateAtom);
  return state.notifications
    .filter((n) => !n.archived)
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
});

// WebSocket connection status atom
export const wsConnectionAtom = atom<
  "connected" | "disconnected" | "connecting" | "error"
>("disconnected");
