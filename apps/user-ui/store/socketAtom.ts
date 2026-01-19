import { atom } from "jotai";
import { io, Socket } from "socket.io-client";
import { addNotificationAtom } from "./notificationAtom";
import { playSound } from "@/libs/player";
import { Notification } from "@/types/notification";
import { toast } from "@repo/ui/components/sonner";

// Strict Event Types
interface ServerToClientEvents {
  // Urgent: Specific event for logic handling
  // "new-order": (data: Notification) => void;

  // General: System/Info updates
  notification: (data: Notification) => void;
  "pending-notifications": (data: Notification[]) => void;
  connect: () => void;
  disconnect: () => void;
}

interface ClientToServerEvents {
  "notification-read": (notificationId: string) => void;
  "join-user-room": (userId: string) => void;
  // "order-accepted": (orderId: string) => void;
}

type SocketInstance = Socket<ServerToClientEvents, ClientToServerEvents>;

export const socketAtom = atom<SocketInstance | null>(null);
export const isConnectedAtom = atom(false);

export const initSocketAtom = atom(null, (get, set, token: string) => {
  if (get(socketAtom)) return;

  const WS_URL = process.env.NEXT_PUBLIC_WS_URI;
  if (!WS_URL) return;

  const socket: SocketInstance = io(WS_URL, {
    transports: ["websocket"],
    reconnectionDelayMax: 10000,
    auth: { token },
  });

  socket.on("connect", () => {
    set(isConnectedAtom, true);
    console.log("🟢 Connected to DoorRite Socket");
  });

  socket.on("connect_error", (err) => {
    console.error("Socket Error:", err.message);
  });

  socket.on("notification", (data) => {
    playSound("pop");
    set(addNotificationAtom, data);
  });

  socket.on("pending-notifications", (data) => {
    for (const n of data) {
      set(addNotificationAtom, n);
      socket.emit("notification-read", n.id);
    }
  });

  socket.on("disconnect", () => set(isConnectedAtom, false));

  set(socketAtom, socket);
});

// New: Disconnect Atom
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
