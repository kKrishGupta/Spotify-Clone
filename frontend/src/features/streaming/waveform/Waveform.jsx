import { cn } from "@/lib/utils";

export function Waveform({ active = true, bars = 42, className }) {
  return (
    <div className={cn("flex h-16 items-end gap-1", className)} aria-hidden="true">
      {Array.from({ length: bars }).map((_, index) => (
        <span
          key={index}
          className={cn("w-full rounded-full bg-gradient-to-t from-pulse via-aurora to-volt opacity-80", active && "animate-waveform")}
          style={{
            height: `${18 + ((index * 17) % 46)}%`,
            animationDelay: `${(index % 9) * 90}ms`,
          }}
        />
      ))}
    </div>
  );
}
