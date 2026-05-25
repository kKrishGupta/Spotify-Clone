import { SongCard }
from "@/features/music/components/SongCard";

import { PlaylistCard }
from "@/features/playlists/components/PlaylistCard";

export function SearchResults({
  results,
}) {

  const songs =
    results?.songs || [];

  const playlists =
    results?.playlists || [];

  if (
    !songs.length &&
    !playlists.length
  ) {

    return (
      <div className="
        glass rounded-xl p-10
        text-center
      ">
        <h3 className="
          text-xl font-semibold text-white
        ">
          No results found
        </h3>

        <p className="
          mt-2 text-muted-foreground
        ">
          Try searching by mood,
          language,
          artist,
          genre,
          or vibe.
        </p>
      </div>
    );
  }

  return (
    <div className="
      space-y-8
    ">

      {!!songs.length && (
        <section className="
          grid gap-4
          md:grid-cols-2
          xl:grid-cols-4
        ">
          {songs.map((song) => (
            <SongCard
              key={
                song._id ||
                song.id
              }
              song={song}
              compact
            />
          ))}
        </section>
      )}

      {!!playlists.length && (
        <section className="
          grid gap-4
          lg:grid-cols-3
        ">
          {playlists.map(
            (playlist) => (
              <PlaylistCard
                key={
                  playlist.id
                }
                playlist={
                  playlist
                }
              />
            )
          )}
        </section>
      )}
    </div>
  );
}