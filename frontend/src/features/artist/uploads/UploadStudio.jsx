import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadCloud } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { GlassPanel } from "@/components/common/GlassPanel";
import { PageHeader } from "@/components/common/PageHeader";
import { artistService } from "@/features/artist/services/artist.service";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const uploadSchema = z.object({
  title: z.string().min(2, "Add a title"),
  genre: z.string().min(2, "Add a genre"),
  description: z.string().min(12, "Add a richer description"),
});

export default function UploadStudio() {
  useDocumentTitle("Upload Studio", "Artist upload and audio processing workflow.");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const form = useForm({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      title: "Neural Sunrise",
      genre: "AI Pop",
      description: "A bright future-pop track with warm pads, Indian percussion, and a clean chorus lift.",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setStatus("Uploading source audio");
    setProgress(8);
    const timer = window.setInterval(() => {
      setProgress((current) => Math.min(94, current + 9));
    }, 260);
    await artistService.uploadSong(values);
    window.clearInterval(timer);
    setProgress(100);
    setStatus("Upload complete. Audio processing queued.");
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Upload"
        title="Artist upload studio"
        description="A polished upload path with validation, progress, audio processing states, and release metadata."
      />
      <GlassPanel className="p-6">
        <form className="grid gap-5 lg:grid-cols-[1fr_.8fr]" onSubmit={onSubmit}>
          <div className="space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-white">Song title</span>
              <Input {...form.register("title")} />
              <span className="text-xs text-ember">{form.formState.errors.title?.message}</span>
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-white">Genre</span>
              <Input {...form.register("genre")} />
              <span className="text-xs text-ember">{form.formState.errors.genre?.message}</span>
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-white">AI metadata brief</span>
              <Textarea {...form.register("description")} />
              <span className="text-xs text-ember">{form.formState.errors.description?.message}</span>
            </label>
            <Button variant="neon" size="lg" disabled={form.formState.isSubmitting}>
              <UploadCloud className="size-5" />
              Upload and process
            </Button>
          </div>
          <div className="rounded-lg border border-dashed border-white/15 bg-white/[0.035] p-6">
            <div className="grid min-h-56 place-items-center rounded-lg bg-black/20 text-center">
              <div>
                <UploadCloud className="mx-auto size-10 text-pulse" />
                <p className="mt-4 font-display text-xl font-semibold text-white">Drop audio master</p>
                <p className="mt-2 text-sm text-muted-foreground">WAV, FLAC, MP3, stems, or spatial bundle</p>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{status || "Ready for upload"}</span>
                <span className="font-semibold text-white">{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          </div>
        </form>
      </GlassPanel>
    </div>
  );
}
