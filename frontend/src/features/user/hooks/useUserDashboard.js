import { useQuery } from "@tanstack/react-query";
import { userService } from "@/features/user/services/user.service";

export function useUserDashboard() {
  return useQuery({
    queryKey: ["user-dashboard"],
    queryFn: userService.getDashboard,
  });
}
