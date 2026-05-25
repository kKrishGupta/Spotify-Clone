import {
  Heart,
  Play,
} from "lucide-react";

import {
  motion,
} from "framer-motion";

import {
  Button,
} from "@/components/ui/button";

import {
  Badge,
} from "@/components/ui/badge";

import {
  formatDuration,
  formatNumber,
} from "@/utils/format";

import {
  usePlayerStore,
} from "@/features/music/store/player.store";

import {
  musicService,
} from "@/features/music/services/music.service";

const fallbackArtwork =
  "linear-gradient(135deg, rgba(0,229,255,.84), rgba(139,92,246,.72) 48%, rgba(255,78,205,.8))";

function isCssArtwork(value) {
  return typeof value === "string" && value.includes("gradient(");
}

function getArtwork(song) {
  return (
    song?.thumbnail ||
    song?.cover ||
    song?.coverUrl ||
    song?.artwork ||
    song?.image ||
    fallbackArtwork
  );
}

function getArtworkStyle(song) {
  const artwork =
    getArtwork(song);

  return {
    backgroundImage:
      isCssArtwork(artwork)
        ? artwork
        : `url(${artwork})`,
    backgroundSize:
      "cover",
    backgroundPosition:
      "center",
  };
}

function getPlayableSong(song) {
  const artwork =
    getArtwork(song);

  const hls =
    song?.hls ||
    song?.hlsUrl ||
    song?.streamUrl ||
    song?.stream?.hls ||
    song?.playback?.hls;

  const audio =
    song?.audio ||
    song?.audioUrl ||
    song?.previewUrl ||
    song?.uri ||
    song?.fileUrl ||
    song?.stream?.url ||
    song?.playback?.url;

  return {
    ...song,
    id:
      song?._id ||
      song?.id,
    cover:
      artwork,
    thumbnail:
      artwork,
    hls,
    hlsUrl:
      song?.hlsUrl ||
      hls,
    audio,
    previewUrl:
      song?.previewUrl ||
      audio,
    uri:
      song?.uri ||
      audio,
  };
}

export function SongCard({
  song,
  compact = false,
}) {

  const playTrack =
    usePlayerStore(
      (state) =>
        state.playTrack
    );

  // ✅ TRACK PLAY + PLAY SONG
  const handlePlay =
    async () => {

      const playableSong =
        getPlayableSong(song);

      try {

        await musicService
          .trackPlay(

            playableSong._id ||
            playableSong.id
          );

      } catch (err) {

        console.error(
          "Track play failed:",
          err
        );
      }

      playTrack(
        playableSong,
        [playableSong]
      );
    };

  return (

    <motion.article

      whileHover={{
        y: -4,
        scale: 1.01,
      }}

      className="group overflow-hidden rounded-lg border border-white/10 bg-white/[0.045] p-3 transition hover:bg-white/[0.075]"
    >

      <div
        className={
          compact
            ? "flex items-center gap-3"
            : "space-y-4"
        }
      >

        {/* COVER */}
        <div

          className={
            compact

              ? "size-16 shrink-0 rounded-md shadow-soft"

              : "aspect-square rounded-lg shadow-soft"
          }

          style={
            getArtworkStyle(song)
          }
        >

          <div className="flex h-full items-end justify-end p-3 opacity-0 transition group-hover:opacity-100">

            <Button
              size="icon"

              variant="neon"

              onClick={
                handlePlay
              }

              aria-label={`Play ${song.title}`}
            >

              <Play className="size-5 fill-current" />

            </Button>

          </div>

        </div>

        {/* CONTENT */}
        <div className="min-w-0 flex-1">

          <div className="flex items-start justify-between gap-2">

            <div className="min-w-0">

              <h3 className="truncate font-semibold text-white">
                {song.title}
              </h3>

              <p className="truncate text-sm text-muted-foreground">
                {song.artist}
              </p>

            </div>

            {/* LIKE */}
            <Button
              variant="ghost"

              size="icon"

              aria-label={`Like ${song.title}`}
            >

              <Heart className="size-4" />

            </Button>

          </div>

          {/* META */}
          <div className="mt-3 flex flex-wrap items-center gap-2">

            <Badge variant="cyan">
              {song.mood}
              {song.mood
                ? null
                : "AI matched"}
            </Badge>

            <span className="text-xs text-muted-foreground">
              {
                formatDuration(
                  song.duration
                )
              }
            </span>

            <span className="text-xs text-muted-foreground">

              {
                formatNumber(
                  song.plays ||
                  0
                )
              }

              {" "}
              plays

            </span>

          </div>

        </div>

      </div>

    </motion.article>
  );
}
