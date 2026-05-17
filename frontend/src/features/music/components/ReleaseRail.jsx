import { SongCard } from "@/features/music/components/SongCard";

export function ReleaseRail({ title, songs }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold text-white">{title}</h2>
        <span className="text-sm text-muted-foreground">Realtime ranked</span>
      </div>
      <div className="scrollbar-premium grid auto-cols-[220px] grid-flow-col gap-4 overflow-x-auto pb-2">
        {songs.map((song) => (
          <SongCard key={song.id} song={song} />
        ))}
      </div>
    </section>
  );
}
