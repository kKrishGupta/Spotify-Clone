import { analyticsSeries, audienceSegments, mockSongs } from "@/config/constants";
import { simulateNetwork } from "@/services/mockData.service";

export const artistService = {
  getDashboard: () =>
    simulateNetwork({
      metrics: [
        { label: "Monthly streams", value: 2840000, change: 21, icon: "Headphones" },
        { label: "Saves", value: 184200, change: 18, icon: "Heart" },
        { label: "Revenue", value: 48200, change: 14, icon: "BadgeDollarSign" },
        { label: "Audience reach", value: 920000, change: 27, icon: "UsersRound" },
      ],
      songs: mockSongs.slice(0, 5),
      series: analyticsSeries,
      audience: audienceSegments,
      processing: [
        { id: "job-1", title: "Spatial master", progress: 86, state: "Encoding 320k HLS" },
        { id: "job-2", title: "Waveform extraction", progress: 64, state: "Generating peaks" },
        { id: "job-3", title: "AI metadata scan", progress: 92, state: "Ready for approval" },
      ],
    }),
  uploadSong: (payload) => simulateNetwork({ ...payload, id: crypto.randomUUID(), status: "processing" }, 700),
};
