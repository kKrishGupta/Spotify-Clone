import { cn } from "@/lib/utils";

export function Input({ className, type = "text", ...props }) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-md border border-white/10 bg-white/[0.055] px-3 py-2 text-sm text-white shadow-inset outline-none transition placeholder:text-muted-foreground focus:border-pulse/50 focus:ring-2 focus:ring-pulse/20 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
