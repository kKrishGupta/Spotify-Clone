import { Disc3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GlassPanel } from "@/components/common/GlassPanel";

export function AlbumStudio() {
  const albums = [
    { id: "alb-1", title: "Signal Bloom", status: "Release ready", progress: 92 },
    { id: "alb-2", title: "Club Monsoon", status: "Mastering", progress: 68 },
    { id: "alb-3", title: "Quiet Algorithms", status: "Draft", progress: 44 },
  ];

  return (
    <GlassPanel className="p-5">
      <div className="mb-4 flex items-center gap-3">
        <Disc3 className="size-6 text-aurora" />
        <h2 className="font-display text-xl font-semibold text-white">Album studio</h2>
      </div>
      <div className="space-y-3">
        {albums.map((album) => (
          <div key={album.id} className="rounded-md border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-white">{album.title}</p>
              <Badge variant="cyan">{album.status}</Badge>
            </div>
            <div className="mt-3 h-2 rounded-full bg-white/10">
              <div className="h-full rounded-full bg-premium-line" style={{ width: `${album.progress}%` }} />
            </div>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}
