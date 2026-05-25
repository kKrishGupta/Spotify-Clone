import { useQuery } from "@tanstack/react-query";
import { homeFeedService } from "@/features/home/services/homeFeed.service";

export function useHomeFeed() {
  return useQuery({
    queryKey: ["home-feed"],
    queryFn: homeFeedService.getHomeFeed,
    staleTime: 1000 * 60 * 2,
  });
}
