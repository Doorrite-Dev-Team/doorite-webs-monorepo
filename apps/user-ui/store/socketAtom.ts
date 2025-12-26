import { atom, type WritableAtom } from "jotai";
import { io, Socket } from "socket.io-client";
import { clientToken } from "@/libs/utils/client-tokens";
import { Notification } from "@/types/notification";
import { addNotificationAtom } from "./notificationAtom";
import { toast } from "@repo/ui/components/sonner";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:4000";

// 1. The raw atom that holds the socket instance
const socketBaseAtom = atom<Socket | null>(null);

// 2. A writable atom to handle initialization and retrieval
export const socketAtom: WritableAtom<Socket | null, [], void> = atom(
  (get) => get(socketBaseAtom),
  (get, set) => {
    // Prevent re-initialization if already connected
    if (get(socketBaseAtom)) return;

    const token = clientToken.getAccess();
    const socket = io(WS_URL, {
      auth: { token },
      autoConnect: true,
    });

    socket.on("connect", () => {
      console.log("Client: Connected");
      // socket.emit("message", { text: "Hello server, I'm here!" });
    });

    socket.on("connect_error", (err) => {
      toast.error("WebSocket Error", { description: err.message });
      console.warn(err.message);
    });

    socket.on("notification", (data: Notification) => {
      // Use the other atom's logic to update state
      set(addNotificationAtom, data);
      socket.emit("notification-read", data.id);
    });

    socket.on("pending-notifications", (data: Notification[]) => {
      data.forEach((n) => {
        set(addNotificationAtom, n);
        socket.emit("notification-read", n.id);
      });
    });

    set(socketBaseAtom, socket);
  },
);
