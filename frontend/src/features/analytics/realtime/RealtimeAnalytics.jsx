import { analyticsSeries } from "@/config/constants";
import { GlassPanel } from "@/components/common/GlassPanel";
import { RealtimeBars } from "@/features/analytics/charts/RealtimeBars";

export function RealtimeAnalytics() {
  return (
    <GlassPanel className="p-5">
      <h2 className="font-display text-xl font-semibold text-white">Realtime monitor</h2>
      <p className="mt-1 text-sm text-muted-foreground">Streams, saves, and skip pressure by minute bucket.</p>
      <div className="mt-4">
        <RealtimeBars data={analyticsSeries} />
      </div>
    </GlassPanel>
  );
}
