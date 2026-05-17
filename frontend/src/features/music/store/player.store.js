import { Howl, Howler } from "howler";
import { create } from "zustand";
import { mockSongs } from "@/config/constants";
import { clamp } from "@/lib/utils";

export const usePlayerStore = create((set, get) => ({
  queue: mockSongs,
  currentTrack: mockSongs[0],
  howl: null,
  isPlaying: false,
  progress: 32,
  volume: 0.74,
  speed: 1,
  queueOpen: false,
  lyricsOpen: false,
  setQueue: (queue) => set({ queue }),
  playTrack: (track) => {
    const previous = get().howl;
    if (previous) {
      previous.unload();
    }

    const howl = track.previewUrl
      ? new Howl({
          src: [track.previewUrl],
          html5: true,
          volume: get().volume,
          rate: get().speed,
          onend: () => get().playNext(),
        })
      : null;

    if (howl) {
      howl.play();
    }

    set({ currentTrack: track, howl, isPlaying: true, progress: 0 });
  },
  togglePlay: () => {
    const { howl, isPlaying } = get();
    if (howl) {
      if (isPlaying) {
        howl.pause();
      } else {
        howl.play();
      }
    }
    set({ isPlaying: !isPlaying });
  },
  playNext: () => {
    const { queue, currentTrack } = get();
    const currentIndex = queue.findIndex((track) => track.id === currentTrack?.id);
    const next = queue[(currentIndex + 1) % queue.length];
    get().playTrack(next);
  },
  playPrevious: () => {
    const { queue, currentTrack } = get();
    const currentIndex = queue.findIndex((track) => track.id === currentTrack?.id);
    const previous = queue[(currentIndex - 1 + queue.length) % queue.length];
    get().playTrack(previous);
  },
  setProgress: (progress) => set({ progress: clamp(progress, 0, 100) }),
  tickProgress: () => set((state) => ({ progress: state.isPlaying ? (state.progress + 0.22) % 100 : state.progress })),
  setVolume: (volume) => {
    const clamped = clamp(volume, 0, 1);
    Howler.volume(clamped);
    get().howl?.volume(clamped);
    set({ volume: clamped });
  },
  setSpeed: (speed) => {
    get().howl?.rate(speed);
    set({ speed });
  },
  setQueueOpen: (queueOpen) => set({ queueOpen }),
  setLyricsOpen: (lyricsOpen) => set({ lyricsOpen }),
}));
