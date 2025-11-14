"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

// ✅ Infer correct Socket type automatically
type SocketInstance = ReturnType<typeof io>;

interface SocketContextType {
  socket: SocketInstance | null;
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
    socketConnection.on("connect", () => {
      console.log("✅ Connected to socket server:", SOCKET_BASE_URL);
    });

    socketConnection.on("connect_error", (err: Error) => {
      console.error("❌ Socket connection error:", err.message);
    });

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
