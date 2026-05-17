import { FullPlayer } from "@/components/player/FullPlayer";
import { PageHeader } from "@/components/common/PageHeader";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function MusicPlayerPage() {
  useDocumentTitle("Player", "HLS playback, queue, lyrics, and realtime audio controls.");

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Phase 6"
        title="Music player engine"
        description="A full playback cockpit with queue, synced lyrics, HLS stream awareness, visualizer, speed, volume, and seek control."
      />
      <FullPlayer />
    </div>
  );
}
