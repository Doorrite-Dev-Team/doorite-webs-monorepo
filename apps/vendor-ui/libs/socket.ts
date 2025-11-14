// // src/libs/socket.ts
// import { io, Socket } from "socket.io-client";


// // ✅ Replace with your actual backend WebSocket URL
// const SOCKET_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:4000";

// // ✅ Create socket instance
// export const socket = io(SOCKET_URL, {
//   transports: ["websocket"],
//   withCredentials: true,
// });

// // ✅ Optional: Log connection events
// if (typeof window !== "undefined") {
//   socket.on("connect", () => {
//     console.log("✅ Connected to WebSocket:", socket.id);
//   });

//   socket.on("disconnect", (reason) => {
//     console.warn("❌ Disconnected from WebSocket:", reason);
//   });
// }

// export default socket;
