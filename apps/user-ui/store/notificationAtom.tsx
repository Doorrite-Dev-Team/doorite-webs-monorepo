// store/notificationAtom.ts
// import { defaultNotifications } from "@/libs/contant";
import { Notification, NotificationState } from "@/types/notification";
import { toast } from "@repo/ui/components/sonner";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// Main notification state stored in localStorage
export const notificationStateAtom = atomWithStorage<NotificationState>(
  "doorrite-notifications",
  {
    notifications: [],
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

// Writable atom to handle the "addNotification" logic
export const addNotificationAtom = atom(
  null,
  (get, set, notification: Notification) => {
    const prev = get(notificationStateAtom);

    // Check for duplicates
    if (prev.notifications.some((n) => n.id === notification.id)) {
      console.warn("Duplicate notification received:", notification.id);
      return;
    }

    const newNotifications = [notification, ...prev.notifications].slice(
      0,
      100,
    );

    set(notificationStateAtom, {
      notifications: newNotifications,
      lastSync: new Date().toISOString(),
      unreadCount: newNotifications.filter((n) => !n.read).length,
    });

    // Toast Logic
    if (["high", "urgent"].includes(notification.priority)) {
      toast(notification.title, {
        description: notification.message,
        duration: 5000,
      });
    }
  },
);

// Writable atom to handle the "pendingNotifications" logic
// export const pendingNotificationsAtom = atom(
//   null,
//   (get, set, pending: Notification[]) => {
//     const prev = get(notificationStateAtom);

//     // Check for duplicates
//     const newNotifications = pending.filter(
//       (n) => !prev.notifications.some((p) => p.id === n.id),
//     );

//     const updatedNotifications = [
//       ...prev.notifications,
//       ...newNotifications,
//     ].slice(0, 100);

//     set(notificationStateAtom, {
//       notifications: updatedNotifications,
//       lastSync: new Date().toISOString(),
//       unreadCount: updatedNotifications.filter((n) => !n.read).length,
//     });
//   },
// );
