import { motion } from "framer-motion";
import { ArrowUpRight, BrainCircuit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MagneticPanel,
  SectionHeading,
} from "@/features/home/components/LandingShared";
import { childReveal, staggerReveal } from "@/features/home/components/landingMotion";
import { aiFeatures } from "@/features/home/data/landing.data";

export function AIFeaturesSection() {
  return (
    <section id="ai" className="relative border-y border-white/10 bg-black/20 py-20">
      <div className="landing-section-sheen absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="AI features"
          title="Intelligence woven into every playback decision."
          description="BeatFlow AI turns search, playlists, recommendations, and social listening into a single adaptive system."
          align="center"
        />

        <motion.div {...staggerReveal} className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {aiFeatures.map((feature, index) => (
            <MagneticPanel key={feature.title} featured={index === 1} className="group min-h-72 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="rounded-md border border-white/10 bg-white/10 p-3 text-pulse">
                  <feature.icon className="size-6" />
                </div>
                <Badge variant={index === 1 ? "green" : "cyan"}>{feature.metric}</Badge>
              </div>
              <h3 className="mt-8 font-display text-2xl font-semibold text-white">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{feature.description}</p>
              <Button variant="ghost" className="mt-8 px-0 text-white hover:bg-transparent">
                Learn more
                <ArrowUpRight className="size-4" />
              </Button>
            </MagneticPanel>
          ))}
        </motion.div>

        <motion.div
          {...childReveal}
          className="mt-8 grid gap-4 rounded-lg border border-white/10 bg-white/[0.045] p-5 shadow-card backdrop-blur-2xl lg:grid-cols-[.8fr_1.2fr]"
        >
          <div>
            <Badge variant="pink">
              <BrainCircuit className="size-3" />
              Taste vector
            </Badge>
            <h3 className="mt-4 font-display text-3xl font-semibold text-white">A recommendation graph you can see.</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Live clusters show mood, genre, tempo, and social affinity so AI recommendations feel transparent.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {["Mood", "Tempo", "Genre", "Social", "Skips", "Saves", "Rooms", "Lyrics"].map((label, index) => (
              <motion.div
                key={label}
                animate={{ opacity: [0.72, 1, 0.72], y: [0, -4, 0] }}
                transition={{ duration: 2.6 + index * 0.12, repeat: Infinity, ease: "easeInOut" }}
                className="rounded-lg border border-white/10 bg-white/[0.055] p-4 text-center"
              >
                <p className="font-display text-lg font-semibold text-white">{label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{80 + index * 2}% signal</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
