import { BrainCircuit, Compass, Crown, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const dockItems = [
  { label: "Home", href: "#hero", icon: Home },
  { label: "Explore", href: "#discovery", icon: Compass },
  { label: "AI", href: "#ai", icon: BrainCircuit },
  { label: "Premium", href: "#premium", icon: Crown },
];

export function MobileLandingDock() {
  return (
    <nav className="fixed inset-x-3 bottom-3 z-50 rounded-lg border border-white/10 bg-black/70 p-2 shadow-card backdrop-blur-2xl md:hidden">
      <div className="grid grid-cols-4 gap-1">
        {dockItems.map((item, index) => (
          <a
            key={item.href}
            href={item.href}
            className={cn(
              "flex min-h-14 flex-col items-center justify-center gap-1 rounded-md text-xs font-semibold transition hover:bg-white/10",
              index === 0 ? "text-pulse" : "text-muted-foreground hover:text-white",
            )}
          >
            <item.icon className="size-5" />
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
