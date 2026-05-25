import {
  apiClient,
} from "@/lib/apiClient";

export const musicService = {

  /* =========================================
     🚀 EXPLORE PAGE DATA
  ========================================= */

  getExplore:
    async () => {

      const response =
        await apiClient.get(
          "/music"
        );

      const songs =

        response?.musics ||

        response?.data?.musics ||

        response?.songs ||

        [];

      return {

        heroTrack:
          songs[0] || null,

        trending:
          songs,

        recommended:
          songs.slice(0, 8),

        latest:
          songs.slice(0, 12),

        liveRooms: [],
      };
    },

  /* =========================================
     📚 USER LIBRARY
  ========================================= */

  getLibrary:
    async () => {

      const response =
        await apiClient.get(
          "/music/library"
        );

      return {

        saved:

          response?.saved ||

          response?.data?.saved ||

          [],

        liked:

          response?.liked ||

          response?.data?.liked ||

          [],

        recent:

          response?.recent ||

          response?.data?.recent ||

          [],

        downloads:

          response?.downloads ||

          response?.data?.downloads ||

          [],

        playlists:

          response?.playlists ||

          response?.data?.playlists ||

          [],

        smartCollections: [

          "Liked Songs",

          "Night Vibes",

          "AI Discoveries",

          "Workout Mix",

          "Chill Realtime",
        ],
      };
    },

  /* =========================================
     ▶ TRACK PLAY
  ========================================= */

  trackPlay:
    async (id) => {

      if (!id) {
        return null;
      }

      return await apiClient.put(
        `/music/play/${id}`
      );
    },

  /* =========================================
     ❤️ LIKE SONG
  ========================================= */

  likeSong:
    async (id) => {

      if (!id) {
        return null;
      }

      return await apiClient.put(
        `/music/like/${id}`
      );
    },

  /* =========================================
     🔎 SEARCH SONGS
  ========================================= */

  searchSongs:
    async (query) => {

      if (!query?.trim()) {

        return {
          songs: [],
        };
      }

      return await apiClient.get(

        `/music/search?query=${encodeURIComponent(
          query
        )}`
      );
    },

  /* =========================================
     🎵 GET ALL SONGS
  ========================================= */

  getAllSongs:
    async () => {

      return await apiClient.get(
        "/music"
      );
    },

  /* =========================================
     🎧 GET SONG BY ID
  ========================================= */

  getSongById:
    async (id) => {

      return await apiClient.get(
        `/music/${id}`
      );
    },

  /* =========================================
     🔥 TRENDING SONGS
  ========================================= */

  getTrendingSongs:
    async () => {

      return await apiClient.get(
        "/music/trending"
      );
    },

  /* =========================================
     🤖 AI RECOMMENDATIONS
  ========================================= */

  getRecommendations:
    async () => {

      return await apiClient.get(
        "/music/recommendations"
      );
    },

  /* =========================================
     🎤 ARTIST SONGS
  ========================================= */

  getArtistSongs:
    async (artistId) => {

      return await apiClient.get(
        `/music/artist/${artistId}`
      );
    },

  /* =========================================
     😊 MOOD SONGS
  ========================================= */

  getSongsByMood:
    async (mood) => {

      return await apiClient.get(

        `/music/mood/${encodeURIComponent(
          mood
        )}`
      );
    },

  /* =========================================
     🌍 LANGUAGE SONGS
  ========================================= */

  getSongsByLanguage:
    async (language) => {

      return await apiClient.get(

        `/music/language/${encodeURIComponent(
          language
        )}`
      );
    },

  /* =========================================
     🎼 GENRE SONGS
  ========================================= */

  getSongsByGenre:
    async (genre) => {

      return await apiClient.get(

        `/music/genre/${encodeURIComponent(
          genre
        )}`
      );
    },

  /* =========================================
     ⬆ UPLOAD SONG
  ========================================= */

  uploadSong:
    async (formData) => {

      return await apiClient.post(

        "/music/upload",

        formData,

        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );
    },

  /* =========================================
     ✏ UPDATE SONG
  ========================================= */

  updateSong:
    async (
      id,
      payload
    ) => {

      return await apiClient.put(

        `/music/${id}`,

        payload
      );
    },

  /* =========================================
     🗑 DELETE SONG
  ========================================= */

  deleteSong:
    async (id) => {

      return await apiClient.delete(
        `/music/${id}`
      );
    },
};