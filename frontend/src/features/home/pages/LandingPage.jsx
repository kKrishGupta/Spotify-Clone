import { LazyMotion, domAnimation, m } from "framer-motion";
import { AIFeaturesSection } from "@/features/home/components/AIFeaturesSection";
import { LandingFooter } from "@/features/home/components/LandingFooter";
import { LandingHero } from "@/features/home/components/LandingHero";
import { LandingNavbar } from "@/features/home/components/LandingNavbar";
import { LiveActivitySection } from "@/features/home/components/LiveActivitySection";
import { MobileLandingDock } from "@/features/home/components/MobileLandingDock";
import { MusicDiscoverySection } from "@/features/home/components/MusicDiscoverySection";
import { PremiumSection } from "@/features/home/components/PremiumSection";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function LandingPage() {
  useDocumentTitle("BeatFlow AI", "AI-native music streaming, discovery, playlists, and live listening rooms.");

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="min-h-screen overflow-hidden bg-night text-white"
      >
        <LandingNavbar />
        <main>
          <LandingHero />
          <MusicDiscoverySection />
          <AIFeaturesSection />
          <LiveActivitySection />
          <PremiumSection />
        </main>
        <LandingFooter />
        <MobileLandingDock />
      </m.div>
    </LazyMotion>
  );
}
