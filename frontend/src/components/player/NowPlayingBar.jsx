import { useEffect } from "react";
import { Captions, ListMusic, Maximize2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";
import { MiniPlayer } from "@/components/player/MiniPlayer";
import { SeekBar } from "@/components/player/SeekBar";
import { VolumeControl } from "@/components/player/VolumeControl";
import { QueuePanel } from "@/features/music/queue/QueuePanel";
import { LyricsPanel } from "@/features/music/lyrics/LyricsPanel";
import { usePlayerStore } from "@/features/music/store/player.store";

export function NowPlayingBar() {
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const progress = usePlayerStore((state) => state.progress);
  const volume = usePlayerStore((state) => state.volume);
  const queueOpen = usePlayerStore((state) => state.queueOpen);
  const lyricsOpen = usePlayerStore((state) => state.lyricsOpen);
  const tickProgress = usePlayerStore((state) => state.tickProgress);
  const setProgress = usePlayerStore((state) => state.setProgress);
  const setVolume = usePlayerStore((state) => state.setVolume);
  const setQueueOpen = usePlayerStore((state) => state.setQueueOpen);
  const setLyricsOpen = usePlayerStore((state) => state.setLyricsOpen);

  useEffect(() => {
    const timer = window.setInterval(tickProgress, 1000);
    return () => window.clearInterval(timer);
  }, [tickProgress]);

  return (
    <>
      {queueOpen ? <QueuePanel /> : null}
      {lyricsOpen ? <LyricsPanel /> : null}
      <footer className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-black/55 px-3 py-3 backdrop-blur-2xl md:left-72">
        <div className="grid items-center gap-3 md:grid-cols-[minmax(180px,1fr)_minmax(260px,1.2fr)_minmax(180px,1fr)]">
          <div className="flex min-w-0 items-center gap-3">
            <div className="size-12 shrink-0 rounded-md shadow-glow" style={{ background: currentTrack.cover }} />
            <div className="min-w-0">
              <p className="truncate font-semibold text-white">{currentTrack.title}</p>
              <p className="truncate text-sm text-muted-foreground">{currentTrack.artist}</p>
            </div>
            <Badge variant="cyan" className="hidden lg:inline-flex">
              {currentTrack.mood}
            </Badge>
          </div>
          <div className="space-y-2">
            <MiniPlayer />
            <SeekBar progress={progress} duration={currentTrack.duration} onChange={setProgress} />
          </div>
          <div className="flex items-center justify-end gap-2">
            <VolumeControl volume={volume} onVolume={setVolume} />
            <Tooltip label="Lyrics">
              <Button variant="ghost" size="icon" onClick={() => setLyricsOpen(!lyricsOpen)}>
                <Captions className="size-5" />
              </Button>
            </Tooltip>
            <Tooltip label="Queue">
              <Button variant="ghost" size="icon" onClick={() => setQueueOpen(!queueOpen)}>
                <ListMusic className="size-5" />
              </Button>
            </Tooltip>
            <Tooltip label="Full player">
              <Button asChild variant="outline" size="icon">
                <Link to="/app/player">
                  <Maximize2 className="size-5" />
                </Link>
              </Button>
            </Tooltip>
          </div>
        </div>
      </footer>
    </>
  );
}
