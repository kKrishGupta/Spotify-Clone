import { useQuery } from "@tanstack/react-query";
import { UsersRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GlassPanel } from "@/components/common/GlassPanel";
import { PageHeader } from "@/components/common/PageHeader";
import { SuspenseFallback } from "@/components/common/SuspenseFallback";
import { socialService } from "@/features/social/services/social.service";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function FollowersPage() {
  useDocumentTitle("Social", "Followers and music affinity network.");
  const { data, isLoading } = useQuery({ queryKey: ["social-network"], queryFn: socialService.getNetwork });

  if (isLoading) {
    return <SuspenseFallback />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Social"
        title="Affinity network"
        description="Followers, artist profiles, online presence, and listening affinity signals."
      />
      <section className="grid gap-4 md:grid-cols-3">
        {data.followers.map((follower) => (
          <GlassPanel key={follower.id} className="p-5">
            <UsersRound className="size-6 text-pulse" />
            <h2 className="mt-4 font-display text-xl font-semibold text-white">{follower.name}</h2>
            <p className="text-sm text-muted-foreground">{follower.status}</p>
            <Badge className="mt-4" variant="green">
              {follower.affinity}% affinity
            </Badge>
          </GlassPanel>
        ))}
      </section>
    </div>
  );
}
