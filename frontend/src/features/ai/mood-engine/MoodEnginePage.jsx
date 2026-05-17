import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { SlidersHorizontal, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/common/GlassPanel";
import { PageHeader } from "@/components/common/PageHeader";
import { SongCard } from "@/features/music/components/SongCard";
import { aiService } from "@/features/ai/services/ai.service";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function MoodEnginePage() {
  useDocumentTitle("Mood Engine", "Mood-based AI recommendation tuning.");
  const [mood, setMood] = useState({ energy: 82, focus: 72, novelty: 64 });
  const mutation = useMutation({ mutationFn: aiService.generateMood });

  const generatedSongs = mutation.data?.songs || [];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Mood engine"
        title="Shape the next recommendation wave"
        description="Tune energy, focus, and novelty into an adaptive AI playlist."
        action={
          <Button variant="neon" onClick={() => mutation.mutate(mood)}>
            <WandSparkles className="size-5" />
            Generate
          </Button>
        }
      />
      <GlassPanel className="p-6">
        <div className="mb-6 flex items-center gap-3">
          <SlidersHorizontal className="size-6 text-pulse" />
          <h2 className="font-display text-xl font-semibold text-white">Mood controls</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {Object.entries(mood).map(([key, value]) => (
            <label key={key} className="space-y-3 rounded-md border border-white/10 bg-white/[0.04] p-4">
              <div className="flex items-center justify-between">
                <span className="capitalize text-sm font-semibold text-white">{key}</span>
                <span className="text-sm text-pulse">{value}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={value}
                onChange={(event) => setMood((current) => ({ ...current, [key]: Number(event.target.value) }))}
                className="w-full accent-pulse"
              />
            </label>
          ))}
        </div>
      </GlassPanel>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {(generatedSongs.length ? generatedSongs : mutation.isPending ? [] : []).map((song) => (
          <SongCard key={song.id} song={song} compact />
        ))}
      </section>
      {mutation.isPending ? <GlassPanel className="p-6 text-center text-pulse">Generating recommendation graph...</GlassPanel> : null}
    </div>
  );
}
