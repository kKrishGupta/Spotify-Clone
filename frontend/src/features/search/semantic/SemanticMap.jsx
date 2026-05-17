import { Badge } from "@/components/ui/badge";
import { GlassPanel } from "@/components/common/GlassPanel";

export function SemanticMap({ score = 88 }) {
  const nodes = ["Mood", "Tempo", "Language", "Era", "Energy", "Affinity"];

  return (
    <GlassPanel className="p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-white">Semantic map</h2>
        <Badge variant="green">{score}% match</Badge>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {nodes.map((node, index) => (
          <div key={node} className="rounded-md border border-white/10 bg-white/[0.04] p-3">
            <p className="text-sm font-semibold text-white">{node}</p>
            <div className="mt-3 h-1.5 rounded-full bg-white/10">
              <div className="h-full rounded-full bg-premium-line" style={{ width: `${68 + index * 5}%` }} />
            </div>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}
