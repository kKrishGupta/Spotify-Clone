import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/common/GlassPanel";

export function AISearchPanel({ suggestions, onSelect }) {
  return (
    <GlassPanel className="p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-md bg-pulse/10 p-3 text-pulse">
          <Sparkles className="size-5" />
        </div>
        <h2 className="font-display text-lg font-semibold text-white">Smart suggestions</h2>
      </div>
      <div className="mt-5 space-y-2">
        {suggestions.map((suggestion) => (
          <Button
            key={suggestion}
            variant="ghost"
            className="h-auto w-full justify-start whitespace-normal py-3 text-left"
            onClick={() => onSelect(suggestion)}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </GlassPanel>
  );
}
