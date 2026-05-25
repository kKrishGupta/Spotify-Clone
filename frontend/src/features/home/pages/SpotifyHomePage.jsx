import { useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BrainCircuit,
  Clock3,
  Disc3,
  Flame,
  Sparkles,
} from "lucide-react";
import { SuspenseFallback } from "@/components/common/SuspenseFallback";
import {
  ArtistRail,
  GenreGrid,
  HomeSidePanel,
  PlaylistRail,
  SongRail,
  SpotifyHomeHero,
} from "@/features/home/components/SpotifyHomeComponents";
import { useHomeFeed } from "@/features/home/hooks/useHomeFeed";
import { musicService } from "@/features/music/services/music.service";
import { usePlayerStore } from "@/features/music/store/player.store";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

function itemId(item) {
  return item?._id || item?.id || item?.title;
}

function uniqueTracks(tracks = []) {
  const seen = new Set();

  return tracks.filter((track) => {
    const key = itemId(track);

    if (!key || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export default function SpotifyHomePage() {
  useDocumentTitle("Home", "Spotify-style AI music home feed.");

  const { data, isLoading } = useHomeFeed();
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const playTrack = usePlayerStore((state) => state.playTrack);
  const togglePlay = usePlayerStore((state) => state.togglePlay);
  const hasHowl = usePlayerStore((state) => Boolean(state.howl));
  const playerRecentlyPlayed = usePlayerStore((state) => state.recentlyPlayed);

  const heroQueue = useMemo(() => {
    if (!data) {
      return [];
    }

    return uniqueTracks([
      data.heroTrack,
      ...data.recommendations,
      ...data.trending,
      ...data.newReleases,
    ]);
  }, [data]);

  const recentlyPlayed = useMemo(
    () => uniqueTracks([...playerRecentlyPlayed, ...(data?.recentlyPlayed || [])]).slice(0, 10),
    [data?.recentlyPlayed, playerRecentlyPlayed],
  );

  const handlePlay = useCallback(
    async (track, queue = heroQueue) => {
      if (!track) {
        return;
      }

      const active = itemId(track) && itemId(track) === itemId(currentTrack);

      if (active && hasHowl) {
        togglePlay();
        return;
      }

      try {
        await musicService.trackPlay(itemId(track));
      } catch (error) {
        console.error("Track play analytics failed:", error);
      }

      await playTrack(track, uniqueTracks(queue?.length ? queue : [track]));
    },
    [currentTrack, hasHowl, heroQueue, playTrack, togglePlay],
  );

  if (isLoading || !data) {
    return <SuspenseFallback />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="space-y-8"
    >
      <SpotifyHomeHero
        track={data.heroTrack}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onPlay={handlePlay}
        queue={heroQueue}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-10">
          <PlaylistRail
            title="Made for you"
            subtitle="Daily mixes tuned by your saves, skips, time of day, and AI mood graph."
            playlists={data.madeForYou}
            onPlay={handlePlay}
          />

          <SongRail
            title="Trending now"
            subtitle="Realtime ranked across active listeners and rooms."
            songs={data.trending}
            icon={Flame}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onPlay={handlePlay}
          />

          <SongRail
            title="Recently played"
            subtitle="Pick up what you started."
            songs={recentlyPlayed}
            icon={Clock3}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onPlay={handlePlay}
          />

          <SongRail
            title="AI recommendations"
            subtitle="Semantic matches from mood, genre, tempo, and listening behavior."
            songs={data.recommendations}
            icon={BrainCircuit}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onPlay={handlePlay}
            wide
          />

          <PlaylistRail
            title="Mood mixes"
            subtitle="Spotify-style rows with BeatFlow intelligence underneath."
            playlists={data.moodMixes}
            onPlay={handlePlay}
          />

          <ArtistRail artists={data.artists} />

          <SongRail
            title="New releases"
            subtitle="Fresh tracks and albums entering the graph."
            songs={data.newReleases}
            icon={Disc3}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onPlay={handlePlay}
          />

          <PlaylistRail
            title="Editorial playlists"
            subtitle="Curated collections with realtime AI context."
            playlists={data.editorialPlaylists}
            onPlay={handlePlay}
          />

          <GenreGrid genres={data.genreGrid} />

          <SongRail
            title="Because you use AI search"
            subtitle="Tracks that match your semantic taste profile."
            songs={data.queuePreview}
            icon={Sparkles}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onPlay={handlePlay}
          />
        </div>

        <HomeSidePanel
          liveActivity={data.liveActivity}
          friendActivity={data.friendActivity}
          queuePreview={data.queuePreview}
        />
      </div>
    </motion.div>
  );
}
