import {
  useEffect,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  Captions,
  ListMusic,
  Maximize2,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";

import {
  Button,
} from "@/components/ui/button";

import {
  Badge,
} from "@/components/ui/badge";

import {
  Slider,
} from "@/components/ui/slider";

import {
  Tooltip,
} from "@/components/ui/tooltip";

import {
  QueuePanel,
} from "@/features/music/queue/QueuePanel";

import {
  LyricsPanel,
} from "@/features/music/lyrics/LyricsPanel";

import {
  usePlayerStore,
} from "@/features/music/store/player.store";

const fallbackArtwork =
  "linear-gradient(135deg, rgba(0,229,255,.82), rgba(139,92,246,.72) 48%, rgba(255,78,205,.82))";

function isGradient(value) {
  return typeof value === "string" && value.includes("gradient(");
}

function artworkStyle(track) {
  const artwork =
    track?.thumbnail ||
    track?.cover ||
    track?.coverUrl ||
    fallbackArtwork;

  return {
    backgroundImage:
      isGradient(artwork)
        ? artwork
        : `url("${artwork}")`,
    backgroundSize:
      "cover",
    backgroundPosition:
      "center",
  };
}

export function NowPlayingBar() {

  const {

    currentTrack,

    isPlaying,

    togglePlay,

    playNext,

    playPrevious,

    volume,

    setVolume,

    progress,

    seekTo,

    queueOpen,

    lyricsOpen,

    tickProgress,

    syncProgress,

    setQueueOpen,

    setLyricsOpen,

  } =
    usePlayerStore();

  // ✅ AUTO PROGRESS
  useEffect(() => {

    const progressTicker =
      tickProgress ||
      syncProgress;

    if (
      !isPlaying ||
      typeof progressTicker !== "function"
    ) {
      return;
    }

    const timer =
      window.setInterval(

        progressTicker,

        1000
      );

    return () =>
      window.clearInterval(
        timer
      );

  }, [
    isPlaying,
    syncProgress,
    tickProgress,
  ]);

  // 🚨 SAFETY FIX
  if (!currentTrack) {

    return (

      <div className="
        fixed bottom-0 left-0 right-0 z-50
        border-t border-white/10
        bg-black/60
        px-6 py-4
        backdrop-blur-2xl
      ">

        <div className="
          flex items-center justify-center
          text-sm text-muted-foreground
        ">

          No music playing

        </div>

      </div>
    );
  }

  return (

    <>

      {/* QUEUE */}
      {queueOpen
        ? <QueuePanel />
        : null}

      {/* LYRICS */}
      {lyricsOpen
        ? <LyricsPanel />
        : null}

      {/* PLAYER */}
      <footer className="
        fixed bottom-0 left-0 right-0 z-50
        border-t border-white/10
        bg-black/60
        px-4 py-3
        backdrop-blur-2xl
        md:left-72
      ">

        <div className="
          flex items-center justify-between gap-6
        ">

          {/* TRACK INFO */}
          <div className="
            flex min-w-0 items-center gap-4
            w-[260px]
          ">

            <div
              aria-label={
                currentTrack.title
              }
              className="
                h-14 w-14 shrink-0 rounded-lg
                border border-white/10 shadow-lg
              "
              style={
                artworkStyle(
                  currentTrack
                )
              }
            />

            <div className="min-w-0">

              <p className="
                truncate font-semibold text-white
              ">
                {currentTrack.title}
              </p>

              <p className="
                truncate text-sm text-muted-foreground
              ">
                {currentTrack.artist}
              </p>

              {currentTrack.mood ? (

                <Badge
                  variant="cyan"
                  className="mt-1"
                >
                  {currentTrack.mood}
                </Badge>

              ) : null}

            </div>

          </div>

          {/* PLAYER CONTROLS */}
          <div className="
            flex flex-1 flex-col items-center
            gap-3
          ">

            {/* BUTTONS */}
            <div className="
              flex items-center gap-4
            ">

              <Button
                variant="ghost"
                size="icon"

                onClick={
                  playPrevious
                }
              >

                <SkipBack className="size-5" />

              </Button>

              <Button

                size="icon"

                variant="neon"

                className="
                  h-12 w-12 rounded-full
                "

                onClick={
                  togglePlay
                }
              >

                {isPlaying ? (

                  <Pause className="size-5 fill-current" />

                ) : (

                  <Play className="size-5 fill-current" />

                )}

              </Button>

              <Button
                variant="ghost"
                size="icon"

                onClick={
                  playNext
                }
              >

                <SkipForward className="size-5" />

              </Button>

            </div>

            {/* SEEK */}
            <div className="
              w-full max-w-2xl
            ">

              <Slider

                value={[
                  progress || 0,
                ]}

                min={0}

                max={100}

                step={1}

                onValueChange={
                  ([v]) =>
                    seekTo(v)
                }
              />

            </div>

          </div>

          {/* RIGHT PANEL */}
          <div className="
            flex items-center justify-end gap-3
            w-[260px]
          ">

            {/* VOLUME */}
            <div className="
              hidden items-center gap-2
              md:flex
            ">

              <Volume2 className="size-4 text-muted-foreground" />

              <div className="w-24">

                <Slider

                  value={[
                    volume * 100,
                  ]}

                  min={0}

                  max={100}

                  step={1}

                  onValueChange={
                    ([v]) =>
                      setVolume(
                        v / 100
                      )
                  }
                />

              </div>

            </div>

            {/* LYRICS */}
            <Tooltip label="Lyrics">

              <Button
                variant="ghost"
                size="icon"

                onClick={() =>
                  setLyricsOpen(
                    !lyricsOpen
                  )
                }
              >

                <Captions className="size-5" />

              </Button>

            </Tooltip>

            {/* QUEUE */}
            <Tooltip label="Queue">

              <Button
                variant="ghost"
                size="icon"

                onClick={() =>
                  setQueueOpen(
                    !queueOpen
                  )
                }
              >

                <ListMusic className="size-5" />

              </Button>

            </Tooltip>

            {/* FULL PLAYER */}
            <Tooltip label="Full player">

              <Button
                asChild
                variant="outline"
                size="icon"
              >

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
