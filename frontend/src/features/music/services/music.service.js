import { mockSongs, playlists } from "@/config/constants";
import { simulateNetwork } from "@/services/mockData.service";

export const musicService = {
  getExplore: () =>
    simulateNetwork({
      heroTrack: mockSongs[0],
      trending: mockSongs,
      editorial: playlists,
      liveRooms: [
        { id: "room-1", name: "Late Night AI Jam", listeners: 1284, host: "Maya Flux" },
        { id: "room-2", name: "Focus Pairing Lab", listeners: 842, host: "BeatFlow Curator" },
        { id: "room-3", name: "Indie Upload Radar", listeners: 516, host: "Nira Coast" },
      ],
    }),
  getLibrary: () =>
    simulateNetwork({
      saved: mockSongs.slice(0, 4),
      downloads: mockSongs.slice(2, 6),
      playlists,
      smartCollections: ["Repeat signals", "High save probability", "Low skip comfort", "Regional discovery"],
    }),
};
