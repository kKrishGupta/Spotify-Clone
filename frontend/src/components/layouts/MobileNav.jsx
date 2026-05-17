import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/layouts/Sidebar";
import { useAppStore } from "@/stores/app.store";

export function MobileNav() {
  const sidebarOpen = useAppStore((state) => state.sidebarOpen);
  const setSidebarOpen = useAppStore((state) => state.setSidebarOpen);

  if (!sidebarOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] md:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => setSidebarOpen(false)}
        aria-label="Close navigation backdrop"
      />
      <div className="relative h-full w-80 max-w-[86vw]">
        <Sidebar mobile />
        <Button className="absolute right-3 top-3" size="icon" variant="ghost" onClick={() => setSidebarOpen(false)}>
          <X className="size-5" />
        </Button>
      </div>
    </div>
  );
}
