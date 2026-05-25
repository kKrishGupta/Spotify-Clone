import { Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MagneticPanel,
  SectionHeading,
} from "@/features/home/components/LandingShared";
import { staggerReveal } from "@/features/home/components/landingMotion";
import { plans } from "@/features/home/data/landing.data";
import { cn } from "@/lib/utils";

export function PremiumSection() {
  return (
    <section id="premium" className="relative border-y border-white/10 bg-black/25 py-20">
      <div className="landing-section-sheen absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Premium"
          title="Plans for listeners, super fans, and serious creators."
          description="Simple pricing with Spotify-style listening, AI-native personalization, and creator-grade intelligence."
          align="center"
        />

        <motion.div {...staggerReveal} className="mt-12 grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <MagneticPanel
              key={plan.id}
              featured={plan.featured}
              className={cn("group flex min-h-[560px] flex-col p-6", plan.featured && "bg-white/[0.07]")}
            >
              {plan.featured ? (
                <Badge variant="green" className="mb-5 w-fit">
                  <Sparkles className="size-3" />
                  Best value
                </Badge>
              ) : (
                <div className="mb-5 h-7" />
              )}
              <div className="flex items-center gap-3">
                <span className="rounded-md border border-white/10 bg-white/10 p-3 text-pulse">
                  <plan.icon className="size-6" />
                </span>
                <h3 className="font-display text-2xl font-semibold text-white">{plan.name}</h3>
              </div>
              <div className="mt-8">
                <span className="font-display text-5xl font-semibold text-white">{plan.price}</span>
                <span className="text-muted-foreground"> / month</span>
              </div>
              <p className="mt-4 min-h-16 text-sm leading-6 text-muted-foreground">{plan.description}</p>
              <Button asChild variant={plan.featured ? "neon" : "outline"} size="lg" className="mt-8 rounded-full">
                <Link to="/register">{plan.cta}</Link>
              </Button>
              <div className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3 text-sm text-white/78">
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-pulse/15 text-pulse">
                      <Check className="size-3.5" />
                    </span>
                    {feature}
                  </div>
                ))}
              </div>
            </MagneticPanel>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
