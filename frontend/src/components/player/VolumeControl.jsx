import { Volume2, VolumeX } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";

export function VolumeControl({ volume, onVolume }) {
  const Icon = volume === 0 ? VolumeX : Volume2;

  return (
    <Tooltip label="Volume">
      <label className="hidden items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-2 py-2 md:flex">
        <Icon className="size-4 text-muted-foreground" />
        <input
          aria-label="Volume"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(event) => onVolume(Number(event.target.value))}
          className="h-1.5 w-20 cursor-pointer appearance-none rounded-full bg-white/10 accent-pulse"
        />
      </label>
    </Tooltip>
  );
}
