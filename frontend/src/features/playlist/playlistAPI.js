import API, { withFallback } from "../../services/api";
import { playlists } from "../../utils/constants";

export const getPlaylists = () => withFallback(() => API.get("/playlists"), playlists);

export const getPlaylistById = (id) =>
  withFallback(() => API.get(`/playlists/${id}`), () =>
    playlists.find((playlist) => playlist.id === id) || playlists[0],
  );
