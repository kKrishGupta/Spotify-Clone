import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  AudioWaveform,
  BrainCircuit,
  ChevronRight,
  Clock3,
  Disc3,
  Gauge,
  Headphones,
  Heart,
  ListMusic,
  Pause,
  Play,
  Radio,
  Sparkles,
  UsersRound,
  Zap,
} from "lucide-react";
import { ActivityTicker } from "@/components/feed/ActivityTicker";
import { GlassPanel } from "@/components/common/GlassPanel";
import { MiniPlayer } from "@/components/player/MiniPlayer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SongCard } from "@/features/music/components/SongCard";
import { usePlayerStore } from "@/features/music/store/player.store";
import { useUserStore } from "@/features/user/store/user.store";
import { useAppStore } from "@/stores/app.store";
import { cn } from "@/lib/utils";
import { formatDuration, formatNumber } from "@/utils/format";

const fadeItem = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.38, ease: "easeOut" },
};

const statIcons = {
  Headphones,
  Heart,
  ListMusic,
  Radio,
};

const toneClasses = {
  cyan: "bg-pulse/15 text-pulse ring-pulse/25",
  pink: "bg-aurora/15 text-aurora ring-aurora/25",
  green: "bg-volt/15 text-volt ring-volt/25",
  amber: "bg-ember/15 text-ember ring-ember/25",
};

const fallbackArtwork =
  "linear-gradient(135deg, rgba(0,229,255,.84), rgba(139,92,246,.72) 48%, rgba(255,78,205,.8))";

function isCssArtwork(value) {
  return typeof value === "string" && value.includes("gradient(");
}

function artworkLayer(artwork) {
  if (!artwork) {
    return fallbackArtwork;
  }

  return isCssArtwork(artwork) ? artwork : `url("${artwork}")`;
}

function artworkStyle(artwork, overlay = false) {
  const image = artworkLayer(artwork);

  return {
    backgroundImage: overlay
      ? `linear-gradient(135deg, rgba(4,5,15,.22), rgba(4,5,15,.78)), ${image}`
      : image,
    backgroundPosition: "center",
    backgroundSize: "cover",
  };
}

function songId(song) {
  return song?._id || song?.id;
}

function isActiveSong(song, currentTrack) {
  return Boolean(songId(song) && songId(song) === songId(currentTrack));
}

function displayStatValue(stat) {
  if (typeof stat.value === "number") {
    return `${formatNumber(stat.value)}${stat.suffix || ""}`;
  }

  return stat.value;
}

const SectionHeader = memo(function SectionHeader({
  title,
  eyebrow,
  subtitle,
  action,
  icon: Icon = Sparkles,
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow ? (
          <Badge variant="cyan" className="mb-3">
            <Icon className="size-3" />
            {eyebrow}
          </Badge>
        ) : null}
        <h2 className="font-display text-2xl font-semibold text-white md:text-3xl">{title}</h2>
        {subtitle ? <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
});

export const HomeHero = memo(function HomeHero({
  hero,
  greeting,
  displayName,
  currentTrack,
  isPlaying,
  onPlay,
  queue,
}) {
  const track = hero?.track;
  const active = isActiveSong(track, currentTrack);

  if (!track) {
    return null;
  }

  return (
    <motion.section
      {...fadeItem}
      className="relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.045] shadow-card"
    >
      <div className="absolute inset-0 opacity-70" style={artworkStyle(track.thumbnail || track.cover, true)} />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(4,5,15,.86),rgba(4,5,15,.52)_42%,rgba(4,5,15,.88))]" />
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-28 bg-premium-line opacity-20 blur-3xl"
        animate={{ opacity: [0.16, 0.3, 0.16], scaleX: [0.92, 1.04, 0.92] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative grid min-h-[520px] gap-8 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_380px] lg:p-10">
        <div className="flex min-w-0 flex-col justify-end">
          <div className="mb-auto flex flex-wrap items-center gap-2">
            <Badge variant="pink">
              <Sparkles className="size-3" />
              {hero.mood}
            </Badge>
            <Badge variant="green">
              <Activity className="size-3" />
              {formatNumber(hero.activeListeners)} live signals
            </Badge>
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-pulse">{greeting}, {displayName}</p>
          <h1 className="mt-3 max-w-4xl font-display text-4xl font-semibold text-white md:text-6xl xl:text-7xl">
            Your AI discovered new music tonight
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/72 md:text-lg">{hero.reason}</p>

          <div className="mt-8 max-w-3xl rounded-lg border border-white/10 bg-black/30 p-4 backdrop-blur-xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Currently recommended
                </p>
                <h2 className="mt-2 truncate font-display text-3xl font-semibold text-white md:text-4xl">
                  {track.title}
                </h2>
                <p className="mt-1 truncate text-sm text-muted-foreground md:text-base">{track.artist}</p>
              </div>
              <Button
                variant="neon"
                size="lg"
                className="w-full shrink-0 rounded-full sm:w-auto"
                onClick={() => onPlay(track, queue)}
                aria-label={`${active && isPlaying ? "Pause" : "Play"} ${track.title}`}
              >
                {active && isPlaying ? <Pause className="size-5 fill-current" /> : <Play className="size-5 fill-current" />}
                {active && isPlaying ? "Pause" : "Play now"}
              </Button>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <HeroMetric label="AI match" value={`${hero.matchScore}%`} />
              <HeroMetric label="Energy" value={`${track.energy}%`} />
              <HeroMetric label="Tempo" value={`${track.bpm} BPM`} />
            </div>
          </div>
        </div>

        <div className="flex min-w-0 items-end">
          <div className="w-full overflow-hidden rounded-lg border border-white/10 bg-white/[0.07] p-4 shadow-glow backdrop-blur-2xl">
            <div className="aspect-square overflow-hidden rounded-lg border border-white/10 shadow-soft" style={artworkStyle(track.thumbnail || track.cover)} />
            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-display text-xl font-semibold text-white">{track.title}</p>
                <p className="truncate text-sm text-muted-foreground">{track.album}</p>
              </div>
              <Badge variant="cyan">{formatDuration(track.duration)}</Badge>
            </div>
            <div className="mt-5 flex h-14 items-end gap-1">
              {Array.from({ length: 30 }).map((_, index) => (
                <motion.span
                  key={index}
                  className="flex-1 rounded-full bg-premium-line"
                  animate={{ scaleY: [0.25, 1, 0.38] }}
                  transition={{
                    duration: 0.9 + (index % 6) * 0.08,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.025,
                  }}
                  style={{ transformOrigin: "bottom" }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
});

function HeroMetric({ label, value }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.055] p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-xl font-semibold text-white">{value}</p>
    </div>
  );
}

export const QuickStatsGrid = memo(function QuickStatsGrid({ stats }) {
  return (
    <motion.section
      variants={{ animate: { transition: { staggerChildren: 0.06 } } }}
      initial="initial"
      animate="animate"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {stats.map((stat) => {
        const Icon = statIcons[stat.icon] || Activity;

        return (
          <motion.article
            key={stat.id || stat.label}
            variants={fadeItem}
            className="glass premium-ring rounded-lg p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-2 truncate font-display text-3xl font-semibold text-white">{displayStatValue(stat)}</p>
              </div>
              <div className={cn("rounded-md p-2 ring-1", toneClasses[stat.tone] || toneClasses.cyan)}>
                <Icon className="size-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-volt">
              <Zap className="size-3" />
              +{stat.change}% this cycle
            </div>
          </motion.article>
        );
      })}
    </motion.section>
  );
});

export const MiniPlayerDock = memo(function MiniPlayerDock({ heroTrack, onPlay }) {
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const progress = usePlayerStore((state) => state.progress);
  const queue = usePlayerStore((state) => state.queue);
  const track = currentTrack || heroTrack;

  if (!track) {
    return null;
  }

  return (
    <GlassPanel hover={false} className="p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div className="size-16 shrink-0 overflow-hidden rounded-lg border border-white/10 shadow-soft" style={artworkStyle(track.thumbnail || track.cover)} />
          <div className="min-w-0">
            <Badge variant={currentTrack ? "green" : "cyan"}>{currentTrack ? "Synced mini player" : "Ready in queue"}</Badge>
            <p className="mt-2 truncate font-display text-xl font-semibold text-white">{track.title}</p>
            <p className="truncate text-sm text-muted-foreground">{track.artist}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {currentTrack ? (
            <MiniPlayer />
          ) : (
            <Button variant="neon" onClick={() => onPlay(track, queue.length ? queue : [track])}>
              <Play className="size-4 fill-current" />
              Start
            </Button>
          )}
        </div>
      </div>
      <Progress value={currentTrack ? progress : track.listenProgress} className="mt-4" />
    </GlassPanel>
  );
});

export const ContinueListeningRail = memo(function ContinueListeningRail({
  songs,
  currentTrack,
  isPlaying,
  onPlay,
}) {
  if (!songs?.length) {
    return null;
  }

  return (
    <motion.section {...fadeItem} className="space-y-4">
      <SectionHeader
        eyebrow="Resume"
        title="Continue listening"
        subtitle="A horizontal queue blended from your saved tracks, recent plays, and in-progress sessions."
        icon={Clock3}
      />
      <div className="scrollbar-premium grid auto-cols-[minmax(250px,300px)] grid-flow-col gap-4 overflow-x-auto pb-2">
        {songs.map((song) => {
          const active = isActiveSong(song, currentTrack);

          return (
            <motion.article
              key={songId(song)}
              whileHover={{ y: -4, scale: 1.01 }}
              className="group overflow-hidden rounded-lg border border-white/10 bg-white/[0.045] shadow-soft transition hover:bg-white/[0.075]"
            >
              <div className="relative h-40" style={artworkStyle(song.thumbnail || song.cover, true)}>
                <div className="absolute inset-x-3 bottom-3">
                  <Progress value={song.listenProgress} />
                </div>
                <Button
                  variant="neon"
                  size="icon"
                  className="absolute right-3 top-3 rounded-full opacity-0 transition group-hover:opacity-100"
                  onClick={() => onPlay(song, songs)}
                  aria-label={`${active && isPlaying ? "Pause" : "Play"} ${song.title}`}
                >
                  {active && isPlaying ? <Pause className="size-5 fill-current" /> : <Play className="size-5 fill-current" />}
                </Button>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate font-display text-lg font-semibold text-white">{song.title}</h3>
                    <p className="truncate text-sm text-muted-foreground">{song.artist}</p>
                  </div>
                  <Badge variant="cyan">{song.listenProgress}%</Badge>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge>{song.mood}</Badge>
                  <span className="text-xs text-muted-foreground">{formatDuration(song.duration)}</span>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </motion.section>
  );
});

export const RecentlyPlayedGrid = memo(function RecentlyPlayedGrid({ songs }) {
  if (!songs?.length) {
    return null;
  }

  return (
    <motion.section {...fadeItem} className="space-y-4">
      <SectionHeader
        eyebrow="History"
        title="Recently played"
        subtitle="Synced directly from your local player session and refreshed with library history."
        icon={Disc3}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {songs.slice(0, 6).map((song) => (
          <SongCard key={songId(song)} song={song} compact />
        ))}
      </div>
    </motion.section>
  );
});

export const PlaylistShelf = memo(function PlaylistShelf({ playlists, onPlay }) {
  if (!playlists?.length) {
    return null;
  }

  return (
    <motion.section {...fadeItem} className="space-y-4">
      <SectionHeader
        eyebrow="Collection"
        title="Your playlists"
        subtitle="Premium mixes shaped by saves, collaborators, and your active taste vector."
        icon={ListMusic}
        action={
          <Badge variant="green">
            <UsersRound className="size-3" />
            {playlists.length} live
          </Badge>
        }
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {playlists.slice(0, 4).map((playlist) => (
          <motion.article
            key={playlist.id}
            whileHover={{ y: -4, scale: 1.01 }}
            className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.045] shadow-soft"
          >
            <div className={cn("relative h-40 bg-gradient-to-br", playlist.gradient)}>
              <div className="absolute inset-3 grid grid-cols-2 gap-2">
                {(playlist.tracks.length ? playlist.tracks.slice(0, 4) : Array.from({ length: 4 })).map((track, index) => (
                  <div
                    key={track ? songId(track) : index}
                    className="rounded-md border border-white/10 bg-black/20"
                    style={track ? artworkStyle(track.thumbnail || track.cover) : undefined}
                  />
                ))}
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate font-display text-xl font-semibold text-white">{playlist.name}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{playlist.description}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onPlay(playlist.tracks[0], playlist.tracks)}
                  disabled={!playlist.tracks.length}
                  aria-label={`Play ${playlist.name}`}
                >
                  <Play className="size-4 fill-current" />
                </Button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="cyan">{playlist.trackCount} tracks</Badge>
                <Badge>{formatNumber(playlist.saves)} saves</Badge>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
});

export const AIRecommendationGrid = memo(function AIRecommendationGrid({
  songs,
  currentTrack,
  isPlaying,
  onPlay,
}) {
  if (!songs?.length) {
    return null;
  }

  return (
    <motion.section {...fadeItem} className="space-y-4">
      <SectionHeader
        eyebrow="Neural picks"
        title="AI recommendations"
        subtitle="Ranked by mood, semantic tags, genre affinity, and recent listening behavior."
        icon={BrainCircuit}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {songs.slice(0, 4).map((song, index) => {
          const active = isActiveSong(song, currentTrack);

          return (
            <motion.article
              key={songId(song)}
              whileHover={{ y: -4 }}
              className="grid overflow-hidden rounded-lg border border-white/10 bg-white/[0.045] shadow-soft sm:grid-cols-[160px_minmax(0,1fr)]"
            >
              <div className="min-h-44" style={artworkStyle(song.thumbnail || song.cover, true)} />
              <div className="flex min-w-0 flex-col justify-between p-4">
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <Badge variant={index % 2 ? "pink" : "cyan"}>
                      <Sparkles className="size-3" />
                      {song.matchScore}% match
                    </Badge>
                    <span className="text-xs text-muted-foreground">{formatNumber(song.plays)} plays</span>
                  </div>
                  <h3 className="mt-4 truncate font-display text-2xl font-semibold text-white">{song.title}</h3>
                  <p className="truncate text-sm text-muted-foreground">{song.artist}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {[song.mood, ...(song.semanticTags || [])].filter(Boolean).slice(0, 4).map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Gauge className="size-4 text-volt" />
                    {song.energy}% energy
                  </div>
                  <Button
                    variant={active ? "secondary" : "neon"}
                    onClick={() => onPlay(song, songs)}
                    aria-label={`${active && isPlaying ? "Pause" : "Play"} ${song.title}`}
                  >
                    {active && isPlaying ? <Pause className="size-4 fill-current" /> : <Play className="size-4 fill-current" />}
                    {active && isPlaying ? "Pause" : "Play"}
                  </Button>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </motion.section>
  );
});

export const GenreGrid = memo(function GenreGrid({ genres }) {
  const selectedMood = useUserStore((state) => state.selectedMood);
  const setSelectedMood = useUserStore((state) => state.setSelectedMood);

  if (!genres?.length) {
    return null;
  }

  return (
    <motion.section {...fadeItem} className="space-y-4">
      <SectionHeader
        eyebrow="Taste graph"
        title="Music genre grid"
        subtitle="Interactive clusters tuned to your current session energy and discovery patterns."
        icon={AudioWaveform}
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {genres.slice(0, 8).map((genre) => {
          const active = selectedMood === genre.name;

          return (
            <motion.button
              key={genre.id}
              type="button"
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedMood(genre.name)}
              className={cn(
                "relative min-h-32 overflow-hidden rounded-lg border p-4 text-left shadow-soft transition",
                active ? "border-pulse/60 bg-white/[0.085]" : "border-white/10 bg-white/[0.045] hover:bg-white/[0.075]",
              )}
            >
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-30", genre.tone)} />
              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-md border border-white/10 bg-black/20 p-2 text-white">
                    <Radio className="size-5" />
                  </span>
                  <Badge variant={active ? "cyan" : "default"}>{genre.match}%</Badge>
                </div>
                <div>
                  <h3 className="truncate font-display text-xl font-semibold text-white">{genre.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{genre.count} signals trending</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.section>
  );
});

export const LiveActivitySidebar = memo(function LiveActivitySidebar({ friendsOnline }) {
  const onlineUsers = useAppStore((state) => state.onlineUsers);
  const friends = useMemo(
    () => (onlineUsers?.length ? onlineUsers : friendsOnline || []).slice(0, 5),
    [friendsOnline, onlineUsers],
  );

  return (
    <aside className="space-y-4 xl:sticky xl:top-24">
      <GlassPanel hover={false} className="p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <Badge variant="green">
              <Activity className="size-3" />
              Live
            </Badge>
            <h2 className="mt-3 font-display text-xl font-semibold text-white">Live activity</h2>
          </div>
          <span className="relative flex size-3">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-volt opacity-60" />
            <span className="relative inline-flex size-3 rounded-full bg-volt" />
          </span>
        </div>
        <ActivityTicker />
      </GlassPanel>

      <GlassPanel hover={false} className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-white">Friends online</h2>
          <Badge variant="cyan">{friends.length}</Badge>
        </div>
        <div className="space-y-3">
          {friends.map((friend, index) => (
            <motion.div
              key={friend.id || friend.name}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3"
            >
              <div className="relative">
                <div className="grid size-10 place-items-center rounded-md bg-white/10 font-semibold text-white">
                  {friend.name?.slice(0, 1)}
                </div>
                <span className={cn("absolute -bottom-1 -right-1 size-3 rounded-full ring-2 ring-night", friend.color || "bg-pulse")} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">{friend.name}</p>
                <p className="truncate text-xs text-muted-foreground">{friend.status || friend.mood}</p>
              </div>
              <ChevronRight className="size-4 text-muted-foreground" />
            </motion.div>
          ))}
        </div>
      </GlassPanel>
    </aside>
  );
});
