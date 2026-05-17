import { AudioVisualizer } from "@/features/streaming/visualizer/AudioVisualizer";
import { PageHeader } from "@/components/common/PageHeader";
import { GlassPanel } from "@/components/common/GlassPanel";
import { LiveWaveform } from "@/components/streaming/LiveWaveform";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function StreamingPage() {
  useDocumentTitle("Streaming", "HLS waveform and buffering monitoring.");

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Streaming"
        title="Realtime streaming lab"
        description="HLS readiness, waveform rendering, visualizers, buffering telemetry, and playback quality surfaces."
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_.8fr]">
        <AudioVisualizer active title="Live visualizer" />
        <GlassPanel className="p-5">
          <h2 className="mb-4 font-display text-xl font-semibold text-white">Waveform monitor</h2>
          <LiveWaveform />
        </GlassPanel>
      </div>
    </div>
  );
}
