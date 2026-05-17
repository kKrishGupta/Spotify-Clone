import { analyticsSeries, feedEvents, mockSongs, platformMetrics, playlists } from "@/config/constants";
import { simulateNetwork } from "@/services/mockData.service";

export const userService = {
  getDashboard: () =>
    simulateNetwork({
      stats: [
        { label: "Minutes streamed", value: 18420, change: 16, icon: "Clock3" },
        { label: "Liked songs", value: 842, change: 9, icon: "Heart" },
        { label: "AI discoveries", value: 128, change: 24, icon: "Sparkles" },
        { label: "Listening streak", value: 42, change: 7, icon: "Flame", suffix: "d" },
      ],
      recentlyPlayed: mockSongs.slice(0, 5),
      likedSongs: mockSongs.slice(1, 6),
      recommendations: mockSongs,
      playlists,
      activity: feedEvents,
      analytics: analyticsSeries,
      platformMetrics,
    }),
};
