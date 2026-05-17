import { motion } from "framer-motion";
import { Activity, AudioWaveform, BrainCircuit, ShieldCheck } from "lucide-react";
import { Outlet } from "react-router-dom";

const metrics = [
  { label: "AI match rate", value: "97.4%", icon: BrainCircuit },
  { label: "Realtime rooms", value: "12.8k", icon: Activity },
  { label: "Creator payouts", value: "$4.2M", icon: ShieldCheck },
];

export function AuthShell() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-aurora-grid p-4 text-white">
      <div className="noise-layer pointer-events-none absolute inset-0 opacity-50" />
      <div className="relative mx-auto grid min-h-[calc(100vh-2rem)] max-w-7xl overflow-hidden rounded-lg border border-white/10 bg-black/20 shadow-card backdrop-blur-xl lg:grid-cols-[1.1fr_.9fr]">
        <section className="hidden flex-col justify-between border-r border-white/10 p-10 lg:flex">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-premium-line p-2 text-night shadow-glow">
                <AudioWaveform className="size-6" />
              </div>
              <span className="font-display text-xl font-semibold">BeatFlow AI</span>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-20 max-w-2xl"
            >
              <p className="text-sm font-semibold uppercase text-pulse">Neural music operating system</p>
              <h1 className="mt-4 font-display text-6xl font-semibold leading-tight">
                Stream, create, and operate music with intelligence in the loop.
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                A premium cockpit for listeners, artists, and admins with realtime signals, adaptive recommendations,
                HLS playback, and analytics woven into one interface.
              </p>
            </motion.div>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {metrics.map((metric) => (
              <div key={metric.label} className="glass-soft rounded-lg p-4">
                <metric.icon className="size-5 text-pulse" />
                <p className="mt-4 font-display text-2xl font-semibold">{metric.value}</p>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="flex items-center justify-center p-4 md:p-8">
          <Outlet />
        </section>
      </div>
    </main>
  );
}
