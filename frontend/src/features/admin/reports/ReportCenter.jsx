import { useQuery } from "@tanstack/react-query";
import { FileWarning } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { GlassPanel } from "@/components/common/GlassPanel";
import { SuspenseFallback } from "@/components/common/SuspenseFallback";
import { Badge } from "@/components/ui/badge";
import { adminService } from "@/features/admin/services/admin.service";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function ReportCenter() {
  useDocumentTitle("Report Center", "Admin report management and trust operations.");
  const { data, isLoading } = useQuery({ queryKey: ["admin-reports"], queryFn: adminService.getDashboard });

  if (isLoading) {
    return <SuspenseFallback />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Reports"
        title="Report management"
        description="Centralized trust reports with severity scoring and operator-ready context."
      />
      <div className="grid gap-4">
        {data.moderationQueue.map((item) => (
          <GlassPanel key={item.id} className="p-5">
            <div className="flex items-center gap-4">
              <div className="rounded-md bg-ember/10 p-3 text-ember">
                <FileWarning className="size-6" />
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold text-white">{item.song}</h2>
                <p className="text-sm text-muted-foreground">{item.risk}</p>
              </div>
              <Badge className="ml-auto" variant="amber">
                {item.score} risk score
              </Badge>
            </div>
          </GlassPanel>
        ))}
      </div>
    </div>
  );
}
