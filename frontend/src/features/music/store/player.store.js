import {
  Howl,
  Howler,
} from "howler";

import {
  create,
} from "zustand";

import {
  persist,
} from "zustand/middleware";

const DEFAULT_VOLUME =
  0.7;

export const usePlayerStore =
  create(

    persist(

      (set, get) => ({

        /* =========================================
           🎵 PLAYER STATE
        ========================================= */

        currentTrack:
          null,

        queue: [],

        currentIndex:
          0,

        howl:
          null,

        isPlaying:
          false,

        loading:
          false,

        error:
          null,

        buffering:
          false,

        audioReady:
          false,

        autoplay:
          true,

        cinemaMode:
          false,

        /* =========================================
           🎚 AUDIO STATE
        ========================================= */

        progress:
          0,

        duration:
          0,

        volume:
          DEFAULT_VOLUME,

        muted:
          false,

        speed:
          1,

        /* =========================================
           🔁 PLAYER MODES
        ========================================= */

        repeat:
          false,

        shuffle:
          false,

        /* =========================================
           📚 USER MUSIC STATE
        ========================================= */

        likedSongs:
          [],

        recentlyPlayed:
          [],

        /* =========================================
           🪟 UI STATE
        ========================================= */

        queueOpen:
          false,

        lyricsOpen:
          false,

        /* =========================================
           🚀 PLAY TRACK
        ========================================= */

        playTrack:
          async (
            track,
            queue = null
          ) => {

            try {

              set({

                loading:
                  true,

                buffering:
                  true,

                audioReady:
                  false,

                error:
                  null,
              });

              const previous =
                get().howl;

              // ✅ CLEAN PREVIOUS AUDIO
              if (previous) {

                previous.stop();

                previous.unload();
              }

              const src =

                track?.hls ||

                track?.uri ||

                track?.previewUrl ||

                track?.audio;

              if (!src) {

                throw new Error(
                  "Track source missing"
                );
              }

              const howl =
                new Howl({

                  src: [src],

                  html5: true,

                  preload: true,

                  autoplay:
                    get().autoplay,

                  volume:
                    get().volume,

                  rate:
                    get().speed,

                  format: [
                    "mp3",
                    "mpeg",
                    "aac",
                  ],

                  /* ===============================
                     AUDIO READY
                  =============================== */

                  onload: () => {

                    set({

                      audioReady:
                        true,

                      buffering:
                        false,
                    });
                  },

                  /* ===============================
                     PLAY
                  =============================== */

                  onplay: () => {

                    set({

                      isPlaying:
                        true,

                      duration:
                        howl.duration(),

                      loading:
                        false,

                      buffering:
                        false,

                      audioReady:
                        true,
                    });

                    requestAnimationFrame(
                      get().syncProgress
                    );
                  },

                  /* ===============================
                     PAUSE
                  =============================== */

                  onpause: () => {

                    set({

                      isPlaying:
                        false,
                    });
                  },

                  /* ===============================
                     STOP
                  =============================== */

                  onstop: () => {

                    set({

                      isPlaying:
                        false,

                      progress:
                        0,
                    });
                  },

                  /* ===============================
                     TRACK END
                  =============================== */

                  onend: () => {

                    if (
                      get().repeat
                    ) {

                      howl.play();

                      return;
                    }

                    get().playNext();
                  },

                  /* ===============================
                     LOAD ERROR
                  =============================== */

                  onloaderror:
                    (_, err) => {

                      set({

                        error:
                          err,

                        loading:
                          false,

                        buffering:
                          false,

                        audioReady:
                          false,
                      });
                    },

                  /* ===============================
                     PLAY ERROR
                  =============================== */

                  onplayerror:
                    (_, err) => {

                      set({

                        error:
                          err,

                        loading:
                          false,

                        buffering:
                          false,
                      });
                    },
                });

              howl.play();

              const finalQueue =
                queue ||
                get().queue;

              const currentIndex =
                finalQueue.findIndex(

                  (t) =>

                    (
                      t._id ||
                      t.id
                    ) ===

                    (
                      track._id ||
                      track.id
                    )
                );

              set({

                currentTrack:
                  track,

                queue:
                  finalQueue,

                currentIndex,

                howl,

                isPlaying:
                  true,

                progress:
                  0,

                duration:
                  0,
              });

              // ✅ RECENTLY PLAYED
              get()
                .addRecentlyPlayed(
                  track
                );

            } catch (err) {

              set({

                loading:
                  false,

                buffering:
                  false,

                audioReady:
                  false,

                error:
                  err.message,
              });
            }
          },

        /* =========================================
           ⏱ PROGRESS SYNC
        ========================================= */

        syncProgress:
          () => {

            const {

              howl,

              isPlaying,

            } = get();

            if (
              howl &&
              isPlaying
            ) {

              const seek =
                howl.seek() || 0;

              const duration =
                howl.duration() || 1;

              set({

                progress:
                  (seek /
                    duration) *
                  100,
              });

              requestAnimationFrame(
                get().syncProgress
              );
            }
          },

        /* =========================================
           ▶ PLAY
        ========================================= */

        play:
          () => {

            const howl =
              get().howl;

            howl?.play();

            set({
              isPlaying:
                true,
            });
          },

        /* =========================================
           ⏸ PAUSE
        ========================================= */

        pause:
          () => {

            const howl =
              get().howl;

            howl?.pause();

            set({
              isPlaying:
                false,
            });
          },

        /* =========================================
           🔀 TOGGLE PLAY
        ========================================= */

        togglePlay:
          () => {

            const {

              howl,

              isPlaying,

            } = get();

            if (!howl)
              return;

            if (isPlaying) {

              howl.pause();

            } else {

              howl.play();
            }

            set({

              isPlaying:
                !isPlaying,
            });
          },

        /* =========================================
           ⏩ SEEK
        ========================================= */

        seekTo:
          (
            percent
          ) => {

            const howl =
              get().howl;

            if (!howl)
              return;

            const duration =
              howl.duration();

            howl.seek(
              (percent / 100) *
              duration
            );

            set({
              progress:
                percent,
            });
          },

        /* =========================================
           ⏭ NEXT TRACK
        ========================================= */

        playNext:
          () => {

            const {

              queue,

              currentIndex,

              shuffle,

            } = get();

            if (!queue.length)
              return;

            let nextIndex;

            if (shuffle) {

              nextIndex =
                Math.floor(
                  Math.random() *
                  queue.length
                );

            } else {

              nextIndex =
                (currentIndex + 1) %
                queue.length;
            }

            const nextTrack =
              queue[nextIndex];

            get().playTrack(
              nextTrack,
              queue
            );
          },

        /* =========================================
           ⏮ PREVIOUS TRACK
        ========================================= */

        playPrevious:
          () => {

            const {

              queue,

              currentIndex,

            } = get();

            if (!queue.length)
              return;

            const prevIndex =

              currentIndex === 0

                ? queue.length - 1

                : currentIndex - 1;

            const prevTrack =
              queue[prevIndex];

            get().playTrack(
              prevTrack,
              queue
            );
          },

        /* =========================================
           ❤️ LIKE SONG
        ========================================= */

        toggleLike:
          (
            songId
          ) =>

            set((state) => {

              const exists =

                state.likedSongs.includes(
                  songId
                );

              return {

                likedSongs:

                  exists

                    ? state.likedSongs.filter(
                        (id) =>
                          id !== songId
                      )

                    : [
                        ...state.likedSongs,
                        songId,
                      ],
              };
            }),

        /* =========================================
           🕘 RECENTLY PLAYED
        ========================================= */

        addRecentlyPlayed:
          (
            track
          ) =>

            set((state) => ({

              recentlyPlayed: [

                track,

                ...state.recentlyPlayed.filter(

                  (t) =>

                    (
                      t._id ||
                      t.id
                    ) !==

                    (
                      track._id ||
                      track.id
                    )
                ),

              ].slice(0, 25),
            })),

        /* =========================================
           🔊 VOLUME
        ========================================= */

        setVolume:
          (
            volume
          ) => {

            const safe =
              Math.max(
                0,
                Math.min(
                  1,
                  volume
                )
              );

            Howler.volume(
              safe
            );

            get()
              .howl?.volume(
                safe
              );

            set({
              volume:
                safe,
            });
          },

        toggleMute:
          () => {

            const muted =
              !get().muted;

            Howler.mute(
              muted
            );

            set({
              muted,
            });
          },

        /* =========================================
           ⚡ SPEED
        ========================================= */

        setSpeed:
          (
            speed
          ) => {

            get()
              .howl?.rate(
                speed
              );

            set({
              speed,
            });
          },

        /* =========================================
           🔁 MODES
        ========================================= */

        toggleRepeat:
          () =>

            set((state) => ({

              repeat:
                !state.repeat,
            })),

        toggleShuffle:
          () =>

            set((state) => ({

              shuffle:
                !state.shuffle,
            })),

        /* =========================================
           🎬 CINEMA MODE
        ========================================= */

        toggleCinemaMode:
          () =>

            set((state) => ({

              cinemaMode:
                !state.cinemaMode,
            })),

        /* =========================================
           ⚙ AUDIO FLAGS
        ========================================= */

        setBuffering:
          (
            buffering
          ) =>

            set({
              buffering,
            }),

        setAudioReady:
          (
            audioReady
          ) =>

            set({
              audioReady,
            }),

        setAutoplay:
          (
            autoplay
          ) =>

            set({
              autoplay,
            }),

        /* =========================================
           🪟 UI
        ========================================= */

        setQueueOpen:
          (
            queueOpen
          ) =>

            set({
              queueOpen,
            }),

        setLyricsOpen:
          (
            lyricsOpen
          ) =>

            set({
              lyricsOpen,
            }),

        /* =========================================
           🧹 RESET PLAYER
        ========================================= */

        resetPlayer:
          () => {

            get()
              .howl?.unload();

            set({

              currentTrack:
                null,

              queue: [],

              howl:
                null,

              isPlaying:
                false,

              progress:
                0,

              duration:
                0,

              buffering:
                false,

              audioReady:
                false,
            });
          },
      }),

      {
        name:
          "beatflow-player",
      }
    )
  );