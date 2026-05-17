import { useQuery } from "@tanstack/react-query";
import { musicService } from "@/features/music/services/music.service";

export function useExploreData() {
  return useQuery({
    queryKey: ["music-explore"],
    queryFn: musicService.getExplore,
  });
}

export function useLibraryData() {
  return useQuery({
    queryKey: ["music-library"],
    queryFn: musicService.getLibrary,
  });
}
