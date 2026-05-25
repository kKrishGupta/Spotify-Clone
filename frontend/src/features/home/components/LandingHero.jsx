import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlbumArtwork } from "@/features/home/components/LandingShared";
import { childReveal, reveal, staggerReveal } from "@/features/home/components/landingMotion";
import { heroStats, heroTracks, trustSignals } from "@/features/home/data/landing.data";

function HeroVisualizer() {
  return (
    <div className="flex h-20 items-end gap-1.5">
      {Array.from({ length: 34 }).map((_, index) => (
        <motion.span
          key={index}
          className="w-full rounded-full bg-premium-line"
          animate={{ scaleY: [0.22, 1, 0.34] }}
          transition={{
            duration: 0.95 + (index % 8) * 0.05,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.025,
          }}
          style={{ transformOrigin: "bottom" }}
        />
      ))}
    </div>
  );
}

export function LandingHero() {
  return (
    <section id="hero" className="relative overflow-hidden">
      <div className="landing-hero-field absolute inset-0" />
      <div className="noise-layer pointer-events-none absolute inset-0 opacity-45" />
      <div className="relative mx-auto grid min-h-[82vh] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_470px] lg:px-8 lg:py-20">
        <motion.div {...reveal} className="max-w-4xl">
          <Badge variant="cyan" className="mb-5">
            <Sparkles className="size-3" />
            AI-native music streaming
          </Badge>
          <h1 className="font-display text-5xl font-semibold leading-[1.02] text-white md:text-7xl xl:text-8xl">
            BeatFlow AI
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72 md:text-xl">
            A next-generation Spotify experience powered by semantic search, mood intelligence, live listening rooms,
            and adaptive playlists that understand how you actually feel.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="neon" size="lg" className="rounded-full">
              <Link to="/register">
                <Play className="size-5 fill-current" />
                Start Listening
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <a href="#discovery">
                Explore AI Music
                <ArrowRight className="size-5" />
              </a>
            </Button>
          </div>

          <motion.div {...staggerReveal} className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
            {heroStats.map((stat) => (
              <motion.div key={stat.label} {...childReveal} className="glass-soft rounded-lg p-4">
                <p className="font-display text-3xl font-semibold text-white">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-8 flex flex-wrap gap-2">
            {trustSignals.map((signal) => (
              <Badge key={signal.label} variant="default">
                <signal.icon className="size-3" />
                {signal.label}
              </Badge>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 28, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.65, ease: "easeOut", delay: 0.12 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-premium-line opacity-20 blur-3xl" />
          <div className="relative overflow-hidden rounded-lg border border-white/10 bg-black/35 p-4 shadow-card backdrop-blur-2xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-pulse">Now discovering</p>
                <h2 className="mt-2 font-display text-2xl font-semibold text-white">Realtime AI Radio</h2>
              </div>
              <Button variant="neon" size="icon" className="rounded-full">
                <Play className="size-5 fill-current" />
              </Button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_.85fr]">
              <AlbumArtwork gradient={heroTracks[0].cover} title={heroTracks[0].title} className="aspect-square">
                <div>
                  <p className="font-display text-xl font-semibold text-white">{heroTracks[0].title}</p>
                  <p className="text-sm text-white/70">{heroTracks[0].artist}</p>
                </div>
              </AlbumArtwork>

              <div className="space-y-3">
                {heroTracks.map((track) => (
                  <div key={track.id} className="rounded-lg border border-white/10 bg-white/[0.055] p-3">
                    <div className="flex items-center gap-3">
                      <span className={`size-12 rounded-md bg-gradient-to-br ${track.cover}`} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-white">{track.title}</p>
                        <p className="truncate text-xs text-muted-foreground">{track.mood}</p>
                      </div>
                      <Badge variant="green">{track.match}%</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <div className="mb-3 flex items-center justify-between text-xs font-semibold text-muted-foreground">
                <span>Adaptive waveform</span>
                <span>Live</span>
              </div>
              <HeroVisualizer />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
