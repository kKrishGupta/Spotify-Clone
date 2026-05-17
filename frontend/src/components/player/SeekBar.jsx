import { formatDuration } from "@/utils/format";

export function SeekBar({ progress, duration, onChange }) {
  const elapsed = (duration * progress) / 100;

  return (
    <div className="grid grid-cols-[42px_1fr_42px] items-center gap-3 text-xs text-muted-foreground">
      <span>{formatDuration(elapsed)}</span>
      <input
        aria-label="Seek"
        type="range"
        min="0"
        max="100"
        value={progress}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-pulse"
      />
      <span>{formatDuration(duration)}</span>
    </div>
  );
}
