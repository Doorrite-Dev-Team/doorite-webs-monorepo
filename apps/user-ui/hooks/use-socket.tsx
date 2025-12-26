"use client";

import { useAtom } from "jotai";
import { useEffect } from "react";
import { socketAtom } from "@/store/socketAtom";
import { Socket } from "socket.io-client";

interface ReturnType {
  socket: Socket | null;
  isConnected: boolean;
}

export default function useSocket(): ReturnType {
  const [socket, initSocket] = useAtom(socketAtom);

  useEffect(() => {
    // Initialize the singleton connection on mount
    initSocket();

    // Optional: Global listeners
    return () => {
      // Typically you keep the socket alive across page navs in Next.js,
      // but you can disconnect here if this is a "chat-only" section.
    };
  }, [initSocket]);

  return {
    socket,
    isConnected: !!socket?.connected,
  };
}
