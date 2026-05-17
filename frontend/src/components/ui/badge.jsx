import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold", {
  variants: {
    variant: {
      default: "bg-white/10 text-white",
      cyan: "bg-pulse/15 text-pulse ring-1 ring-pulse/30",
      pink: "bg-aurora/15 text-aurora ring-1 ring-aurora/25",
      green: "bg-volt/15 text-volt ring-1 ring-volt/25",
      amber: "bg-ember/15 text-ember ring-1 ring-ember/25",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
