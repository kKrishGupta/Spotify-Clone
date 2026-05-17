import { useState } from "react";
import { SendHorizonal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { GlassPanel } from "@/components/common/GlassPanel";
import { useAppStore } from "@/stores/app.store";

export function FeedComposer() {
  const [value, setValue] = useState("Launching a late-night AI listening room with high-energy synth pop.");
  const addActivity = useAppStore((state) => state.addActivity);

  function publish() {
    addActivity({ user: "You", action: "published an activity pulse", target: value });
    setValue("");
  }

  return (
    <GlassPanel className="p-5">
      <Textarea value={value} onChange={(event) => setValue(event.target.value)} />
      <div className="mt-3 flex justify-end">
        <Button onClick={publish} variant="neon" disabled={!value.trim()}>
          <SendHorizonal className="size-4" />
          Publish
        </Button>
      </div>
    </GlassPanel>
  );
}
