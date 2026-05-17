import { useState } from "react";
import { Bot, SendHorizonal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassPanel } from "@/components/common/GlassPanel";

const seedMessages = [
  { id: "m1", role: "assistant", text: "I mapped your recent listening into a high-focus synth curve." },
  { id: "m2", role: "user", text: "Make it warmer and add Indian indie texture." },
  { id: "m3", role: "assistant", text: "Done. I reduced tempo variance and added acoustic transitions." },
];

export function AIChat() {
  const [messages, setMessages] = useState(seedMessages);
  const [value, setValue] = useState("Generate a 45 minute coding mix with no abrupt vocals.");

  function send() {
    if (!value.trim()) {
      return;
    }

    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "user", text: value },
      {
        id: crypto.randomUUID(),
        role: "assistant",
        text: "I built a draft with a soft open, a 30 minute focus plateau, and a brighter final arc.",
      },
    ]);
    setValue("");
  }

  return (
    <GlassPanel className="flex h-[560px] flex-col p-4">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <div className="rounded-md bg-pulse/10 p-3 text-pulse">
          <Bot className="size-5" />
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold text-white">AI music assistant</h2>
          <p className="text-sm text-muted-foreground">Context-aware curation and playlist reasoning</p>
        </div>
      </div>
      <div className="scrollbar-premium flex-1 space-y-3 overflow-y-auto py-4">
        {messages.map((message) => (
          <div key={message.id} className={message.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div
              className={
                message.role === "user"
                  ? "max-w-[78%] rounded-lg bg-pulse px-4 py-3 text-sm font-medium text-night"
                  : "max-w-[78%] rounded-lg border border-white/10 bg-white/[0.055] px-4 py-3 text-sm leading-6 text-white"
              }
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 border-t border-white/10 pt-4">
        <Input value={value} onChange={(event) => setValue(event.target.value)} />
        <Button variant="neon" onClick={send}>
          <SendHorizonal className="size-4" />
          Send
        </Button>
      </div>
    </GlassPanel>
  );
}
