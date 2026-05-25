import {
  analyticsSeries,
  feedEvents,
  mockSongs,
  playlists as fallbackPlaylists,
} from "@/config/constants";
import { musicService } from "@/features/music/services/music.service";
import { userService } from "@/features/user/services/user.service";

const fallbackGenres = [
  { id: "genre-focus", name: "AI Focus", tone: "from-pulse/70 via-plasma/70 to-aurora/70" },
  { id: "genre-pop", name: "Future Pop", tone: "from-aurora/70 via-ember/70 to-plasma/70" },
  { id: "genre-lofi", name: "Solar Lo-Fi", tone: "from-volt/70 via-pulse/60 to-plasma/70" },
  { id: "genre-indie", name: "Indian Indie", tone: "from-ember/70 via-aurora/65 to-pulse/70" },
  { id: "genre-synth", name: "Synthwave", tone: "from-plasma/75 via-pulse/65 to-aurora/70" },
  { id: "genre-calm", name: "Deep Calm", tone: "from-pulse/60 via-volt/60 to-plasma/65" },
];

const fallbackFriends = [
  { id: "friend-1", name: "Anaya", status: "listening", mood: "Night drive", color: "bg-pulse" },
  { id: "friend-2", name: "Rivaan", status: "mixing", mood: "High energy", color: "bg-aurora" },
  { id: "friend-3", name: "Mira", status: "discovering", mood: "Deep calm", color: "bg-volt" },
  { id: "friend-4", name: "Dev", status: "queued", mood: "Future pop", color: "bg-ember" },
];

const gradientCovers = [
  "linear-gradient(135deg, #00e5ff 0%, #2b1658 45%, #ff4ecd 100%)",
  "linear-gradient(135deg, #111827 0%, #00e5ff 52%, #b8ff5c 100%)",
  "linear-gradient(135deg, #ff4ecd 0%, #37164d 42%, #8b5cf6 100%)",
  "linear-gradient(135deg, #0f766e 0%, #38bdf8 46%, #f97316 100%)",
  "linear-gradient(135deg, #1e1b4b 0%, #6366f1 42%, #22d3ee 100%)",
  "linear-gradient(135deg, #fb7185 0%, #f59e0b 48%, #84cc16 100%)",
];

function payloadOf(value) {
  return value?.data?.data || value?.data || value?.result || value;
}

function asArray(value) {
  if (Array.isArray(value)) {
    return value;
  }

  const payload = payloadOf(value);

  if (Array.isArray(payload)) {
    return payload;
  }

  return [];
}

function firstArray(source, keys) {
  const payload = payloadOf(source);

  for (const key of keys) {
    const value =
      payload?.[key] ||
      payload?.data?.[key] ||
      payload?.result?.[key] ||
      payload?.music?.[key];

    if (Array.isArray(value)) {
      return value;
    }
  }

  return asArray(payload);
}

function numberOr(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function artistName(song = {}) {
  if (typeof song.artist === "string") {
    return song.artist;
  }

  if (Array.isArray(song.artists) && song.artists.length) {
    return song.artists
      .map((artist) => (typeof artist === "string" ? artist : artist?.name))
      .filter(Boolean)
      .join(", ");
  }

  return song.artist?.name || song.createdBy?.name || song.uploader?.name || "Unknown artist";
}

function uniqueById(items) {
  const seen = new Set();

  return items.filter((item) => {
    const key = item?._id || item?.id || item?.title;

    if (!key || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export function normalizeSong(song = {}, index = 0) {
  const id = song._id || song.id || song.slug || `song-${index + 1}`;
  const artwork =
    song.thumbnail ||
    song.cover ||
    song.coverUrl ||
    song.artwork ||
    song.image ||
    gradientCovers[index % gradientCovers.length];
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
  const semanticTags =
    song.semanticTags ||
    song.tags ||
    song.aiTags ||
    [song.mood, song.genre || song.genres?.[0], song.language].filter(Boolean);
  const genres = Array.isArray(song.genres)
    ? song.genres
    : [song.genre, song.category].filter(Boolean);

  return {
    ...song,
    _id: song._id,
    id,
    title: song.title || song.name || "Untitled signal",
    artist: artistName(song),
    album: song.album?.title || song.album?.name || song.album || "AI discoveries",
    cover: artwork,
    thumbnail: song.thumbnail || artwork,
    duration: numberOr(song.duration || song.length || song.durationSec, 210 + index * 9),
    bpm: numberOr(song.bpm || song.tempo, 92 + index * 6),
    energy: numberOr(song.energy || song.energyScore, 64 + index * 5),
    mood: song.mood || song.vibe || song.emotion || "AI matched",
    plays: numberOr(song.plays || song.playCount || song.streams || song.totalPlays, 220000 + index * 18400),
    hls,
    hlsUrl: song.hlsUrl || hls,
    audio,
    previewUrl: song.previewUrl || audio,
    uri: song.uri || audio,
    semanticTags: semanticTags.filter(Boolean).slice(0, 4),
    genres: genres.filter(Boolean).slice(0, 3),
    matchScore: numberOr(song.matchScore || song.score || song.affinity, 92 - index * 3),
    listenProgress: numberOr(song.listenProgress || song.progress, Math.min(86, 28 + index * 11)),
  };
}

function normalizeSongs(items = []) {
  return uniqueById(items.map((song, index) => normalizeSong(song, index)));
}

function normalizePlaylist(playlist = {}, index = 0) {
  const id = playlist._id || playlist.id || playlist.slug || `playlist-${index + 1}`;
  const tracks = normalizeSongs(playlist.tracks || playlist.songs || playlist.musics || []);

  return {
    ...playlist,
    id,
    name: playlist.name || playlist.title || `AI Mix ${index + 1}`,
    description:
      playlist.description ||
      playlist.summary ||
      "A living mix shaped by your recent plays, saves, and skip patterns.",
    cover:
      playlist.cover ||
      playlist.thumbnail ||
      playlist.image ||
      gradientCovers[(index + 2) % gradientCovers.length],
    gradient:
      playlist.gradient ||
      fallbackPlaylists[index % fallbackPlaylists.length]?.gradient ||
      "from-pulse/70 via-plasma/70 to-aurora/70",
    saves: numberOr(playlist.saves || playlist.followers || playlist.likes, 18000 + index * 9200),
    collaborators: numberOr(playlist.collaborators || playlist.collaboratorCount, 3 + index * 4),
    trackCount: numberOr(playlist.trackCount || playlist.songsCount || tracks.length, tracks.length || 18 + index * 7),
    tracks,
  };
}

function normalizePlaylists(items = []) {
  return items.map((playlist, index) => normalizePlaylist(playlist, index)).slice(0, 8);
}

function normalizeGenres(songs = [], dashboardGenres = []) {
  const sourceGenres = [
    ...asArray(dashboardGenres),
    ...songs.flatMap((song) => [...(song.genres || []), song.mood].filter(Boolean)),
  ];
  const counts = new Map();

  sourceGenres.forEach((genre) => {
    const name = typeof genre === "string" ? genre : genre?.name || genre?.label;

    if (name) {
      counts.set(name, (counts.get(name) || 0) + numberOr(genre?.count, 1));
    }
  });

  const genres = [...counts.entries()]
    .map(([name, count], index) => ({
      id: `genre-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      name,
      count,
      match: Math.min(99, 72 + count * 4 + index * 2),
      tone: fallbackGenres[index % fallbackGenres.length].tone,
    }))
    .slice(0, 8);

  return genres.length ? genres : fallbackGenres.map((genre, index) => ({ ...genre, count: 12 + index * 5, match: 94 - index * 4 }));
}

function normalizeActivity(items = []) {
  const activity = items.length ? items : feedEvents;

  return activity.slice(0, 8).map((event, index) => ({
    id: event.id || `activity-${index + 1}`,
    user: event.user || event.actor || event.name || "BeatFlow AI",
    action: event.action || event.verb || "found a new listening pattern",
    target: event.target || event.song || event.playlist || "Personal discovery",
    time: event.time || event.createdAt || `${index + 1}m`,
  }));
}

function buildStats({ dashboard, likedSongs, playlists, genres }) {
  const stats = payloadOf(dashboard)?.stats || dashboard?.stats || {};
  const topGenre = genres[0]?.name || "AI Focus";

  return [
    {
      id: "listening-hours",
      label: "Listening hours",
      value: stats.listeningHours || stats.hours || 128,
      suffix: "h",
      change: stats.listeningHoursChange || 18,
      icon: "Headphones",
      tone: "cyan",
    },
    {
      id: "liked-songs",
      label: "Liked songs",
      value: stats.likedSongs || likedSongs.length || 342,
      change: stats.likedSongsChange || 12,
      icon: "Heart",
      tone: "pink",
    },
    {
      id: "playlists",
      label: "Total playlists",
      value: stats.totalPlaylists || playlists.length || 24,
      change: stats.playlistsChange || 7,
      icon: "ListMusic",
      tone: "green",
    },
    {
      id: "trending-genre",
      label: "Trending genre",
      value: topGenre,
      change: stats.genreChange || 23,
      icon: "Radio",
      tone: "amber",
    },
  ];
}

async function settle(request) {
  try {
    return await request();
  } catch {
    return null;
  }
}

export const userDashboardService = {
  getHomeDashboard: async () => {
    const [dashboard, explore, library, trendingResponse, recommendationResponse] = await Promise.all([
      settle(userService.getDashboard),
      settle(musicService.getExplore),
      settle(musicService.getLibrary),
      settle(musicService.getTrendingSongs),
      settle(musicService.getRecommendations),
    ]);

    const dashboardPayload = payloadOf(dashboard) || {};
    const libraryPayload = payloadOf(library) || {};
    const explorePayload = payloadOf(explore) || {};

    const fallbackSongs = normalizeSongs(mockSongs);
    const trending = normalizeSongs([
      ...firstArray(dashboardPayload, ["trending", "trendingNow", "topSongs"]),
      ...firstArray(trendingResponse, ["songs", "musics", "tracks", "trending"]),
      ...(explorePayload.trending || []),
      ...fallbackSongs,
    ]).slice(0, 12);
    const recommendations = normalizeSongs([
      ...firstArray(dashboardPayload, ["recommendations", "aiRecommendations", "recommended"]),
      ...firstArray(recommendationResponse, ["songs", "musics", "tracks", "recommendations"]),
      ...(explorePayload.recommended || []),
      ...fallbackSongs.slice().reverse(),
    ]).slice(0, 10);
    const recent = normalizeSongs([
      ...firstArray(dashboardPayload, ["recentlyPlayed", "recent", "history"]),
      ...(libraryPayload.recent || []),
      ...fallbackSongs.slice(1),
    ]).slice(0, 10);
    const continueListening = normalizeSongs([
      ...firstArray(dashboardPayload, ["continueListening", "inProgress", "saved"]),
      ...(libraryPayload.saved || []),
      ...recent,
      ...fallbackSongs,
    ]).slice(0, 10);
    const likedSongs = normalizeSongs([
      ...(libraryPayload.liked || []),
      ...firstArray(dashboardPayload, ["likedSongs", "liked"]),
    ]);
    const playlists = normalizePlaylists([
      ...firstArray(dashboardPayload, ["playlists", "yourPlaylists"]),
      ...(libraryPayload.playlists || []),
      ...fallbackPlaylists,
    ]);
    const genres = normalizeGenres(
      [...trending, ...recommendations, ...recent],
      dashboardPayload.genres || dashboardPayload.trendingGenres,
    );
    const heroTrack = normalizeSong(
      dashboardPayload.heroTrack || dashboardPayload.nowRecommended || explorePayload.heroTrack || recommendations[0] || trending[0],
    );

    return {
      profile: dashboardPayload.profile || dashboardPayload.user || null,
      hero: {
        track: heroTrack,
        mood: dashboardPayload.heroMood || heroTrack.mood || "Electric focus",
        reason:
          dashboardPayload.heroReason ||
          "Your AI discovered a high-affinity signal from tonight's listening behavior.",
        matchScore: numberOr(dashboardPayload.heroMatch || heroTrack.matchScore, 96),
        activeListeners: numberOr(dashboardPayload.activeListeners || heroTrack.plays / 120, 11824),
      },
      stats: buildStats({ dashboard: dashboardPayload, likedSongs, playlists, genres }),
      analytics: dashboardPayload.analytics || dashboardPayload.listeningAnalytics || analyticsSeries,
      continueListening,
      trending,
      recentlyPlayed: recent,
      playlists,
      recommendations,
      liveActivity: normalizeActivity(dashboardPayload.liveActivity || dashboardPayload.activity),
      friendsOnline: dashboardPayload.friendsOnline || fallbackFriends,
      genres,
    };
  },
};
