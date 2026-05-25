import { useState } from "react";
import { Bell, CheckCircle2, Sparkles, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/stores/app.store";

const toneIcon = {
  ai: Sparkles,
  success: CheckCircle2,
  warning: TriangleAlert,
};

const toneClassName = {
  ai: "bg-pulse/15 text-pulse ring-pulse/25",
  success: "bg-volt/15 text-volt ring-volt/25",
  warning: "bg-ember/15 text-ember ring-ember/25",
};

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const notifications = useAppStore((state) => state.notifications);

  return (
    <div className="relative">
      <Button variant="outline" size="icon" onClick={() => setOpen((value) => !value)} aria-label="Notifications">
        <Bell className="size-5" />
      </Button>
      {notifications.length ? (
        <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-aurora text-[10px] font-bold text-white">
          {notifications.length}
        </span>
      ) : null}
      {open ? (
        <div className="absolute right-0 top-12 z-50 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-lg border border-white/10 bg-night/95 p-2 shadow-card ring-1 ring-white/10 backdrop-blur-2xl">
          <div className="flex items-center justify-between p-3">
            <h2 className="font-display text-lg font-semibold text-white">Signals</h2>
            <Badge variant="cyan">Live</Badge>
          </div>
          <div className="scrollbar-premium max-h-96 space-y-2 overflow-y-auto p-1">
            {notifications.map((notification) => {
              const Icon = toneIcon[notification.tone] || Sparkles;
              return (
                <div key={notification.id} className="rounded-md border border-white/10 bg-white/[0.07] p-3 shadow-soft">
                  <div className="flex gap-3">
                    <div className={`mt-1 rounded-md p-2 ring-1 ${toneClassName[notification.tone] || toneClassName.ai}`}>
                      <Icon className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-white">{notification.title}</p>
                      <p className="mt-1 text-sm leading-5 text-white/72">{notification.body}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
