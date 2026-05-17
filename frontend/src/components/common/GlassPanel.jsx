import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function GlassPanel({ className, children, hover = true, ...props }) {
  return (
    <motion.section
      whileHover={hover ? { y: -3 } : undefined}
      transition={{ duration: 0.22 }}
      className={cn("glass premium-ring rounded-lg", className)}
      {...props}
    >
      {children}
    </motion.section>
  );
}
