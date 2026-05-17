import * as Icons from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GlassPanel } from "@/components/common/GlassPanel";
import { formatNumber, formatPercent } from "@/utils/format";

export function StatCard({ label, value, change, icon = "Activity", suffix = "" }) {
  const Icon = Icons[icon] || Icons.Activity;

  return (
    <GlassPanel className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 font-display text-2xl font-semibold text-white">
            {formatNumber(value)}
            {suffix}
          </p>
        </div>
        <div className="rounded-md border border-white/10 bg-white/10 p-2 text-pulse">
          <Icon className="size-5" />
        </div>
      </div>
      <Badge variant={change >= 0 ? "green" : "amber"} className="mt-4">
        {formatPercent(change)} vs last cycle
      </Badge>
    </GlassPanel>
  );
}
