import { MoreVertical, Pause, Play } from "lucide-react";
import { usePlayer } from "../../features/player/usePlayer";
import { cn } from "../../utils/helpers";

const SongCard = ({ song, queue = [], className = "", compact = false }) => {
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayer();
  const isActive = currentSong?.id === song.id;

  const handlePlay = () => {
    if (isActive) {
      togglePlay();
      return;
    }

    playSong(song, queue.length ? queue : [song]);
  };

  return (
    <article
      onClick={handlePlay}
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-white/[0.055] p-3 shadow-soft backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-beatPink/40 hover:shadow-glow",
        isActive && "border-beatPink/60 shadow-glow",
        className,
      )}
    >
      <div className={cn("relative overflow-hidden rounded-2xl", compact ? "aspect-[1.35]" : "aspect-square")}>
        <img
          src={song.cover}
          alt={song.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
        <div className={cn("absolute inset-0 bg-gradient-to-t opacity-60", song.accent)} />
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            handlePlay();
          }}
          className="absolute bottom-3 right-3 grid h-10 w-10 translate-y-3 place-items-center rounded-full bg-white text-night opacity-0 shadow-glow transition duration-300 group-hover:translate-y-0 group-hover:opacity-100"
        >
          {isActive && isPlaying ? (
            <Pause className="h-5 w-5" fill="currentColor" />
          ) : (
            <Play className="ml-0.5 h-5 w-5" fill="currentColor" />
          )}
        </button>
      </div>

      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold text-white">{song.title}</h3>
          <p className="mt-1 truncate text-xs font-medium text-white/50">{song.artist}</p>
        </div>
        <button
          type="button"
          onClick={(event) => event.stopPropagation()}
          className="text-white/35 transition duration-300 hover:text-white"
        >
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>
    </article>
  );
};

export default SongCard;
