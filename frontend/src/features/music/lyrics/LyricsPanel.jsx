import { Captions } from "lucide-react";
import { lyrics } from "@/config/constants";
import { Badge } from "@/components/ui/badge";

export function LyricsPanel() {
  return (
    <aside className="glass fixed bottom-28 left-4 z-40 max-h-[60vh] w-[min(420px,calc(100vw-2rem))] overflow-hidden rounded-lg">
      <div className="flex items-center justify-between border-b border-white/10 p-4">
        <div className="flex items-center gap-2">
          <Captions className="size-5 text-aurora" />
          <h2 className="font-display text-lg font-semibold text-white">Synced lyrics</h2>
        </div>
        <Badge variant="pink">Live</Badge>
      </div>
      <div className="space-y-3 p-4">
        {lyrics.map((line, index) => (
          <div key={line.time} className={index === 1 ? "rounded-md bg-white/10 p-3" : "p-3"}>
            <span className="text-xs text-pulse">{line.time}</span>
            <p className="mt-1 text-sm font-medium text-white">{line.line}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}
