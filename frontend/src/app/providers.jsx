import {
  useEffect,
} from "react";

import {
  QueryClientProvider,
} from "@tanstack/react-query";

import {
  Toaster,
} from "sonner";

import {
  queryClient,
} from "@/lib/queryClient";

import {
  SocketProvider,
} from "@/providers/SocketProvider";

import {
  ThemeProvider,
} from "@/providers/ThemeProvider";

import {
  useAuthStore,
} from "@/features/auth/store/auth.store";

function Bootstrap() {

  const initialize =
    useAuthStore(
      (state) =>
        state.initialize
    );

  useEffect(() => {

    initialize();

  }, []);

  return null;
}

export function AppProviders({
  children,
}) {

  return (

    <QueryClientProvider
      client={queryClient}
    >

      <ThemeProvider>

        <SocketProvider>

          {/* ✅ APP INIT */}
          <Bootstrap />

          {/* ✅ APP CONTENT */}
          {children}

          {/* ✅ GLOBAL TOASTS */}
          <Toaster
            richColors
            position="top-right"
          />

        </SocketProvider>

      </ThemeProvider>

    </QueryClientProvider>
  );
}