import { io } from "socket.io-client";
import { env } from "@/config/env";

let socket;

export function createSocket(token) {
  if (!socket) {
    socket = io(env.SOCKET_URL, {
      autoConnect: false,
      auth: { token },
      transports: ["websocket"],
      reconnectionAttempts: 4,
      reconnectionDelay: 1200,
    });
  }

  socket.auth = { token };
  return socket;
}

export function getSocket() {
  return socket;
}
