import { Headphones, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassPanel } from "@/components/common/GlassPanel";
import { PageHeader } from "@/components/common/PageHeader";
import { SuspenseFallback } from "@/components/common/SuspenseFallback";
import { ReleaseRail } from "@/features/music/components/ReleaseRail";
import { useExploreData } from "@/features/music/hooks/useMusicData";
import { usePlayerStore } from "@/features/music/store/player.store";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { formatNumber } from "@/utils/format";

export default function ExplorePage() {
  useDocumentTitle("Explore", "Discover trending music, AI rooms, and editorial playlists.");
  const { data, isLoading } = useExploreData();
  const playTrack = usePlayerStore((state) => state.playTrack);

  if (isLoading) {
    return <SuspenseFallback />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Discovery"
        title="Explore the living catalog"
        description="A dynamic blend of trending songs, live rooms, and AI editorial context."
      />
      <GlassPanel className="overflow-hidden">
        <div className="grid gap-0 lg:grid-cols-[.9fr_1.1fr]">
          <div className="min-h-80" style={{
            backgroundImage: `url(${
              data?.heroTrack?.thumbnail ||
              data?.heroTrack?.cover
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }} />
          <div className="flex flex-col justify-center p-6 md:p-10">
            <Badge variant="pink">Top neural match</Badge>
            <h2 className="mt-4 font-display text-4xl font-semibold text-white md:text-6xl">{data.heroTrack.title}</h2>
            <p className="mt-3 text-lg text-muted-foreground">{data.heroTrack.artist}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Badge variant="cyan">{formatNumber(data.heroTrack.plays)} plays</Badge>
              <Badge>{data.heroTrack.bpm} BPM</Badge>
              <Badge variant="green">{data.heroTrack.energy}% energy</Badge>
            </div>
            <Button className="mt-8 w-fit" variant="neon" size="lg" onClick={() => playTrack(data.heroTrack,data.trending, [data.heroTrack])}>
              <Headphones className="size-5" />
              Play now
            </Button>
          </div>
        </div>
      </GlassPanel>
      <ReleaseRail title="Trending in AI discovery" songs={data.trending} />
      <section className="grid gap-4 lg:grid-cols-3">
        {data.liveRooms.map((room) => (
          <GlassPanel key={room.id} className="p-5">
            <Radio className="size-6 text-pulse" />
            <h3 className="mt-4 font-display text-xl font-semibold text-white">{room.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">Hosted by {room.host}</p>
            <Badge className="mt-4" variant="green">
              {formatNumber(room.listeners)} listening
            </Badge>
          </GlassPanel>
        ))}
      </section>
    </div>
  );
}
