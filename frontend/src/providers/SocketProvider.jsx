import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { createSocket } from "@/config/socket";
import { env } from "@/config/env";

import { useAuthStore } from "@/features/auth/store/auth.store";

import { SocketContext } from "@/providers/socket-context";

import { useAppStore } from "@/stores/app.store";

const simulatedEvents = [
  {
    user: "AI Curator",
    action:
      "refined recommendations",
    target:
      "Neon Raga listeners",
  },

  {
    user:
      "Listener cluster",
    action:
      "pushed a live like surge",
    target:
      "Coastal Drive",
  },

  {
    user:
      "Playlist room",
    action:
      "added 3 tracks",
    target:
      "Mumbai After Dark",
  },
];

export function SocketProvider({
  children,
}) {

  const token =
    useAuthStore(
      (state) =>
        state.accessToken
    );

  const addActivity =
    useAppStore(
      (state) =>
        state.addActivity
    );

  const addNotification =
    useAppStore(
      (state) =>
        state.addNotification
    );

  const [status, setStatus] =
    useState(
      "simulated"
    );

  useEffect(() => {

    let socket;

    if (
      env.ENABLE_SOCKET &&
      token
    ) {

      socket =
        createSocket(
          token
        );

      socket.connect();

      // ✅ CONNECTED
      socket.on(
        "connect",
        () => {

          console.log(
            "Socket connected"
          );

          setStatus(
            "connected"
          );
        }
      );

      // ✅ DISCONNECTED
      socket.on(
        "disconnect",

        (reason) => {

          console.warn(
            "Socket disconnected:",
            reason
          );

          setStatus(
            "reconnecting"
          );
        }
      );

      // ✅ RECONNECTED
      socket.io.on(
        "reconnect",

        () => {

          console.log(
            "Socket reconnected"
          );

          setStatus(
            "connected"
          );
        }
      );

      // ✅ RECONNECT ATTEMPT
      socket.io.on(
        "reconnect_attempt",

        () => {

          setStatus(
            "reconnecting"
          );
        }
      );

      // ✅ SOCKET CONNECT ERROR
      socket.on(
        "connect_error",

        (error) => {

          console.error(
            "Socket connection error:",
            error
          );

          setStatus(
            "error"
          );
        }
      );

      // 🚀 EVENTS
      socket.on(
        "activity:new",
        addActivity
      );

      socket.on(
        "notification:new",
        addNotification
      );
    }

    // 🚀 SIMULATED REALTIME
    const ticker =
      window.setInterval(
        () => {

          const event =
            simulatedEvents[
              Math.floor(
                Math.random() *
                  simulatedEvents.length
              )
            ];

          addActivity(
            event
          );

          if (
            Math.random() >
            0.55
          ) {

            addNotification(
              {
                title:
                  "Realtime pulse",

                body:
                  `${event.user} ${event.action} for ${event.target}.`,

                tone:
                  "ai",
              }
            );
          }
        },

        9000
      );

    return () => {

      window.clearInterval(
        ticker
      );

      if (socket) {

        socket.off(
          "connect"
        );

        socket.off(
          "disconnect"
        );

        socket.off(
          "connect_error"
        );

        socket.off(
          "activity:new",
          addActivity
        );

        socket.off(
          "notification:new",
          addNotification
        );

        socket.io.off(
          "reconnect"
        );

        socket.io.off(
          "reconnect_attempt"
        );

        socket.disconnect();
      }
    };

  }, [
    addActivity,
    addNotification,
    token,
  ]);

  const value =
    useMemo(
      () => ({
        status,
      }),

      [status]
    );

  return (
    <SocketContext.Provider
      value={value}
    >
      {children}
    </SocketContext.Provider>
  );
}