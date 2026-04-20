// store/socketAtom.ts
import { atom } from "jotai";
import { io, Socket } from "socket.io-client";
import { addNotificationAtom, urgentOrderAtom } from "./notificationAtom";
import { playSound } from "@/libs/player";
import { Notification } from "@/types/notification";
import { toast } from "@repo/ui/components/sonner";

// Strict Event Types
interface ChatMessage {
  id: string;
  content: string;
  senderType: "customer" | "rider" | "vendor";
  senderId: string;
  createdAt: string;
}

interface ServerToClientEvents {
  // Urgent: New Ride Job (Trigger Dialog)
  "new-ride-job": (data: Notification) => void;

  // General: System/Info updates
  notification: (data: Notification) => void;
  "pending-notifications": (pending: Notification[]) => void;

  // Chat events
  new_message: (message: ChatMessage) => void;

  // Specific Order Updates
  [key: string]: any; // for rider:{riderId}-order:{orderId} dynamic events

  connect: () => void;
  disconnect: () => void;
}

interface ClientToServerEvents {
  "join-rider-room": (riderId: string) => void;
  "update-rider-location": (data: { lat: number; lng: number }) => void;
  "order-accepted": (orderId: string) => void;

  // Chat events
  join_order: (orderId: string) => void;
  leave_order: (orderId: string) => void;
  send_message: (data: { orderId: string; content: string }) => void;

  // Notification read
  "notification-read": (notificationId: string) => void;
}

type SocketInstance = Socket<ServerToClientEvents, ClientToServerEvents>;

export const socketAtom = atom<SocketInstance | null>(null);
export const isConnectedAtom = atom(false);

// Initialize Socket
export const initSocketAtom = atom(null, (get, set, token: string) => {
  if (get(socketAtom)) return;

  const socket: SocketInstance = io(process.env.NEXT_PUBLIC_WS_URI!, {
    transports: ["websocket"],
    auth: { token },
  });

  // --- Connection Events ---
  socket.on("connect", () => {
    set(isConnectedAtom, true);
    console.log("🟢 Connected to DoorRite Socket (Rider)");
  });

  socket.on("connect_error", (err) => {
    toast("Socket Connection Error", { description: err.message });
    console.log(err);
  });

  // --- URGENT: New Ride Job (Dialog + Loop Sound) ---
  socket.on("new-ride-job", (data) => {
    // 1. Play Loud Ringtone
    const audio = playSound("new-order"); // Returns audio instance

    // 2. Set Urgent State (Opens Dialog)
    set(urgentOrderAtom, {
      orderId: data.metadata?.orderId ?? "Not Found",
      audio: audio || undefined,
    });

    // 3. Add to History
    set(addNotificationAtom, data);
  });

  // --- INFO: General Notification (Toast + Beep) ---
  socket.on("notification", (notif) => {
    playSound("pop");
    set(addNotificationAtom, notif);
    socket.emit("notification-read", notif.id);
  });

  socket.on("pending-notifications", (pending: Notification[]) => {
    for (const n of pending) {
      set(addNotificationAtom, n);
      socket.emit("notification-read", n.id);
    }
  });

  socket.on("disconnect", () => set(isConnectedAtom, false));

  set(socketAtom, socket);
});

export const disconnectSocketAtom = atom(null, (get, set) => {
  const socket = get(socketAtom);
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    set(socketAtom, null);
    set(isConnectedAtom, false);
    console.log("🔴 Socket Disconnected");
  }
});
