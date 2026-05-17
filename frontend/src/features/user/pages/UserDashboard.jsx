import { motion } from "framer-motion";
import { ActivityTicker } from "@/components/feed/ActivityTicker";
import { MetricAreaChart } from "@/components/charts/MetricAreaChart";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { SuspenseFallback } from "@/components/common/SuspenseFallback";
import { GlassPanel } from "@/components/common/GlassPanel";
import { Button } from "@/components/ui/button";
import { ReleaseRail } from "@/features/music/components/ReleaseRail";
import { SongCard } from "@/features/music/components/SongCard";
import { ListeningPulse } from "@/features/user/components/ListeningPulse";
import { useUserDashboard } from "@/features/user/hooks/useUserDashboard";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { stagger } from "@/lib/motion";

export default function UserDashboard() {
  useDocumentTitle("Home", "Personalized realtime music dashboard.");
  const { data, isLoading } = useUserDashboard();

  if (isLoading) {
    return <SuspenseFallback />;
  }

  return (
    <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-6">
      <PageHeader
        eyebrow="Phase 3"
        title="Your listening cockpit"
        description="Recently played, AI recommendations, activity, and listening analytics converge into one realtime surface."
        action={<Button variant="neon">Start AI radio</Button>}
      />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.stats.map((metric) => (
          <StatCard key={metric.label} {...metric} />
        ))}
      </section>
      <section className="grid gap-6 xl:grid-cols-[1.3fr_.7fr]">
        <GlassPanel className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-white">Listening analytics</h2>
            <span className="text-sm text-muted-foreground">Realtime blend</span>
          </div>
          <MetricAreaChart data={data.analytics} />
        </GlassPanel>
        <div className="space-y-4">
          <ListeningPulse minutes={72} goal={90} />
          <GlassPanel className="p-5">
            <h2 className="font-display text-xl font-semibold text-white">Live activity</h2>
            <div className="mt-4">
              <ActivityTicker />
            </div>
          </GlassPanel>
        </div>
      </section>
      <ReleaseRail title="AI recommendations" songs={data.recommendations} />
      <section className="grid gap-4 lg:grid-cols-3">
        {data.recentlyPlayed.slice(0, 3).map((song) => (
          <SongCard key={song.id} song={song} compact />
        ))}
      </section>
    </motion.div>
  );
}
