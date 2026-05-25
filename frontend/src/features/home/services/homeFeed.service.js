import {
  feedEvents,
  mockSongs,
  playlists,
} from "@/config/constants";
import { musicService } from "@/features/music/services/music.service";

const artistGradients = [
  "from-pulse via-plasma to-aurora",
  "from-aurora via-ember to-plasma",
  "from-volt via-pulse to-plasma",
  "from-sky-400 via-emerald-400 to-aurora",
];

function payloadOf(value) {
  return value?.data?.data || value?.data || value?.result || value;
}

function asSongArray(value) {
  const payload = payloadOf(value);

  if (Array.isArray(payload)) {
    return payload;
  }

  return (
    payload?.songs ||
    payload?.musics ||
    payload?.tracks ||
    payload?.trending ||
    payload?.recommended ||
    []
  );
}

function numberOr(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function artistName(song = {}) {
  if (typeof song.artist === "string") {
    return song.artist;
  }

  if (Array.isArray(song.artists)) {
    return song.artists
      .map((artist) => (typeof artist === "string" ? artist : artist?.name))
      .filter(Boolean)
      .join(", ");
  }

  return song.artist?.name || song.createdBy?.name || song.uploader?.name || "Unknown artist";
}

function normalizeSong(song = {}, index = 0) {
  const cover =
    song.thumbnail ||
    song.cover ||
    song.coverUrl ||
    song.artwork ||
    song.image ||
    mockSongs[index % mockSongs.length]?.cover;
  const hls =
    song.hls ||
    song.hlsUrl ||
    song.hls_url ||
    song.streamUrl ||
    song.stream?.hls ||
    song.playback?.hls;
  const audio =
    song.audio ||
    song.audioUrl ||
    song.previewUrl ||
    song.uri ||
    song.fileUrl ||
    song.stream?.url ||
    song.playback?.url;

  return {
    ...song,
    id: song._id || song.id || song.slug || `song-${index + 1}`,
    title: song.title || song.name || "Untitled signal",
    artist: artistName(song),
    album: song.album?.title || song.album?.name || song.album || "AI discoveries",
    cover,
    thumbnail: cover,
    duration: numberOr(song.duration || song.length || song.durationSec, 190 + index * 12),
    mood: song.mood || song.vibe || song.emotion || mockSongs[index % mockSongs.length]?.mood || "AI match",
    plays: numberOr(song.plays || song.playCount || song.streams || song.totalPlays, 240000 + index * 84000),
    energy: numberOr(song.energy || song.energyScore, 58 + index * 6),
    bpm: numberOr(song.bpm || song.tempo, 84 + index * 7),
    hls,
    hlsUrl: hls,
    audio,
    previewUrl: song.previewUrl || audio,
    uri: song.uri || audio,
  };
}

function normalizeSongs(items = []) {
  const seen = new Set();

  return items
    .filter(Boolean)
    .map(normalizeSong)
    .filter((song) => {
      const key = song.id || song.title;

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
}

function normalizePlaylists(items = []) {
  return items.map((playlist, index) => ({
    ...playlist,
    id: playlist._id || playlist.id || `playlist-${index + 1}`,
    name: playlist.name || playlist.title || `Daily Mix ${index + 1}`,
    description:
      playlist.description ||
      playlist.summary ||
      "A dynamic mix shaped by saves, skips, and listening context.",
    gradient:
      playlist.gradient ||
      playlists[index % playlists.length]?.gradient ||
      "from-pulse/80 via-plasma/70 to-aurora/80",
    tracks: normalizeSongs(playlist.tracks || playlist.songs || playlist.musics || playlists[index % playlists.length]?.tracks || []),
    saves: numberOr(playlist.saves || playlist.followers || playlist.likes, 18000 + index * 12000),
  }));
}

function buildArtists(songs = []) {
  const grouped = new Map();

  songs.forEach((song) => {
    if (!grouped.has(song.artist)) {
      grouped.set(song.artist, {
        id: song.artist.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        name: song.artist,
        subtitle: song.album,
        listeners: song.plays,
        cover: artistGradients[grouped.size % artistGradients.length],
      });
    }
  });

  return Array.from(grouped.values()).slice(0, 8);
}

function buildGenreGrid(songs = []) {
  const names = [...new Set(songs.map((song) => song.mood).filter(Boolean))];

  return names.slice(0, 8).map((name, index) => ({
    id: `genre-${index}`,
    name,
    description: `${Math.max(12, 42 - index * 4)} live signals`,
    gradient: [
      "from-pulse/80 via-plasma/70 to-aurora/80",
      "from-aurora/80 via-ember/70 to-plasma/80",
      "from-volt/70 via-pulse/70 to-plasma/70",
      "from-sky-500/80 via-emerald-400/70 to-fuchsia-500/80",
    ][index % 4],
  }));
}

async function settle(request) {
  try {
    return await request();
  } catch {
    return null;
  }
}

export const homeFeedService = {
  getHomeFeed: async () => {
    const [explore, library, trendingResponse, recommendationsResponse] = await Promise.all([
      settle(musicService.getExplore),
      settle(musicService.getLibrary),
      settle(musicService.getTrendingSongs),
      settle(musicService.getRecommendations),
    ]);

    const explorePayload = payloadOf(explore) || {};
    const libraryPayload = payloadOf(library) || {};

    const allSongs = normalizeSongs([
      ...asSongArray(trendingResponse),
      ...(explorePayload.trending || []),
      ...(explorePayload.latest || []),
      ...asSongArray(recommendationsResponse),
      ...(libraryPayload.saved || []),
      ...(libraryPayload.recent || []),
      ...mockSongs,
    ]);

    const trending = normalizeSongs([
      ...asSongArray(trendingResponse),
      ...(explorePayload.trending || []),
      ...mockSongs,
    ]).slice(0, 12);
    const recommendations = normalizeSongs([
      ...asSongArray(recommendationsResponse),
      ...(explorePayload.recommended || []),
      ...mockSongs.slice().reverse(),
    ]).slice(0, 12);
    const recentlyPlayed = normalizeSongs([
      ...(libraryPayload.recent || []),
      ...mockSongs.slice(1),
    ]).slice(0, 10);
    const madeForYou = normalizePlaylists([
      ...(libraryPayload.playlists || []),
      ...playlists,
    ]).slice(0, 8);
    const moodMixes = normalizePlaylists(playlists)
      .map((playlist, index) => ({
        ...playlist,
        name: ["Focus Flow", "Night Drive", "Calm Reset"][index] || playlist.name,
      }))
      .slice(0, 6);

    return {
      heroTrack: recommendations[0] || trending[0] || allSongs[0],
      madeForYou,
      trending,
      recentlyPlayed,
      recommendations,
      moodMixes,
      artists: buildArtists(allSongs),
      newReleases: allSongs.slice(0, 8),
      editorialPlaylists: normalizePlaylists(playlists).slice().reverse(),
      genreGrid: buildGenreGrid(allSongs),
      liveActivity: feedEvents,
      friendActivity: [
        { id: "friend-1", name: "Anaya", status: "Listening to Midnight Metro", color: "bg-pulse" },
        { id: "friend-2", name: "Rivaan", status: "Building a club mix", color: "bg-aurora" },
        { id: "friend-3", name: "Mira", status: "Saved AI Focus Orbit", color: "bg-volt" },
      ],
      queuePreview: recommendations.slice(0, 5),
    };
  },
};
