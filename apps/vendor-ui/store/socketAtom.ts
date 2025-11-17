// socketStore.ts
import { atom } from "jotai";
import { io } from "socket.io-client";

type SocketInstance = ReturnType<typeof io>;

export const socketAtom = atom<SocketInstance | null>(null);

export const isConnectedAtom = atom(false);
