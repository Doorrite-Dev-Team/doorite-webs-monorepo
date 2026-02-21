"use client";

import { useEffect } from "react";
import { useSetAtom, useAtomValue } from "jotai";
import { initSocketAtom, socketAtom, isConnectedAtom } from "@/store/socketAtom";
import { NewOrderAlert } from "@/components/dialogs/new-order";

export function SocketProvider({
    children,
    token,
}: {
    children: React.ReactNode;
    token: string;
}) {
    const initSocket = useSetAtom(initSocketAtom);

    useEffect(() => {
        if (token) {
            initSocket(token);
        }
    }, [initSocket, token]);

    return (
        <>
            {children}
            <NewOrderAlert />
        </>
    );
}
