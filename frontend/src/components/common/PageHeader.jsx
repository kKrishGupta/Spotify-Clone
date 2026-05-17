import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function PageHeader({ eyebrow, title, description, action, className }) {
  return (
    <motion.header {...fadeUp} className={cn("flex flex-col gap-4 md:flex-row md:items-end md:justify-between", className)}>
      <div className="max-w-3xl">
        {eyebrow ? <Badge variant="cyan">{eyebrow}</Badge> : null}
        <h1 className="mt-3 font-display text-3xl font-semibold text-white md:text-5xl">{title}</h1>
        {description ? <p className="mt-3 text-base leading-7 text-muted-foreground md:text-lg">{description}</p> : null}
      </div>
      {action ? <div className="flex shrink-0 items-center gap-2">{action}</div> : null}
    </motion.header>
  );
}
