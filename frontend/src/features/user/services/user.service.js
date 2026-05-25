import { apiClient }
from "@/lib/apiClient";

export const userService = {

  getDashboard:
    () =>
      apiClient.get(
        "/users/me/dashboard"
      ),

  followUser:
    (id) =>
      apiClient.post(
        `/users/follow/${id}`
      ),

  unfollowUser:
    (id) =>
      apiClient.post(
        `/users/unfollow/${id}`
      ),
};