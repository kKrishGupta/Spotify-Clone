const youtubesearchapi = require("youtube-search-api");

const fetchIndianSongs = async () => {
  try {
    const queries = [
      "bollywood songs",
      "arijit singh",
      "bhajan songs",
      "hindi romantic songs",
      "punjabi songs"
    ];

    let results = [];

    for (const q of queries) {
      const res = await youtubesearchapi.GetListByKeyword(q, false, 10);
      results.push(...res.items);
    }

    return results.map((song) => ({
      id: `yt-${song.id}`,
      title: song.title,
      artist: song.channelTitle,
      cover: song.thumbnail?.thumbnails?.[0]?.url,
      uri: `https://www.youtube.com/watch?v=${song.id}`,
      source: "youtube",
    }));

  } catch (err) {
    console.log("YouTube fetch error:", err.message);
    return [];
  }
};

module.exports = { fetchIndianSongs };