import { useQuery } from "@tanstack/react-query";
import { DonutChart } from "@/components/charts/DonutChart";
import { MetricAreaChart } from "@/components/charts/MetricAreaChart";
import { GlassPanel } from "@/components/common/GlassPanel";
import { PageHeader } from "@/components/common/PageHeader";
import { SuspenseFallback } from "@/components/common/SuspenseFallback";
import { artistService } from "@/features/artist/services/artist.service";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function ArtistAnalytics() {
  useDocumentTitle("Artist Analytics", "Audience and stream analytics for artists.");
  const { data, isLoading } = useQuery({ queryKey: ["artist-analytics"], queryFn: artistService.getDashboard });

  if (isLoading) {
    return <SuspenseFallback />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Audience"
        title="Artist audience intelligence"
        description="Streams, saves, retention, audience segments, and revenue-adjacent insight for creator teams."
      />
      <div className="grid gap-6 xl:grid-cols-[1.3fr_.7fr]">
        <GlassPanel className="p-5">
          <h2 className="mb-4 font-display text-xl font-semibold text-white">Weekly stream momentum</h2>
          <MetricAreaChart data={data.series} />
        </GlassPanel>
        <GlassPanel className="p-5">
          <h2 className="mb-4 font-display text-xl font-semibold text-white">Audience segments</h2>
          <DonutChart data={data.audience} />
        </GlassPanel>
      </div>
    </div>
  );
}
