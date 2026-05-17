import { aiPrompts, mockSongs, playlists } from "@/config/constants";
import { simulateNetwork } from "@/services/mockData.service";

export const aiService = {
  getAssistantState: () =>
    simulateNetwork({
      prompts: aiPrompts,
      insights: [
        { title: "Taste vector", value: "Synth pop + Indian indie", confidence: 94 },
        { title: "Energy curve", value: "Warm-up to peak", confidence: 88 },
        { title: "Skip risk", value: "Low after track 3", confidence: 82 },
      ],
      recommendations: mockSongs.slice(0, 4),
    }),
  generateMood: (mood) =>
    simulateNetwork({
      mood,
      playlist: playlists[0],
      songs: mockSongs
        .slice()
        .sort((a, b) => Math.abs(b.energy - mood.energy) - Math.abs(a.energy - mood.energy))
        .slice(0, 4),
    }),
};
