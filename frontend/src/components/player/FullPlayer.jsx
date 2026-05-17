import { useRef } from "react";
import { Gauge, Repeat2, Shuffle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/common/GlassPanel";
import { MiniPlayer } from "@/components/player/MiniPlayer";
import { SeekBar } from "@/components/player/SeekBar";
import { VolumeControl } from "@/components/player/VolumeControl";
import { BufferingIndicator } from "@/features/streaming/buffering/BufferingIndicator";
import { useHlsStream } from "@/features/streaming/hls/useHlsStream";
import { AudioVisualizer } from "@/features/streaming/visualizer/AudioVisualizer";
import { Waveform } from "@/features/streaming/waveform/Waveform";
import { usePlayerStore } from "@/features/music/store/player.store";

export function FullPlayer() {
  const audioRef = useRef(null);
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const progress = usePlayerStore((state) => state.progress);
  const volume = usePlayerStore((state) => state.volume);
  const speed = usePlayerStore((state) => state.speed);
  const setProgress = usePlayerStore((state) => state.setProgress);
  const setVolume = usePlayerStore((state) => state.setVolume);
  const setSpeed = usePlayerStore((state) => state.setSpeed);
  const streamState = useHlsStream(audioRef, currentTrack.hlsUrl);

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
      <GlassPanel className="overflow-hidden p-6">
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <div className="aspect-square rounded-lg shadow-glow" style={{ background: currentTrack.cover }} />
          <div className="flex flex-col justify-between gap-8">
            <div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="cyan">{currentTrack.mood}</Badge>
                <BufferingIndicator buffering={streamState.buffering} level={streamState.level} />
              </div>
              <h2 className="mt-5 font-display text-4xl font-semibold text-white md:text-6xl">{currentTrack.title}</h2>
              <p className="mt-3 text-xl text-muted-foreground">{currentTrack.artist}</p>
            </div>
            <div className="space-y-5">
              <Waveform active bars={72} />
              <SeekBar progress={progress} duration={currentTrack.duration} onChange={setProgress} />
              <div className="flex flex-wrap items-center gap-3">
                <MiniPlayer />
                <VolumeControl volume={volume} onVolume={setVolume} />
                <Button variant="outline" size="sm">
                  <Shuffle className="size-4" />
                  Smart shuffle
                </Button>
                <Button variant="outline" size="sm">
                  <Repeat2 className="size-4" />
                  Repeat
                </Button>
                <label className="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm">
                  <Gauge className="size-4 text-pulse" />
                  <select
                    value={speed}
                    onChange={(event) => setSpeed(Number(event.target.value))}
                    className="bg-transparent text-white outline-none"
                  >
                    <option className="bg-ink" value="0.75">
                      0.75x
                    </option>
                    <option className="bg-ink" value="1">
                      1x
                    </option>
                    <option className="bg-ink" value="1.25">
                      1.25x
                    </option>
                    <option className="bg-ink" value="1.5">
                      1.5x
                    </option>
                  </select>
                </label>
              </div>
            </div>
          </div>
        </div>
        <audio ref={audioRef} className="sr-only" controls preload="none" />
      </GlassPanel>
      <AudioVisualizer active title="HLS stream monitor" />
    </div>
  );
}
