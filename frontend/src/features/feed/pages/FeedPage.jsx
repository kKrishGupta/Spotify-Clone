import { FeedComposer } from "@/features/feed/components/FeedComposer";
import { RealtimeFeed } from "@/features/feed/realtime/RealtimeFeed";
import { PresenceGrid } from "@/features/social/presence/PresenceGrid";
import { PageHeader } from "@/components/common/PageHeader";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function FeedPage() {
  useDocumentTitle("Live Feed", "Realtime music activity feed.");

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Phase 7"
        title="Realtime social feed"
        description="Live notifications, activity, presence, likes, plays, and collaborative updates."
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <div className="space-y-4">
          <FeedComposer />
          <RealtimeFeed />
        </div>
        <PresenceGrid />
      </div>
    </div>
  );
}
