import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { toast } from "@repo/ui/components/sonner"; // Assuming you use Sonner
import { Notification, NotificationState } from "@/types/notification";

// 1. Persistent Storage
export const notificationStateAtom = atomWithStorage<NotificationState>(
  "doorrite-vendor-notifications",
  { notifications: [], unreadCount: 0, lastSync: null },
  {
    getItem: (key, initialValue) => {
      try {
        const item = localStorage.getItem(key);
        if (!item) return initialValue;

        const parsed = JSON.parse(item) as NotificationState;

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

// 2. Volatile State for "Active Urgent Order" (Triggers Dialog)
export const urgentOrderAtom = atom<{
  orderId: string;
  audio?: HTMLAudioElement;
} | null>(null);

// 3. Action Atom: Process Incoming Notification
export const addNotificationAtom = atom(
  null,
  (get, set, payload: Notification) => {
    const prev = get(notificationStateAtom);

    // Dedup
    if (prev.notifications.some((n) => n.id === payload.id)) return;

    // Update State
    const newNotifications = [payload, ...prev.notifications].slice(0, 100);
    set(notificationStateAtom, {
      notifications: newNotifications,
      lastSync: new Date().toISOString(),
      unreadCount: newNotifications.filter((n) => !n.read).length,
    });

    // trigger Toast for non-urgent items
    // (Urgent items are handled by the Socket Store directly to trigger the Dialog)
    if (payload.priority !== "urgent") {
      toast(payload.title, {
        description: payload.message,
        action: payload.metadata?.actionUrl
          ? {
              label: "View",
              onClick: () =>
                (window.location.href = payload.metadata!.actionUrl!),
            }
          : undefined,
      });
    }
  },
);
