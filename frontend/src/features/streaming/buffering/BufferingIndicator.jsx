import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function BufferingIndicator({ buffering, level }) {
  return (
    <Badge variant={buffering ? "amber" : "cyan"}>
      {buffering ? <Loader2 className="size-3 animate-spin" /> : null}
      {buffering ? "Buffering" : level}
    </Badge>
  );
}
