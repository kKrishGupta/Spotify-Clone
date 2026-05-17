import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassPanel } from "@/components/common/GlassPanel";
import { PageHeader } from "@/components/common/PageHeader";
import { SuspenseFallback } from "@/components/common/SuspenseFallback";
import { adminService } from "@/features/admin/services/admin.service";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function ModerationQueue() {
  useDocumentTitle("Moderation", "Moderation queue and song approval workflow.");
  const { data, isLoading } = useQuery({ queryKey: ["admin-dashboard"], queryFn: adminService.getDashboard });

  if (isLoading) {
    return <SuspenseFallback />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Trust"
        title="Moderation queue"
        description="Song approval, policy checks, report triage, and AI-assisted risk scoring."
      />
      <div className="grid gap-4">
        {data.moderationQueue.map((item) => (
          <GlassPanel key={item.id} className="p-5">
            <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-xl font-semibold text-white">{item.song}</h2>
                  <Badge variant="amber">{item.risk}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.artist} - {item.status}
                </p>
                <div className="mt-4 h-2 rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-ember to-aurora" style={{ width: `${item.score}%` }} />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => adminService.resolveModeration(item.id, "reject")}>
                  <XCircle className="size-4" />
                  Reject
                </Button>
                <Button variant="neon" onClick={() => adminService.resolveModeration(item.id, "approve")}>
                  <CheckCircle2 className="size-4" />
                  Approve
                </Button>
              </div>
            </div>
          </GlassPanel>
        ))}
      </div>
    </div>
  );
}
