import { useState }
from "react";

import { Search }
from "lucide-react";

import { Input }
from "@/components/ui/input";

import { SongCard }
from "@/features/music/components/SongCard";

import { useSemanticSearch }
from "@/features/music/hooks/useSemanticSearch";

export default function SearchPage() {

  const [query, setQuery] =
    useState("");

  const {
    data,
    isLoading,
  } =
    useSemanticSearch(query);

  const songs =
    data?.data || [];

  return (

    <div className="space-y-6">

      <div className="
        sticky top-0 z-20
        rounded-xl
        border border-white/10
        bg-black/40
        p-4
        backdrop-blur-xl
      ">

        <div className="relative">

          <Search className="
            absolute left-4 top-1/2
            size-5 -translate-y-1/2
            text-muted-foreground
          " />

          <Input

            value={query}

            onChange={(e) =>
              setQuery(
                e.target.value
              )
            }

            placeholder="
              Search songs, moods,
              artists, vibes,
              AI semantic tags...
            "

            className="
              h-14 pl-12 text-lg
            "
          />

        </div>

      </div>

      {isLoading ? (

        <div className="
          text-muted-foreground
        ">
          AI searching...
        </div>

      ) : null}

      <div className="
        grid gap-4
        md:grid-cols-2
        xl:grid-cols-4
      ">

        {songs.map((song) => (

          <SongCard
            key={
              song._id
            }
            song={song}
          />

        ))}

      </div>

    </div>
  );
}