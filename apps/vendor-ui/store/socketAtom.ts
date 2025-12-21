// socketStore.ts
import { atom } from "jotai";
import { io, Socket } from "socket.io-client";
import {toast} from "@repo/ui/components/sonner"

interface ServerToClientEvents {
  "order-status-update": (data: {
    orderId: string;
    status: "picked" | "delivered";
  }) => void;
  "new-order": () => void;
  notification : () => void;
  "unread-notification": () => void;
  disconnect: () => void;
}

interface ClientToServerEvents {
  "notification-read": (orderId: string) => void;
}

type socketInstance = Socket<ServerToClientEvents, ClientToServerEvents>;

const SOCKET_BASE_URL = process.env.NEXT_PUBLIC_WS_URI || "ws://localhost:4000";

export const socketAtom = atom<socketInstance | null>(null);

export const isConnectedAtom = atom(false);

export const initSocket = atom(null, (get, set) => {
  const socketBase = get(socketAtom);

  if (socketBase) {
    return;
  }

  const socket: socketInstance = io(SOCKET_BASE_URL, {
    transports: ["websocket"],
    withCredentials: true,
    autoConnect: false,
    reconnectionAttempts: 3,
    reconnectionDelay: 1000,
  });

  socket.on("connect", () => {
    set(isConnectedAtom, true);
  });

  socket.on("connect_error", () => {
    set(isConnectedAtom, false);
  });
  
  socket.on("new-order", () => {
    console.log("New order received");
  });

  socket.on("notification", () => {
    console.log("Notification received");
  });

  socket.on("unread-notification", () => {
    console.log("Unread notification received");
  });

  socket.on("disconnect", () => {
    set(isConnectedAtom, false);
  });

  set(socketAtom, socket);
});
