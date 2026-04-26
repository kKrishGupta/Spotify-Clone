import {
  Heart,
  ListMusic,
  Maximize2,
  Pause,
  Play,
  Repeat2,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { usePlayer } from "../../features/player/usePlayer";
import { cn, formatTime } from "../../utils/helpers";

const Player = () => {
  const audioRef = useRef(null);
  const {
    currentSong,
    isPlaying,
    progress,
    duration,
    volume,
    isMuted,
    shuffle,
    repeat,
    togglePlay,
    next,
    previous,
    seek,
    setDuration,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    pause,
  } = usePlayer();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong?.audioUrl) return;

    if (audio.src !== currentSong.audioUrl) {
      audio.src = currentSong.audioUrl;
      audio.load();
    }
  }, [currentSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => pause());
    } else {
      audio.pause();
    }
  }, [isPlaying, pause, currentSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const handleSeek = (event) => {
    const nextProgress = Number(event.target.value);
    seek(nextProgress);

    if (audioRef.current) {
      audioRef.current.currentTime = nextProgress;
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) seek(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || currentSong?.duration || 0);
    }
  };

  const handleEnded = () => {
    if (repeat && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => pause());
      return;
    }

    next();
  };

  if (!currentSong) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-40 lg:left-[20rem] lg:right-6">
      <div className="glass-panel rounded-[1.75rem] px-4 py-3 shadow-glow lg:px-5">
        <div className="grid items-center gap-4 lg:grid-cols-[1fr_1.4fr_1fr]">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={currentSong.cover}
              alt={currentSong.title}
              className="h-14 w-14 rounded-2xl object-cover ring-1 ring-white/15"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">{currentSong.title}</p>
              <p className="truncate text-xs font-medium text-white/50">{currentSong.artist}</p>
            </div>
            <button className="ml-auto hidden text-white/55 transition duration-300 hover:scale-110 hover:text-beatPink sm:block">
              <Heart className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={toggleShuffle}
                className={cn(
                  "hidden text-white/55 transition duration-300 hover:text-white md:block",
                  shuffle && "text-beatPink",
                )}
              >
                <Shuffle className="h-5 w-5" />
              </button>
              <button
                onClick={previous}
                className="text-white/70 transition duration-300 hover:scale-110 hover:text-white"
              >
                <SkipBack className="h-6 w-6" fill="currentColor" />
              </button>
              <button
                onClick={togglePlay}
                className="grid h-12 w-12 place-items-center rounded-full bg-white text-night shadow-glow transition duration-300 hover:scale-105"
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" fill="currentColor" />
                ) : (
                  <Play className="ml-0.5 h-6 w-6" fill="currentColor" />
                )}
              </button>
              <button
                onClick={next}
                className="text-white/70 transition duration-300 hover:scale-110 hover:text-white"
              >
                <SkipForward className="h-6 w-6" fill="currentColor" />
              </button>
              <button
                onClick={toggleRepeat}
                className={cn(
                  "hidden text-white/55 transition duration-300 hover:text-white md:block",
                  repeat && "text-beatPink",
                )}
              >
                <Repeat2 className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-medium text-white/45">
              <span className="w-9 text-right">{formatTime(progress)}</span>
              <input
                aria-label="Seek song"
                type="range"
                min="0"
                max={duration || currentSong.duration || 0}
                value={Math.min(progress, duration || currentSong.duration || 0)}
                onChange={handleSeek}
                className="h-1 flex-1 cursor-pointer accent-beatPink"
              />
              <span className="w-9">{formatTime(duration || currentSong.duration)}</span>
            </div>
          </div>

          <div className="hidden items-center justify-end gap-4 lg:flex">
            <button className="text-white/55 transition duration-300 hover:text-white">
              <ListMusic className="h-5 w-5" />
            </button>
            <button
              onClick={toggleMute}
              className="text-white/55 transition duration-300 hover:text-white"
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
            <input
              aria-label="Volume"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(event) => setVolume(Number(event.target.value))}
              className="h-1 w-28 cursor-pointer accent-beatPink"
            />
            <button className="text-white/55 transition duration-300 hover:text-white">
              <Maximize2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
        />
      </div>
    </div>
  );
};

export default Player;
