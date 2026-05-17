import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full resize-none rounded-md border border-white/10 bg-white/[0.055] px-3 py-3 text-sm text-white shadow-inset outline-none transition placeholder:text-muted-foreground focus:border-pulse/50 focus:ring-2 focus:ring-pulse/20",
        className,
      )}
      {...props}
    />
  );
}
