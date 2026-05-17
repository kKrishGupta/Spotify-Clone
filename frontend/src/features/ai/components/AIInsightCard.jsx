import { BrainCircuit } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { GlassPanel } from "@/components/common/GlassPanel";

export function AIInsightCard({ insight }) {
  return (
    <GlassPanel className="p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-md bg-pulse/10 p-2 text-pulse">
          <BrainCircuit className="size-5" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-white">{insight.title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{insight.value}</p>
          <div className="mt-4">
            <Progress value={insight.confidence} />
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}
