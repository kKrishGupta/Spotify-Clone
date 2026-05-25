import { useQuery } from "@tanstack/react-query";
import { userDashboardService } from "@/features/user/services/userDashboard.service";

export function useUserDashboard() {
  return useQuery({
    queryKey: ["user-dashboard", "home"],
    queryFn: userDashboardService.getHomeDashboard,
    staleTime: 1000 * 60 * 2,
  });
}
