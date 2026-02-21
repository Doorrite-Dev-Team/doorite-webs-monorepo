"use client";

import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { initSocketAtom } from "@/store/socketAtom";

export function SocketProvider({
  children,
  token,
}: {
  children: React.ReactNode;
  token: string;
}) {
  const initSocket = useSetAtom(initSocketAtom);

  useEffect(() => {
    initSocket(token);
  }, [initSocket, token]);

  return children;
}
