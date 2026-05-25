import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Sparkles, TriangleAlert, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/stores/app.store";

const toneIcon = {
  ai: Sparkles,
  success: CheckCircle2,
  warning: TriangleAlert,
};

const toneClassName = {
  ai: "text-pulse bg-pulse/15 ring-pulse/25",
  success: "text-volt bg-volt/15 ring-volt/25",
  warning: "text-ember bg-ember/15 ring-ember/25",
};

export function ToastHub() {
  const notifications = useAppStore((state) => state.notifications);
  const [dismissed, setDismissed] = useState(() => new Set());

  const toasts = useMemo(
    () =>
      notifications
        .filter((notification) => notification.toast === true && !dismissed.has(notification.id))
        .slice(0, 2),
    [dismissed, notifications],
  );

  useEffect(() => {
    const timers = toasts.map((notification) =>
      window.setTimeout(() => {
        setDismissed((current) => new Set(current).add(notification.id));
      }, notification.duration || 5200),
    );

    return () => {
      timers.forEach(window.clearTimeout);
    };
  }, [toasts]);

  if (!toasts.length) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed right-4 top-24 z-50 hidden w-[min(22rem,calc(100vw-2rem))] space-y-3 xl:block">
      <AnimatePresence initial={false}>
        {toasts.map((notification) => {
          const Icon = toneIcon[notification.tone] || Sparkles;

          return (
            <motion.div
              key={notification.id}
              layout
              initial={{ opacity: 0, x: 28, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 24, scale: 0.96 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className="pointer-events-auto overflow-hidden rounded-lg border border-white/10 bg-night/92 p-4 shadow-card ring-1 ring-white/10 backdrop-blur-2xl"
            >
              <div className="flex gap-3">
                <div className={`mt-0.5 rounded-md p-2 ring-1 ${toneClassName[notification.tone] || toneClassName.ai}`}>
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-white">{notification.title}</p>
                  <p className="mt-1 text-sm leading-5 text-white/68">{notification.body}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0"
                  onClick={() => setDismissed((current) => new Set(current).add(notification.id))}
                  aria-label="Dismiss notification"
                >
                  <X className="size-4" />
                </Button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
