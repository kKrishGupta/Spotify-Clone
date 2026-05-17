import { useQuery } from "@tanstack/react-query";
import { DonutChart } from "@/components/charts/DonutChart";
import { MetricAreaChart } from "@/components/charts/MetricAreaChart";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { SuspenseFallback } from "@/components/common/SuspenseFallback";
import { GlassPanel } from "@/components/common/GlassPanel";
import { RealtimeBars } from "@/features/analytics/charts/RealtimeBars";
import { analyticsService } from "@/features/analytics/services/analytics.service";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function AnalyticsDashboard() {
  useDocumentTitle("Analytics", "Realtime platform and creator analytics.");
  const { data, isLoading } = useQuery({ queryKey: ["analytics-dashboard"], queryFn: analyticsService.getDashboard });

  if (isLoading) {
    return <SuspenseFallback />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Phase 9"
        title="Realtime analytics suite"
        description="Platform charts, engagement graphs, audience segments, heatmaps, and performance cards."
      />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.metrics.map((metric) => (
          <StatCard key={metric.label} {...metric} />
        ))}
      </section>
      <section className="grid gap-6 xl:grid-cols-[1.4fr_.6fr]">
        <GlassPanel className="p-5">
          <h2 className="mb-4 font-display text-xl font-semibold text-white">Engagement graph</h2>
          <MetricAreaChart data={data.series} />
        </GlassPanel>
        <GlassPanel className="p-5">
          <h2 className="mb-4 font-display text-xl font-semibold text-white">Audience mix</h2>
          <DonutChart data={data.audience} />
        </GlassPanel>
      </section>
      <section className="grid gap-6 xl:grid-cols-[.8fr_1.2fr]">
        <GlassPanel className="p-5">
          <h2 className="mb-4 font-display text-xl font-semibold text-white">Realtime bars</h2>
          <RealtimeBars data={data.series} />
        </GlassPanel>
        <GlassPanel className="p-5">
          <h2 className="mb-4 font-display text-xl font-semibold text-white">Listening heatmap</h2>
          <div className="grid gap-2">
            {data.heatmap.map((row) => (
              <div key={row[0]} className="grid grid-cols-[44px_repeat(7,1fr)] gap-2">
                <span className="text-xs text-muted-foreground">{row[0]}</span>
                {row.slice(1).map((value, index) => (
                  <div
                    key={`${row[0]}-${index}`}
                    className="h-9 rounded"
                    style={{ background: `rgba(0, 229, 255, ${Math.min(0.85, value / 240)})` }}
                  />
                ))}
              </div>
            ))}
          </div>
        </GlassPanel>
      </section>
    </div>
  );
}
