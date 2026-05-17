import { motion } from "framer-motion";
import { Waveform } from "@/features/streaming/waveform/Waveform";

export function AudioVisualizer({ title = "Realtime spectrum", active = true }) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-white/10 bg-black/25 p-5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,229,255,.18),transparent_45%)]" />
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-1 font-display text-xl font-semibold text-white">Neural audio field</p>
        </div>
        <motion.div
          animate={active ? { scale: [1, 1.08, 1] } : { scale: 1 }}
          transition={{ duration: 1.6, repeat: active ? Infinity : 0 }}
          className="size-14 rounded-full bg-premium-line shadow-glow"
        />
      </div>
      <Waveform active={active} className="relative mt-6" bars={54} />
    </div>
  );
}
