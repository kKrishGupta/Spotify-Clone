import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { childReveal, reveal } from "@/features/home/components/landingMotion";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}) {
  return (
    <motion.div
      {...reveal}
      className={cn(
        "mx-auto max-w-3xl",
        align === "center" ? "text-center" : "mx-0 text-left",
        className,
      )}
    >
      {eyebrow ? (
        <Badge variant="cyan" className="mb-4">
          {eyebrow}
        </Badge>
      ) : null}
      <h2 className="font-display text-3xl font-semibold text-white md:text-5xl">{title}</h2>
      {description ? (
        <p className="mt-4 text-base leading-7 text-muted-foreground md:text-lg">{description}</p>
      ) : null}
    </motion.div>
  );
}

export function AlbumArtwork({
  gradient,
  title,
  className,
  children,
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br shadow-soft",
        gradient || "from-pulse via-plasma to-aurora",
        className,
      )}
      aria-label={title}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(255,255,255,.34),transparent_26%),linear-gradient(135deg,rgba(255,255,255,.18),transparent_46%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/45 to-transparent" />
      <div className="absolute -right-10 -top-10 size-32 rounded-full border border-white/20" />
      <div className="absolute bottom-4 left-4 right-4">
        <div className="mb-3 flex h-10 items-end gap-1">
          {Array.from({ length: 12 }).map((_, index) => (
            <motion.span
              key={index}
              className="w-1.5 rounded-full bg-white/80"
              animate={{ height: [`${18 + (index % 5) * 5}%`, `${52 + (index % 6) * 7}%`, `${22 + (index % 4) * 5}%`] }}
              transition={{
                duration: 1.1 + index * 0.03,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.04,
              }}
            />
          ))}
        </div>
        {children}
      </div>
    </div>
  );
}

export function MusicCard({
  item,
  index = 0,
  large = false,
}) {
  return (
    <motion.article
      {...childReveal}
      whileHover={{ y: -8, scale: 1.015 }}
      className={cn(
        "group relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.045] p-3 shadow-soft backdrop-blur-xl transition hover:bg-white/[0.075]",
        large ? "w-[280px]" : "w-[220px]",
      )}
    >
      <AlbumArtwork gradient={item.cover} title={item.title} className={large ? "aspect-[4/5]" : "aspect-square"}>
        <span className="rounded-full bg-black/35 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
          {item.mood}
        </span>
      </AlbumArtwork>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-display text-lg font-semibold text-white">{item.title}</h3>
          <p className="mt-1 truncate text-sm text-muted-foreground">{item.artist}</p>
          <p className="mt-2 text-xs text-muted-foreground">{item.meta}</p>
        </div>
        <Button
          variant="neon"
          size="icon"
          className="size-9 shrink-0 rounded-full opacity-0 shadow-glow transition group-hover:opacity-100"
          aria-label={`Preview ${item.title}`}
        >
          <Play className="size-4 fill-current" />
        </Button>
      </div>
      <div className="pointer-events-none absolute inset-x-3 top-3 flex justify-between text-xs font-semibold text-white/70">
        <span>{String(index + 1).padStart(2, "0")}</span>
      </div>
    </motion.article>
  );
}

export function MagneticPanel({
  children,
  className,
  featured = false,
}) {
  return (
    <motion.article
      {...childReveal}
      whileHover={{ y: -8, scale: 1.012 }}
      className={cn(
        "group relative overflow-hidden rounded-lg border bg-white/[0.045] shadow-card backdrop-blur-2xl transition",
        featured ? "border-pulse/40 ring-1 ring-pulse/30" : "border-white/10",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,229,255,.08),transparent_34%,rgba(255,78,205,.08))] opacity-0 transition group-hover:opacity-100" />
      <div className="relative">{children}</div>
    </motion.article>
  );
}
