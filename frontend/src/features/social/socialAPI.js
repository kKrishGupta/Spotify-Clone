import API, { withFallback } from "../../services/api";
import { songs } from "../../utils/constants";

export const getSocialFeed = () =>
  withFallback(() => API.get("/social/feed"), [
    { id: "activity-1", user: "Maya", action: "liked", song: songs[0] },
    { id: "activity-2", user: "Aarav", action: "replayed", song: songs[3] },
  ]);
