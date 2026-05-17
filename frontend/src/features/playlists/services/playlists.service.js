import { playlists } from "@/config/constants";
import { simulateNetwork } from "@/services/mockData.service";

export const playlistsService = {
  list: () => simulateNetwork(playlists),
  like: (playlistId) => simulateNetwork({ playlistId, liked: true }, 180),
  addCollaborator: (playlistId, email) => simulateNetwork({ playlistId, email, invited: true }, 260),
};
