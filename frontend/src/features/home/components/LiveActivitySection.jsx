import { motion } from "framer-motion";
import { Activity, Radio, UsersRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  MagneticPanel,
  SectionHeading,
} from "@/features/home/components/LandingShared";
import { childReveal, staggerReveal } from "@/features/home/components/landingMotion";
import { liveActivity, liveRooms } from "@/features/home/data/landing.data";
import { cn } from "@/lib/utils";

export function LiveActivitySection() {
  return (
    <section id="live" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[.82fr_1.18fr] lg:items-center">
        <SectionHeading
          eyebrow="Live activity"
          title="Music feels alive when the crowd is visible."
          description="Follow friends, join rooms, discover collaborative playlists, and watch tracks climb in real time without leaving the listening flow."
          className="max-w-xl"
        />

        <motion.div {...staggerReveal} className="grid gap-4 md:grid-cols-2">
          <MagneticPanel className="p-5">
            <div className="mb-5 flex items-center justify-between">
              <Badge variant="green">
                <Activity className="size-3" />
                Now
              </Badge>
              <span className="relative flex size-3">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-volt opacity-60" />
                <span className="relative inline-flex size-3 rounded-full bg-volt" />
              </span>
            </div>
            <div className="space-y-3">
              {liveActivity.map((event) => (
                <div key={event.id} className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.045] p-3">
                  <span className={cn("mt-1 size-2.5 shrink-0 rounded-full shadow-glow", event.tone)} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white">
                      <span className="font-semibold">{event.user}</span> {event.action}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{event.target}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{event.time}</span>
                </div>
              ))}
            </div>
          </MagneticPanel>

          <MagneticPanel className="p-5">
            <div className="mb-5 flex items-center justify-between">
              <Badge variant="cyan">
                <Radio className="size-3" />
                Rooms
              </Badge>
              <Button variant="ghost" size="sm">Join live</Button>
            </div>
            <div className="space-y-4">
              {liveRooms.map((room, index) => (
                <motion.div key={room.id} {...childReveal} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
                  <div className="flex items-center gap-3">
                    <span className="rounded-md border border-white/10 bg-white/10 p-2 text-pulse">
                      <room.icon className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-white">{room.title}</p>
                      <p className="text-sm text-muted-foreground">{room.listeners} listening</p>
                    </div>
                  </div>
                  <Progress value={68 + index * 9} className="mt-4" />
                </motion.div>
              ))}
            </div>
          </MagneticPanel>
        </motion.div>
      </div>

      <motion.div {...staggerReveal} className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          { label: "Friends listening", value: "84k", icon: UsersRound },
          { label: "Collaborative playlists", value: "18.2k", icon: Activity },
          { label: "Live sessions today", value: "31k", icon: Radio },
        ].map((item) => (
          <motion.div key={item.label} {...childReveal} className="glass-soft rounded-lg p-5">
            <item.icon className="size-6 text-pulse" />
            <p className="mt-5 font-display text-3xl font-semibold text-white">{item.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
