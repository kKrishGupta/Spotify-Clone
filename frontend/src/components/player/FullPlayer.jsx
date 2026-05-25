import {
  useEffect,
  useRef,
} from "react";

import {
  Gauge,
  Repeat2,
  Shuffle,
} from "lucide-react";

import {
  Badge,
} from "@/components/ui/badge";

import {
  Button,
} from "@/components/ui/button";

import {
  GlassPanel,
} from "@/components/common/GlassPanel";

import {
  MiniPlayer,
} from "@/components/player/MiniPlayer";

import {
  SeekBar,
} from "@/components/player/SeekBar";

import {
  VolumeControl,
} from "@/components/player/VolumeControl";

import {
  BufferingIndicator,
} from "@/features/streaming/buffering/BufferingIndicator";

import {
  useHlsStream,
} from "@/features/streaming/hls/useHlsStream";

import {
  AudioVisualizer,
} from "@/features/streaming/visualizer/AudioVisualizer";

import {
  Waveform,
} from "@/features/streaming/waveform/Waveform";

import {
  usePlayerStore,
} from "@/features/music/store/player.store";

export function FullPlayer() {

  const audioRef =
    useRef(null);

  const {

    currentTrack,

    progress,

    volume,

    speed,

    buffering,

    audioReady,

    repeat,

    shuffle,

    cinemaMode,

    setVolume,

    setSpeed,

    seekTo,

    toggleRepeat,

    toggleShuffle,

    toggleCinemaMode,

    howl,

  } =
    usePlayerStore();

  // ✅ SAFETY FIX
  if (!currentTrack) {

    return (

      <GlassPanel className="p-12 text-center">

        <h2 className="text-2xl font-bold text-white">
          No track selected
        </h2>

        <p className="mt-3 text-muted-foreground">
          Choose a song to start the BeatFlow experience.
        </p>

      </GlassPanel>
    );
  }

  // ✅ HLS STREAM
  const streamState =
    useHlsStream(

      audioRef,

      currentTrack?.hls ||

      currentTrack?.hlsUrl
    );

  // ✅ HOWLER + AUDIO SYNC
  useEffect(() => {

    if (
      !audioRef.current ||
      !howl
    ) {
      return;
    }

    const audio =
      audioRef.current;

    const src =

      currentTrack?.hls ||

      currentTrack?.hlsUrl ||

      currentTrack?.uri;

    if (!src) {
      return;
    }

    if (
      audio.src !== src
    ) {

      audio.src = src;
    }

  }, [
    howl,
    currentTrack,
  ]);

  return (

    <div className="grid gap-6 xl:grid-cols-[1fr_420px]">

      {/* MAIN PLAYER */}
      <GlassPanel
        className={`
          overflow-hidden p-6
          transition-all duration-300

          ${
            cinemaMode

              ? "ring-2 ring-cyan-500/40"

              : ""
          }
        `}
      >

        <div className="
          grid gap-6
          lg:grid-cols-[320px_1fr]
        ">

          {/* COVER */}
          <div className="relative">

            <img

              src={
                currentTrack.thumbnail ||

                currentTrack.cover ||

                "https://placehold.co/600x600/png"
              }

              alt={
                currentTrack.title
              }

              className="
                aspect-square w-full rounded-2xl
                object-cover shadow-2xl
              "
            />

            {/* BUFFER */}
            {buffering ? (

              <div className="
                absolute inset-0 flex items-center
                justify-center rounded-2xl
                bg-black/40 backdrop-blur-sm
              ">

                <BufferingIndicator

                  buffering={
                    buffering
                  }

                  level={
                    streamState.level
                  }
                />

              </div>

            ) : null}

          </div>

          {/* INFO + CONTROLS */}
          <div className="
            flex flex-col justify-between
            gap-8
          ">

            {/* SONG INFO */}
            <div>

              <div className="
                flex flex-wrap items-center gap-2
              ">

                {currentTrack.mood ? (

                  <Badge variant="cyan">
                    {currentTrack.mood}
                  </Badge>

                ) : null}

                {audioReady ? (

                  <Badge variant="success">
                    Audio Ready
                  </Badge>

                ) : null}

                {streamState?.live ? (

                  <Badge variant="destructive">
                    LIVE
                  </Badge>

                ) : null}

              </div>

              <h2 className="
                mt-5 font-display text-4xl
                font-semibold text-white
                md:text-6xl
              ">

                {currentTrack.title}

              </h2>

              <p className="
                mt-3 text-xl text-muted-foreground
              ">

                {typeof currentTrack.artist ===
                "object"

                  ? currentTrack.artist
                      ?.username

                  : currentTrack.artist}

              </p>

            </div>

            {/* PLAYER SECTION */}
            <div className="space-y-5">

              {/* VISUAL WAVE */}
              <Waveform
                active
                bars={72}
              />

              {/* SEEK BAR */}
              <SeekBar

                progress={
                  progress
                }

                duration={
                  currentTrack.duration
                }

                onChange={
                  seekTo
                }
              />

              {/* CONTROLS */}
              <div className="
                flex flex-wrap items-center
                gap-3
              ">

                {/* MINI PLAYER */}
                <MiniPlayer />

                {/* VOLUME */}
                <VolumeControl

                  volume={
                    volume
                  }

                  onVolume={
                    setVolume
                  }
                />

                {/* SHUFFLE */}
                <Button

                  variant={
                    shuffle

                      ? "neon"

                      : "outline"
                  }

                  size="sm"

                  onClick={
                    toggleShuffle
                  }
                >

                  <Shuffle className="size-4" />

                  Shuffle

                </Button>

                {/* REPEAT */}
                <Button

                  variant={
                    repeat

                      ? "neon"

                      : "outline"
                  }

                  size="sm"

                  onClick={
                    toggleRepeat
                  }
                >

                  <Repeat2 className="size-4" />

                  Repeat

                </Button>

                {/* CINEMA MODE */}
                <Button

                  variant={
                    cinemaMode

                      ? "neon"

                      : "outline"
                  }

                  size="sm"

                  onClick={
                    toggleCinemaMode
                  }
                >

                  Cinema Mode

                </Button>

                {/* SPEED */}
                <label className="
                  flex items-center gap-2
                  rounded-md border border-white/10
                  bg-white/[0.04]
                  px-3 py-2 text-sm
                ">

                  <Gauge className="
                    size-4 text-pulse
                  " />

                  <select

                    value={
                      speed
                    }

                    onChange={
                      (event) =>

                        setSpeed(
                          Number(
                            event.target.value
                          )
                        )
                    }

                    className="
                      bg-transparent text-white
                      outline-none
                    "
                  >

                    <option
                      className="bg-ink"
                      value="0.75"
                    >
                      0.75x
                    </option>

                    <option
                      className="bg-ink"
                      value="1"
                    >
                      1x
                    </option>

                    <option
                      className="bg-ink"
                      value="1.25"
                    >
                      1.25x
                    </option>

                    <option
                      className="bg-ink"
                      value="1.5"
                    >
                      1.5x
                    </option>

                    <option
                      className="bg-ink"
                      value="2"
                    >
                      2x
                    </option>

                  </select>

                </label>

              </div>

            </div>

          </div>

        </div>

        {/* HIDDEN AUDIO */}
        <audio

          ref={audioRef}

          className="sr-only"

          controls

          preload="metadata"
        />

      </GlassPanel>

      {/* VISUALIZER */}
      <AudioVisualizer

        active={
          !!currentTrack
        }

        title="HLS stream monitor"
      />

    </div>
  );
}