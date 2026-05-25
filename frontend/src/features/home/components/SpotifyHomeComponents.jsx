import { memo } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  BrainCircuit,
  Clock3,
  ListMusic,
  Pause,
  Play,
  Radio,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { ActivityTicker } from "@/components/feed/ActivityTicker";
import { GlassPanel } from "@/components/common/GlassPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { formatDuration, formatNumber } from "@/utils/format";

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.36, ease: "easeOut" },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.055,
    },
  },
};

const fallbackCover =
  "linear-gradient(135deg, rgba(0,229,255,.82), rgba(139,92,246,.72) 48%, rgba(255,78,205,.82))";

function isGradient(value) {
  return typeof value === "string" && value.includes("gradient(");
}

function coverStyle(cover, overlay = false) {
  const layer = cover
    ? isGradient(cover)
      ? cover
      : `url("${cover}")`
    : fallbackCover;

  return {
    backgroundImage: overlay
      ? `linear-gradient(135deg, rgba(4,5,15,.12), rgba(4,5,15,.82)), ${layer}`
      : layer,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
}

function itemId(item) {
  return item?._id || item?.id || item?.title || item?.name;
}

function isActive(track, currentTrack) {
  return Boolean(itemId(track) && itemId(track) === itemId(currentTrack));
}

function RailHeader({ title, subtitle, icon: Icon = Sparkles }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div className="min-w-0">
        <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-white">
          <Icon className="size-5 text-pulse" />
          {title}
        </h2>
        {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      <Button variant="ghost" size="sm" className="hidden shrink-0 sm:inline-flex">
        Show all
      </Button>
    </div>
  );
}

export const SpotifyHomeHero = memo(function SpotifyHomeHero({
  track,
  currentTrack,
  isPlaying,
  onPlay,
  queue,
}) {
  if (!track) {
    return null;
  }

  const active = isActive(track, currentTrack);

  return (
    <motion.section
      {...fadeUp}
      className="relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.045] shadow-card"
    >
      <div className="absolute inset-0 opacity-70" style={coverStyle(track.cover || track.thumbnail, true)} />
      <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(4,5,15,.84),rgba(4,5,15,.48)_52%,rgba(4,5,15,.9))]" />
      <div className="relative grid min-h-[390px] gap-8 p-5 md:p-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex min-w-0 flex-col justify-end">
          <div className="mb-auto flex flex-wrap gap-2">
            <Badge variant="green">
              <Activity className="size-3" />
              Spotify-style home
            </Badge>
            <Badge variant="pink">
              <BrainCircuit className="size-3" />
              AI blended
            </Badge>
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-pulse">Featured recommendation</p>
          <h1 className="mt-3 max-w-4xl font-display text-4xl font-semibold text-white md:text-6xl">
            Start with {track.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/72">
            A high-affinity pick from your recent saves, live room trends, and AI mood graph.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              variant="neon"
              size="lg"
              className="rounded-full"
              onClick={() => onPlay(track, queue)}
            >
              {active && isPlaying ? <Pause className="size-5 fill-current" /> : <Play className="size-5 fill-current" />}
              {active && isPlaying ? "Pause" : "Play"}
            </Button>
            <Button variant="outline" size="lg" className="rounded-full">
              <ListMusic className="size-5" />
              Add to queue
            </Button>
          </div>
        </div>
        <div className="hidden items-end xl:flex">
          <div className="w-full rounded-lg border border-white/10 bg-black/30 p-4 shadow-glow backdrop-blur-2xl">
            <div className="aspect-square rounded-lg border border-white/10" style={coverStyle(track.cover || track.thumbnail)} />
            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-display text-xl font-semibold text-white">{track.title}</p>
                <p className="truncate text-sm text-muted-foreground">{track.artist}</p>
              </div>
              <Badge variant="cyan">{formatDuration(track.duration)}</Badge>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
});

export const SongTile = memo(function SongTile({
  song,
  currentTrack,
  isPlaying,
  onPlay,
  queue,
  wide = false,
}) {
  const active = isActive(song, currentTrack);

  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -5, scale: 1.012 }}
      className={cn(
        "group overflow-hidden rounded-lg border border-white/10 bg-white/[0.045] shadow-soft transition hover:bg-white/[0.075]",
        wide ? "w-[280px]" : "w-[210px]",
      )}
    >
      <div className="relative aspect-square" style={coverStyle(song.cover || song.thumbnail, true)}>
        <Button
          variant="neon"
          size="icon"
          className="absolute bottom-3 right-3 rounded-full opacity-0 shadow-glow transition group-hover:opacity-100"
          onClick={() => onPlay(song, queue)}
          aria-label={`Play ${song.title}`}
        >
          {active && isPlaying ? <Pause className="size-5 fill-current" /> : <Play className="size-5 fill-current" />}
        </Button>
      </div>
      <div className="p-4">
        <h3 className="truncate font-display text-lg font-semibold text-white">{song.title}</h3>
        <p className="mt-1 truncate text-sm text-muted-foreground">{song.artist}</p>
        <div className="mt-3 flex items-center gap-2">
          <Badge variant={active ? "green" : "cyan"}>{song.mood}</Badge>
          <span className="text-xs text-muted-foreground">{formatDuration(song.duration)}</span>
        </div>
      </div>
    </motion.article>
  );
});

export const SongRail = memo(function SongRail({
  title,
  subtitle,
  songs,
  icon,
  currentTrack,
  isPlaying,
  onPlay,
  wide = false,
}) {
  if (!songs?.length) {
    return null;
  }

  return (
    <motion.section variants={stagger} initial="initial" animate="animate">
      <RailHeader title={title} subtitle={subtitle} icon={icon} />
      <div className="scrollbar-premium grid auto-cols-max grid-flow-col gap-4 overflow-x-auto pb-3">
        {songs.map((song) => (
          <SongTile
            key={itemId(song)}
            song={song}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onPlay={onPlay}
            queue={songs}
            wide={wide}
          />
        ))}
      </div>
    </motion.section>
  );
});

export const PlaylistRail = memo(function PlaylistRail({
  title,
  subtitle,
  playlists,
  onPlay,
}) {
  if (!playlists?.length) {
    return null;
  }

  return (
    <motion.section variants={stagger} initial="initial" animate="animate">
      <RailHeader title={title} subtitle={subtitle} icon={ListMusic} />
      <div className="scrollbar-premium grid auto-cols-[280px] grid-flow-col gap-4 overflow-x-auto pb-3">
        {playlists.map((playlist) => (
          <motion.article
            key={playlist.id}
            variants={fadeUp}
            whileHover={{ y: -5, scale: 1.012 }}
            className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.045] shadow-soft transition hover:bg-white/[0.075]"
          >
            <div className={cn("relative h-40 bg-gradient-to-br", playlist.gradient)}>
              <div className="absolute inset-3 grid grid-cols-2 gap-2">
                {playlist.tracks.slice(0, 4).map((track) => (
                  <div key={itemId(track)} className="rounded-md border border-white/10" style={coverStyle(track.cover || track.thumbnail)} />
                ))}
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate font-display text-lg font-semibold text-white">{playlist.name}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{playlist.description}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={!playlist.tracks.length}
                  onClick={() => onPlay(playlist.tracks[0], playlist.tracks)}
                  aria-label={`Play ${playlist.name}`}
                >
                  <Play className="size-4 fill-current" />
                </Button>
              </div>
              <div className="mt-4 flex gap-2">
                <Badge variant="cyan">{playlist.tracks.length} tracks</Badge>
                <Badge>{formatNumber(playlist.saves)} saves</Badge>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
});

export const ArtistRail = memo(function ArtistRail({ artists }) {
  if (!artists?.length) {
    return null;
  }

  return (
    <motion.section variants={stagger} initial="initial" animate="animate">
      <RailHeader title="Popular artists" subtitle="Creator signals rising across the network." icon={UsersRound} />
      <div className="scrollbar-premium grid auto-cols-[180px] grid-flow-col gap-4 overflow-x-auto pb-3">
        {artists.map((artist) => (
          <motion.article
            key={artist.id}
            variants={fadeUp}
            whileHover={{ y: -5 }}
            className="rounded-lg border border-white/10 bg-white/[0.045] p-4 text-center shadow-soft transition hover:bg-white/[0.075]"
          >
            <div className={cn("mx-auto size-32 rounded-full bg-gradient-to-br shadow-glow", artist.cover)} />
            <h3 className="mt-4 truncate font-display text-lg font-semibold text-white">{artist.name}</h3>
            <p className="mt-1 truncate text-sm text-muted-foreground">{artist.subtitle}</p>
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
});

export const GenreGrid = memo(function GenreGrid({ genres }) {
  if (!genres?.length) {
    return null;
  }

  return (
    <section>
      <RailHeader title="Genre grid" subtitle="Jump into mood-led rooms and collections." icon={Radio} />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {genres.map((genre) => (
          <motion.button
            key={genre.id}
            type="button"
            whileHover={{ y: -4, scale: 1.01 }}
            className={cn("min-h-32 rounded-lg bg-gradient-to-br p-4 text-left shadow-soft", genre.gradient)}
          >
            <h3 className="font-display text-xl font-semibold text-white">{genre.name}</h3>
            <p className="mt-2 text-sm text-white/72">{genre.description}</p>
          </motion.button>
        ))}
      </div>
    </section>
  );
});

export const HomeSidePanel = memo(function HomeSidePanel({
  liveActivity,
  friendActivity,
  queuePreview,
}) {
  return (
    <aside className="space-y-4 xl:sticky xl:top-24">
      <GlassPanel hover={false} className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-white">Live listening</h2>
          <Badge variant="green">Live</Badge>
        </div>
        <ActivityTicker />
        <div className="mt-4 space-y-2">
          {liveActivity?.slice(0, 3).map((event) => (
            <div key={event.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-3">
              <p className="text-sm text-white">
                <span className="font-semibold">{event.user}</span> {event.action}
              </p>
              <p className="mt-1 truncate text-xs text-muted-foreground">{event.target}</p>
            </div>
          ))}
        </div>
      </GlassPanel>

      <GlassPanel hover={false} className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-white">Friend activity</h2>
          <Badge variant="cyan">{friendActivity?.length || 0}</Badge>
        </div>
        <div className="space-y-3">
          {friendActivity?.map((friend) => (
            <div key={friend.id} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.045] p-3">
              <div className="relative">
                <div className="grid size-10 place-items-center rounded-md bg-white/10 font-semibold text-white">
                  {friend.name.slice(0, 1)}
                </div>
                <span className={cn("absolute -bottom-1 -right-1 size-3 rounded-full ring-2 ring-night", friend.color)} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{friend.name}</p>
                <p className="truncate text-xs text-muted-foreground">{friend.status}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassPanel>

      <GlassPanel hover={false} className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-white">Smart queue</h2>
          <Clock3 className="size-5 text-pulse" />
        </div>
        <div className="space-y-3">
          {queuePreview?.map((song, index) => (
            <div key={itemId(song)} className="flex items-center gap-3">
              <span className="w-5 text-xs text-muted-foreground">{index + 1}</span>
              <div className="size-10 rounded-md" style={coverStyle(song.cover || song.thumbnail)} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">{song.title}</p>
                <p className="truncate text-xs text-muted-foreground">{song.artist}</p>
              </div>
            </div>
          ))}
        </div>
        <Progress value={68} className="mt-4" />
      </GlassPanel>
    </aside>
  );
});
