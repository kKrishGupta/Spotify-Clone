import { useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { ReleaseRail } from "@/features/music/components/ReleaseRail";
import { usePlayerStore } from "@/features/music/store/player.store";
import { musicService } from "@/features/music/services/music.service";
import {
  AIRecommendationGrid,
  ContinueListeningRail,
  GenreGrid,
  HomeHero,
  LiveActivitySidebar,
  MiniPlayerDock,
  PlaylistShelf,
  QuickStatsGrid,
  RecentlyPlayedGrid,
} from "@/features/user/components/HomeDashboardSections";
import { normalizeSong } from "@/features/user/services/userDashboard.service";
import { useUserDashboard } from "@/features/user/hooks/useUserDashboard";
import { SuspenseFallback } from "@/components/common/SuspenseFallback";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { stagger } from "@/lib/motion";

function songId(song) {
  return song?._id || song?.id;
}

function mergeSongs(songs = []) {
  const seen = new Set();

  return songs
    .filter(Boolean)
    .map((song, index) => normalizeSong(song, index))
    .filter((song) => {
      const key = songId(song) || song.title;

      if (!key || seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
}

function greetingForNow() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 17) {
    return "Good afternoon";
  }

  return "Good evening";
}

function displayNameFor(user, profile) {
  const value =
    user?.username ||
    user?.name ||
    user?.fullName ||
    profile?.username ||
    profile?.name ||
    profile?.fullName ||
    "Krish";

  return value.split(" ")[0];
}

export default function UserDashboard() {
  useDocumentTitle("Home", "Personalized realtime music dashboard.");

  const { data, isLoading } = useUserDashboard();
  const authUser = useAuthStore((state) => state.user);
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const hasHowl = usePlayerStore((state) => Boolean(state.howl));
  const playTrack = usePlayerStore((state) => state.playTrack);
  const togglePlay = usePlayerStore((state) => state.togglePlay);
  const playerRecentlyPlayed = usePlayerStore((state) => state.recentlyPlayed);

  const displayName = useMemo(() => displayNameFor(authUser, data?.profile), [authUser, data?.profile]);
  const greeting = useMemo(() => greetingForNow(), []);

  const discoveryQueue = useMemo(() => {
    if (!data) {
      return [];
    }

    return mergeSongs([
      data.hero?.track,
      ...data.recommendations,
      ...data.trending,
      ...data.continueListening,
    ]);
  }, [data]);

  const recentlyPlayed = useMemo(
    () => mergeSongs([...playerRecentlyPlayed, ...(data?.recentlyPlayed || [])]).slice(0, 10),
    [data?.recentlyPlayed, playerRecentlyPlayed],
  );

  const handlePlay = useCallback(
    async (song, queue = discoveryQueue) => {
      if (!song) {
        return;
      }

      const playableSong = normalizeSong(song);
      const normalizedQueue = mergeSongs(queue?.length ? queue : [playableSong]);
      const active = songId(playableSong) && songId(playableSong) === songId(currentTrack);

      if (active && hasHowl) {
        togglePlay();
        return;
      }

      try {
        await musicService.trackPlay(songId(playableSong));
      } catch (error) {
        console.error("Track play analytics failed:", error);
      }

      await playTrack(playableSong, normalizedQueue);
    },
    [currentTrack, discoveryQueue, hasHowl, playTrack, togglePlay],
  );

  if (isLoading || !data) {
    return <SuspenseFallback />;
  }

  return (
    <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-6">
      <HomeHero
        hero={data.hero}
        greeting={greeting}
        displayName={displayName}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onPlay={handlePlay}
        queue={discoveryQueue}
      />

      <QuickStatsGrid stats={data.stats} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-8">
          <MiniPlayerDock heroTrack={data.hero.track} onPlay={handlePlay} />

          <ContinueListeningRail
            songs={data.continueListening}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onPlay={handlePlay}
          />

          <ReleaseRail title="Trending now" songs={data.trending} />

          <RecentlyPlayedGrid songs={recentlyPlayed} />

          <PlaylistShelf playlists={data.playlists} onPlay={handlePlay} />

          <AIRecommendationGrid
            songs={data.recommendations}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onPlay={handlePlay}
          />

          <GenreGrid genres={data.genres} />
        </div>

        <LiveActivitySidebar friendsOnline={data.friendsOnline} />
      </div>
    </motion.div>
  );
}
