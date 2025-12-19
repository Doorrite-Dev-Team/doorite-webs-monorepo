"use client";

import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { socketAtom } from "@/store/socketAtom";
import { clientToken } from "@/libs/utils/client-tokens";

export default function SocketInitializer() {
  const init = useSetAtom(socketAtom);

  useEffect(() => {
    // Only init if we have a token (client-side check)
    const token = clientToken.getAccess();
    if (token) {
      init();
    }
  }, [init]);

  return null; // Renders nothing
}
