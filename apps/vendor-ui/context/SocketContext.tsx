"use client";
import { io, Socket } from "socket.io-client";
import { createContext, useContext, useEffect, useState } from "react";

// ✅ Infer correct Socket type automatically
type SocketInstance = ReturnType<typeof io>;
interface ServerToClientEvents {
  "order-status-update": (data: {
    orderId: string;
    status: "picked" | "delivered";
  }) => void;
  disconnect: () => void;
}

interface ClientToServerEvents {
  "request-status": (orderId: string) => void;
}

// Update SocketInstance to use these specific types
export type CustomSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

interface SocketContextType {
  socket: CustomSocket | null; // Use the specific custom type
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<SocketInstance | null>(null);

  useEffect(() => {
    const SOCKET_BASE_URL =
      process.env.NEXT_PUBLIC_API_URI?.replace("/api/v1/", "") ||
      "https://doorrite-api.onrender.com";

    // ✅ Initialize socket connection
    const socketConnection = io(SOCKET_BASE_URL, {
      transports: ["websocket"],
      withCredentials: true,
    });
    // ✅ Works correctly — .on() fully typed
    // socketConnection.on("connect", () => {
    //   console.log("✅ Connected to socket server:", SOCKET_BASE_URL);
    // });

    // socketConnection.on("connect_error", (err: Error) => {
    //   console.error("❌ Socket connection error:", err.message);
    // });

    setSocket(socketConnection);

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
