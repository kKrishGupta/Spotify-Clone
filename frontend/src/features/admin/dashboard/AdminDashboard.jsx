import { useQuery } from "@tanstack/react-query";
import { MetricAreaChart } from "@/components/charts/MetricAreaChart";
import { GlassPanel } from "@/components/common/GlassPanel";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { SuspenseFallback } from "@/components/common/SuspenseFallback";
import { Badge } from "@/components/ui/badge";
import { adminService } from "@/features/admin/services/admin.service";
import { UserOps } from "@/features/admin/users/UserOps";
import { RealtimeAnalytics } from "@/features/analytics/realtime/RealtimeAnalytics";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function AdminDashboard() {
  useDocumentTitle("Admin Core", "Admin platform metrics and realtime monitoring.");
  const { data, isLoading } = useQuery({ queryKey: ["admin-dashboard"], queryFn: adminService.getDashboard });

  if (isLoading) {
    return <SuspenseFallback />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Phase 5"
        title="Platform operations"
        description="Moderation, reports, song approvals, user management, platform analytics, and realtime health monitoring."
      />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.metrics.map((metric) => (
          <StatCard key={metric.label} {...metric} />
        ))}
      </section>
      <section className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
        <GlassPanel className="p-5">
          <h2 className="mb-4 font-display text-xl font-semibold text-white">Platform stream health</h2>
          <MetricAreaChart data={data.series} />
        </GlassPanel>
        <GlassPanel className="p-5">
          <h2 className="mb-4 font-display text-xl font-semibold text-white">Incident monitor</h2>
          <div className="space-y-3">
            {data.incidents.map((incident) => (
              <div key={incident.id} className="rounded-md border border-white/10 bg-white/[0.04] p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-white">{incident.title}</p>
                  <Badge variant={incident.severity === "high" ? "amber" : "cyan"}>{incident.value}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{incident.severity} severity</p>
              </div>
            ))}
          </div>
        </GlassPanel>
      </section>
      <section className="grid gap-6 xl:grid-cols-[.8fr_1.2fr]">
        <GlassPanel className="p-5">
          <h2 className="mb-4 font-display text-xl font-semibold text-white">User management</h2>
          <UserOps />
        </GlassPanel>
        <RealtimeAnalytics />
      </section>
    </div>
  );
}
