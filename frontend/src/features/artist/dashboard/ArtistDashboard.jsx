import { useQuery } from "@tanstack/react-query";
import { MetricAreaChart } from "@/components/charts/MetricAreaChart";
import { DonutChart } from "@/components/charts/DonutChart";
import { GlassPanel } from "@/components/common/GlassPanel";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { SuspenseFallback } from "@/components/common/SuspenseFallback";
import { Progress } from "@/components/ui/progress";
import { AlbumStudio } from "@/features/artist/albums/AlbumStudio";
import { artistService } from "@/features/artist/services/artist.service";
import { SongManagement } from "@/features/artist/songs/SongManagement";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function ArtistDashboard() {
  useDocumentTitle("Artist Hub", "Artist analytics, revenue, songs, and processing status.");
  const { data, isLoading } = useQuery({ queryKey: ["artist-dashboard"], queryFn: artistService.getDashboard });

  if (isLoading) {
    return <SuspenseFallback />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Phase 4"
        title="Artist command center"
        description="Upload operations, audio processing, audience insight, stream analytics, revenue UI, and catalog controls."
      />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.metrics.map((metric) => (
          <StatCard key={metric.label} {...metric} />
        ))}
      </section>
      <section className="grid gap-6 xl:grid-cols-[1.3fr_.7fr]">
        <GlassPanel className="p-5">
          <h2 className="mb-4 font-display text-xl font-semibold text-white">Streams and saves</h2>
          <MetricAreaChart data={data.series} />
        </GlassPanel>
        <GlassPanel className="p-5">
          <h2 className="mb-4 font-display text-xl font-semibold text-white">Audience insight</h2>
          <DonutChart data={data.audience} />
        </GlassPanel>
      </section>
      <section className="grid gap-6 xl:grid-cols-[1fr_.8fr]">
        <GlassPanel className="p-5">
          <h2 className="mb-4 font-display text-xl font-semibold text-white">Song management</h2>
          <SongManagement songs={data.songs} />
        </GlassPanel>
        <div className="space-y-4">
          <AlbumStudio />
          <GlassPanel className="p-5">
            <h2 className="font-display text-xl font-semibold text-white">Processing status</h2>
            <div className="mt-4 space-y-4">
              {data.processing.map((job) => (
                <div key={job.id}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-semibold text-white">{job.title}</span>
                    <span className="text-muted-foreground">{job.state}</span>
                  </div>
                  <Progress value={job.progress} />
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
      </section>
    </div>
  );
}
