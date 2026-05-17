import { Heart, Play } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDuration, formatNumber } from "@/utils/format";
import { usePlayerStore } from "@/features/music/store/player.store";

export function SongCard({ song, compact = false }) {
  const playTrack = usePlayerStore((state) => state.playTrack);

  return (
    <motion.article
      whileHover={{ y: -4, scale: 1.01 }}
      className="group overflow-hidden rounded-lg border border-white/10 bg-white/[0.045] p-3 transition hover:bg-white/[0.075]"
    >
      <div className={compact ? "flex items-center gap-3" : "space-y-4"}>
        <div
          className={compact ? "size-16 shrink-0 rounded-md shadow-soft" : "aspect-square rounded-lg shadow-soft"}
          style={{ background: song.cover }}
        >
          <div className="flex h-full items-end justify-end p-3 opacity-0 transition group-hover:opacity-100">
            <Button size="icon" variant="neon" onClick={() => playTrack(song)} aria-label={`Play ${song.title}`}>
              <Play className="size-5 fill-current" />
            </Button>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate font-semibold text-white">{song.title}</h3>
              <p className="truncate text-sm text-muted-foreground">{song.artist}</p>
            </div>
            <Button variant="ghost" size="icon" aria-label={`Like ${song.title}`}>
              <Heart className="size-4" />
            </Button>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge variant="cyan">{song.mood}</Badge>
            <span className="text-xs text-muted-foreground">{formatDuration(song.duration)}</span>
            <span className="text-xs text-muted-foreground">{formatNumber(song.plays)} plays</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
