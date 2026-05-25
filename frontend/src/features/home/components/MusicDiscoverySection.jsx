import { motion } from "framer-motion";
import { ChevronRight, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MusicCard,
  SectionHeading,
} from "@/features/home/components/LandingShared";
import { childReveal, staggerReveal } from "@/features/home/components/landingMotion";
import { discoveryRails, genreCollections } from "@/features/home/data/landing.data";
import { cn } from "@/lib/utils";

function DiscoveryRail({ rail }) {
  return (
    <motion.div {...staggerReveal} className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <Badge variant="cyan">{rail.eyebrow}</Badge>
          <h3 className="mt-3 font-display text-2xl font-semibold text-white">{rail.title}</h3>
        </div>
        <Button variant="ghost" className="hidden sm:inline-flex">
          See all
          <ChevronRight className="size-4" />
        </Button>
      </div>
      <div className="scrollbar-premium grid auto-cols-max grid-flow-col gap-4 overflow-x-auto pb-3">
        {rail.items.map((item, index) => (
          <MusicCard key={item.id} item={item} index={index} large={rail.id === "moods"} />
        ))}
      </div>
    </motion.div>
  );
}

export function MusicDiscoverySection() {
  return (
    <section id="discovery" className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Music discovery"
        title="A Spotify-scale catalog that reacts like an AI OS."
        description="Browse trending tracks, mood-built playlists, top artists, genre collections, and recent signals in dense horizontal rails made for fast discovery."
      />

      <div className="mt-12 space-y-12">
        {discoveryRails.map((rail) => (
          <DiscoveryRail key={rail.id} rail={rail} />
        ))}
      </div>

      <motion.div {...staggerReveal} className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {genreCollections.map((genre) => (
          <motion.button
            key={genre.label}
            type="button"
            {...childReveal}
            whileHover={{ y: -6, scale: 1.012 }}
            className="group relative min-h-44 overflow-hidden rounded-lg border border-white/10 bg-white/[0.045] p-5 text-left shadow-soft transition hover:bg-white/[0.075]"
          >
            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-35 transition group-hover:opacity-55", genre.gradient)} />
            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-md border border-white/10 bg-black/30 p-3 text-white">
                  <genre.icon className="size-6" />
                </span>
                <Button variant="neon" size="icon" className="size-9 rounded-full opacity-0 transition group-hover:opacity-100">
                  <Play className="size-4 fill-current" />
                </Button>
              </div>
              <div>
                <h3 className="font-display text-2xl font-semibold text-white">{genre.label}</h3>
                <p className="mt-2 text-sm text-white/68">Fresh collections tuned by live listening behavior.</p>
              </div>
            </div>
          </motion.button>
        ))}
      </motion.div>
    </section>
  );
}
