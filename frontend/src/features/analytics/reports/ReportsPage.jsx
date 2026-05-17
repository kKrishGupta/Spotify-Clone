import { FileText } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { GlassPanel } from "@/components/common/GlassPanel";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const reports = [
  { id: "rep-1", name: "Weekly listener intelligence", cadence: "Mondays", owner: "Growth" },
  { id: "rep-2", name: "Creator revenue forecast", cadence: "Daily", owner: "Finance" },
  { id: "rep-3", name: "Moderation quality review", cadence: "Fridays", owner: "Trust" },
];

export default function ReportsPage() {
  useDocumentTitle("Reports", "Scheduled AI analytics reports.");

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Reports"
        title="Executive reporting"
        description="Scheduled analytics packets for revenue, trust, catalog quality, and product health."
      />
      <section className="grid gap-4 md:grid-cols-3">
        {reports.map((report) => (
          <GlassPanel key={report.id} className="p-5">
            <FileText className="size-6 text-pulse" />
            <h2 className="mt-4 font-display text-xl font-semibold text-white">{report.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{report.owner} team</p>
            <p className="mt-4 text-sm font-semibold text-pulse">{report.cadence}</p>
          </GlassPanel>
        ))}
      </section>
    </div>
  );
}
