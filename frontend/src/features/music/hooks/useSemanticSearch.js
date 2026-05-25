import { useQuery }
from "@tanstack/react-query";

import { useDebounce }
from "@/hooks/useDebounce";

import { musicService }
from "@/features/music/services/music.service";

export function useSemanticSearch(
  query
) {

  const debounced =
    useDebounce(
      query,
      400
    );

  return useQuery({

    queryKey: [
      "semantic-search",
      debounced,
    ],

    queryFn: () =>
      musicService.searchSongs(
        debounced
      ),

    enabled:
      !!debounced,
  });
}