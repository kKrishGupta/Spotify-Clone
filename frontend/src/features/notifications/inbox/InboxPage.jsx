import { BellRing } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GlassPanel } from "@/components/common/GlassPanel";
import { PageHeader } from "@/components/common/PageHeader";
import { useAppStore } from "@/stores/app.store";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function InboxPage() {
  useDocumentTitle("Notifications", "Realtime notification inbox.");
  const notifications = useAppStore((state) => state.notifications);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Inbox"
        title="Notification stream"
        description="Realtime alerts for AI playlists, moderation work, creator growth, and live collaboration."
      />
      <div className="grid gap-4">
        {notifications.map((notification) => (
          <GlassPanel key={notification.id} className="p-5">
            <div className="flex items-center gap-4">
              <div className="rounded-md bg-pulse/10 p-3 text-pulse">
                <BellRing className="size-6" />
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold text-white">{notification.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{notification.body}</p>
              </div>
              <Badge className="ml-auto" variant="cyan">
                {notification.tone}
              </Badge>
            </div>
          </GlassPanel>
        ))}
      </div>
    </div>
  );
}
