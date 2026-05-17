import { create } from "zustand";
import { feedEvents, notifications } from "@/config/constants";

export const useAppStore = create((set) => ({
  sidebarOpen: false,
  commandOpen: false,
  notifications,
  activity: feedEvents,
  onlineUsers: [
    { id: "u1", name: "Anaya", status: "listening", color: "bg-pulse" },
    { id: "u2", name: "Rivaan", status: "mixing", color: "bg-aurora" },
    { id: "u3", name: "Mira", status: "reviewing", color: "bg-volt" },
  ],
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setCommandOpen: (commandOpen) => set({ commandOpen }),
  addNotification: (notification) =>
    set((state) => ({
      notifications: [{ id: crypto.randomUUID(), ...notification }, ...state.notifications].slice(0, 12),
    })),
  addActivity: (event) =>
    set((state) => ({
      activity: [{ id: crypto.randomUUID(), time: "now", ...event }, ...state.activity].slice(0, 18),
    })),
}));
