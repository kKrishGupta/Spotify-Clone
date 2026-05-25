import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AudioWaveform, Menu, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { navItems } from "@/features/home/data/landing.data";
import { cn } from "@/lib/utils";

export function LandingNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-night/70 backdrop-blur-2xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <a href="#hero" className="flex min-w-0 items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-md bg-premium-line text-night shadow-glow">
            <AudioWaveform className="size-6" />
          </span>
          <span className="font-display text-xl font-semibold text-white">BeatFlow AI</span>
        </a>

        <nav className="ml-6 hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#discovery"
          className="ml-auto hidden h-11 min-w-[280px] items-center gap-3 rounded-md border border-white/10 bg-white/[0.055] px-4 text-sm text-muted-foreground shadow-inset transition hover:bg-white/[0.08] hover:text-white md:flex"
        >
          <Search className="size-4 text-pulse" />
          Search moods, artists, lyrics
        </a>

        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost">
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild variant="neon">
            <Link to="/register">Signup</Link>
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="ml-auto md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Open navigation"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/10 bg-black/60 md:hidden"
          >
            <div className="space-y-2 px-4 py-4">
              <a
                href="#discovery"
                onClick={() => setOpen(false)}
                className="flex h-11 items-center gap-3 rounded-md border border-white/10 bg-white/[0.055] px-4 text-sm text-muted-foreground"
              >
                <Search className="size-4 text-pulse" />
                Search moods, artists, lyrics
              </a>
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  {item.label}
                </a>
              ))}
              <div className={cn("grid gap-2 pt-2", "grid-cols-2")}>
                <Button asChild variant="outline">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild variant="neon">
                  <Link to="/register">Signup</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
