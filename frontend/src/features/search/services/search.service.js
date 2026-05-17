import { aiPrompts, mockSongs, playlists } from "@/config/constants";
import { simulateNetwork } from "@/services/mockData.service";

export const searchService = {
  semanticSearch: (query) => {
    const lowered = query.toLowerCase();
    const songs = mockSongs.filter((song) =>
      [song.title, song.artist, song.album, song.mood].join(" ").toLowerCase().includes(lowered),
    );

    return simulateNetwork({
      query,
      songs: songs.length ? songs : mockSongs.slice(0, 4),
      playlists,
      suggestions: aiPrompts,
      semanticScore: Math.max(72, Math.min(99, 82 + query.length)),
    });
  },
};
