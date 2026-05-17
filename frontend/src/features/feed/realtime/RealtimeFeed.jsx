import { ActivityTicker } from "@/components/feed/ActivityTicker";
import { GlassPanel } from "@/components/common/GlassPanel";

export function RealtimeFeed() {
  return (
    <GlassPanel className="p-5">
      <h2 className="font-display text-xl font-semibold text-white">Realtime activity</h2>
      <p className="mt-1 text-sm text-muted-foreground">Auto-refreshing listener, artist, and ops signals.</p>
      <div className="mt-4">
        <ActivityTicker />
      </div>
    </GlassPanel>
  );
}
