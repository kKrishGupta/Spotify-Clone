import { create } from "zustand";
import { songs } from "../../utils/constants";

const firstSong = songs[0];

export const usePlayerStore = create((set, get) => ({
  currentSong: firstSong,
  queue: songs,
  currentIndex: 0,
  isPlaying: false,
  progress: 0,
  duration: firstSong.duration,
  volume: 0.78,
  isMuted: false,
  shuffle: false,
  repeat: false,

  playSong: (song, queue = get().queue) => {
    const safeQueue = queue?.length ? queue : [song];
    const index = Math.max(
      0,
      safeQueue.findIndex((item) => item.id === song.id),
    );

    set({
      currentSong: song,
      queue: safeQueue,
      currentIndex: index,
      isPlaying: true,
      progress: 0,
      duration: song.duration || 0,
    });
  },

  setQueue: (queue, startIndex = 0) => {
    const safeQueue = queue?.length ? queue : songs;
    const currentSong = safeQueue[startIndex] || safeQueue[0];

    set({
      queue: safeQueue,
      currentIndex: startIndex,
      currentSong,
      duration: currentSong?.duration || 0,
      progress: 0,
      isPlaying: Boolean(currentSong),
    });
  },

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),

  next: () => {
    const { queue, currentIndex, shuffle } = get();
    if (!queue.length) return;

    const nextIndex = shuffle
      ? Math.floor(Math.random() * queue.length)
      : (currentIndex + 1) % queue.length;

    const nextSong = queue[nextIndex];
    set({
      currentSong: nextSong,
      currentIndex: nextIndex,
      isPlaying: true,
      progress: 0,
      duration: nextSong.duration || 0,
    });
  },

  previous: () => {
    const { queue, currentIndex } = get();
    if (!queue.length) return;

    const previousIndex = (currentIndex - 1 + queue.length) % queue.length;
    const previousSong = queue[previousIndex];

    set({
      currentSong: previousSong,
      currentIndex: previousIndex,
      isPlaying: true,
      progress: 0,
      duration: previousSong.duration || 0,
    });
  },

  seek: (progress) => set({ progress }),
  setDuration: (duration) => set({ duration }),
  setVolume: (volume) => set({ volume, isMuted: Number(volume) === 0 }),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),
  toggleRepeat: () => set((state) => ({ repeat: !state.repeat })),
}));
