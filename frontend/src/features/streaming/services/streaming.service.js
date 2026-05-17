import { mockSongs } from "@/config/constants";
import { simulateNetwork } from "@/services/mockData.service";

export const streamingService = {
  getStreamManifest: (songId) => {
    const song = mockSongs.find((item) => item.id === songId) || mockSongs[0];
    return simulateNetwork({
      songId,
      hlsUrl: song.hlsUrl,
      variants: ["64k", "128k", "320k"],
      waveform: Array.from({ length: 80 }, (_, index) => 20 + ((index * 13) % 70)),
    });
  },
};
