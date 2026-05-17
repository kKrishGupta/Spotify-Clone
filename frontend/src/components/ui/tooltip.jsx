import { cn } from "@/lib/utils";

export function Tooltip({ label, children, className }) {
  return (
    <span className={cn("group relative inline-flex", className)}>
      {children}
      <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-black/90 px-2 py-1 text-xs text-white shadow-soft group-hover:block">
        {label}
      </span>
    </span>
  );
}
