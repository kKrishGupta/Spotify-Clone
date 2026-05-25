import { io }
from "socket.io-client";

import { env }
from "@/config/env";

let socket;

export function createSocket(
  token
) {

  if (!socket) {

    socket = io(
      env.SOCKET_URL,

      {
        autoConnect: false,

        auth: {
          token,
        },

        transports: [
          "websocket",
          "polling",
        ],

        reconnection: true,

        reconnectionAttempts: 10,

        reconnectionDelay: 1000,

        timeout: 20000,
      }
    );
  }

  socket.auth = {
    token,
  };

  return socket;
}

export function getSocket() {
  return socket;
}