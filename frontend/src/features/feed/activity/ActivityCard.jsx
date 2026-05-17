import { Radio } from "lucide-react";

export function ActivityCard({ event }) {
  return (
    <article className="flex gap-3 rounded-md border border-white/10 bg-white/[0.04] p-3">
      <div className="mt-1 rounded-md bg-pulse/10 p-2 text-pulse">
        <Radio className="size-4" />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-white">
          <span className="font-semibold">{event.user}</span> {event.action}
        </p>
        <p className="truncate text-sm text-muted-foreground">{event.target}</p>
      </div>
      <span className="ml-auto text-xs text-muted-foreground">{event.time}</span>
    </article>
  );
}
