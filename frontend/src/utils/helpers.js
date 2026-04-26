export const cn = (...classes) => classes.filter(Boolean).join(" ");

export const formatTime = (value = 0) => {
  if (!Number.isFinite(value)) return "0:00";

  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${seconds}`;
};

export const getInitials = (name = "BeatFlow") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export const getRoleHome = (role = "user") => {
  if (role === "admin") return "/admin";
  if (role === "artist") return "/artist";
  return "/";
};

export const delay = (ms = 260) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });

export const normalizeSong = (song) => ({
  id: song.id || song._id || song.title,
  title: song.title || song.name || "Untitled Track",
  artist: song.artist || song.artistName || "BeatFlow Artist",
  album: song.album || "Single",
  duration: Number(song.duration) || 210,
  plays: song.plays || "--",
  likes: song.likes || "--",
  cover: song.cover || song.coverUrl || song.image,
  audioUrl: song.audioUrl || song.previewUrl || song.uri || song.url,
  accent: song.accent || "from-beatPurple via-beatPink to-slate-950",
});
