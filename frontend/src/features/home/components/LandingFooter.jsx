import { AudioWaveform, Github, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { footerColumns } from "@/features/home/data/landing.data";

export function LandingFooter() {
  return (
    <footer className="border-t border-white/10 bg-black/35">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1.9fr]">
          <div>
            <a href="#hero" className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-md bg-premium-line text-night shadow-glow">
                <AudioWaveform className="size-6" />
              </span>
              <span className="font-display text-xl font-semibold text-white">BeatFlow AI</span>
            </a>
            <p className="mt-5 max-w-sm text-sm leading-6 text-muted-foreground">
              The AI-native music platform for streaming, discovery, creators, rooms, playlists, and developer tools.
            </p>
            <div className="mt-6 flex gap-2">
              {[Twitter, Instagram, Github].map((Icon, index) => (
                <Button key={index} variant="outline" size="icon" aria-label="Social link">
                  <Icon className="size-4" />
                </Button>
              ))}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h3 className="font-display text-sm font-semibold uppercase text-white">{column.title}</h3>
                <div className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <a key={link} href="#hero" className="block text-sm text-muted-foreground transition hover:text-white">
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© 2026 BeatFlow AI. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <a href="#hero" className="hover:text-white">Download app</a>
            <a href="#hero" className="hover:text-white">API</a>
            <a href="#hero" className="hover:text-white">Developer tools</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
