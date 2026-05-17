import { createContext, useContext } from "react";

export const SocketContext = createContext(null);

export function useSocketStatus() {
  const value = useContext(SocketContext);
  if (!value) {
    throw new Error("useSocketStatus must be used inside SocketProvider");
  }
  return value;
}
