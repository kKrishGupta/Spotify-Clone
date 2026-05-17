import { BrainCircuit } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { GlassPanel } from "@/components/common/GlassPanel";
import { listeningIntensity } from "@/features/user/utils/listening.utils";

export function ListeningPulse({ minutes = 68, goal = 90 }) {
  const intensity = listeningIntensity(minutes, goal);

  return (
    <GlassPanel className="p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-md bg-pulse/15 p-3 text-pulse">
          <BrainCircuit className="size-6" />
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold text-white">Listening pulse</h2>
          <p className="text-sm text-muted-foreground">Today tracks toward your focus goal</p>
        </div>
      </div>
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{minutes} min</span>
          <span className="font-semibold text-white">{goal} min</span>
        </div>
        <Progress value={intensity} />
      </div>
    </GlassPanel>
  );
}
