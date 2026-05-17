import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/common/GlassPanel";

export function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <GlassPanel className="flex min-h-64 flex-col items-center justify-center p-8 text-center" hover={false}>
      <div className="rounded-md border border-pulse/30 bg-pulse/10 p-3 text-pulse">
        <Sparkles className="size-6" />
      </div>
      <h2 className="mt-5 font-display text-2xl font-semibold text-white">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
      {actionLabel ? (
        <Button className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </GlassPanel>
  );
}
