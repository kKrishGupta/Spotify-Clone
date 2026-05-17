import { create } from "zustand";

export const usePlaylistsStore = create((set) => ({
  liked: {},
  optimisticLike: (playlistId) =>
    set((state) => ({
      liked: { ...state.liked, [playlistId]: !state.liked[playlistId] },
    })),
}));
