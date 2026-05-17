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
        <div className="glass absolute right-0 top-12 z-50 w-[min(360px,calc(100vw-2rem))] rounded-lg p-2">
          <div className="flex items-center justify-between p-3">
            <h2 className="font-display text-lg font-semibold text-white">Signals</h2>
            <Badge variant="cyan">Live</Badge>
          </div>
          <div className="max-h-96 space-y-2 overflow-y-auto p-1">
            {notifications.map((notification) => {
              const Icon = toneIcon[notification.tone] || Sparkles;
              return (
                <div key={notification.id} className="rounded-md border border-white/10 bg-white/[0.04] p-3">
                  <div className="flex gap-3">
                    <div className="mt-1 rounded-md bg-white/10 p-2 text-pulse">
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{notification.title}</p>
                      <p className="mt-1 text-sm leading-5 text-muted-foreground">{notification.body}</p>
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
