import { SongCard } from "@/features/music/components/SongCard";

export function RecommendationLab({ songs }) {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      {songs.map((song) => (
        <SongCard key={song.id} song={song} compact />
      ))}
    </section>
  );
}
