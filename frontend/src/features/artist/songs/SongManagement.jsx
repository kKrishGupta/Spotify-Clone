import { BadgeCheck, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/utils/format";

export function SongManagement({ songs }) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10">
      {songs.map((song) => (
        <div key={song.id} className="grid grid-cols-[56px_1fr_auto] items-center gap-3 border-b border-white/10 p-3 last:border-b-0">
          <div className="size-12 rounded-md" style={{ background: song.cover }} />
          <div className="min-w-0">
            <p className="truncate font-semibold text-white">{song.title}</p>
            <p className="truncate text-sm text-muted-foreground">{formatNumber(song.plays)} streams</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="green">
              <BadgeCheck className="size-3" />
              Live
            </Badge>
            <Button variant="ghost" size="icon" aria-label={`More actions for ${song.title}`}>
              <MoreHorizontal className="size-5" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
