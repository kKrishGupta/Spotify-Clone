import { cn } from "@/lib/utils";

export function Tabs({ tabs, value, onChange, className }) {
  return (
    <div className={cn("inline-flex rounded-md border border-white/10 bg-white/[0.04] p-1", className)} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          role="tab"
          aria-selected={value === tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            "rounded px-3 py-2 text-sm font-semibold text-muted-foreground transition",
            value === tab.value && "bg-white/12 text-white shadow-inset",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
