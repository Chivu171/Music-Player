import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle } from "lucide-react";
import { API_URL } from "../apiConfig";
import { Song } from "../data/mockData";

interface PlayerBarProps {
  currentSong: Song | null;
  onNext: () => void;
  onPrevious: () => void;
}

export function PlayerBar({ currentSong, onNext, onPrevious }: PlayerBarProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // LOAD SONG
  useEffect(() => {
    if (audioRef.current && currentSong?.audioUrl) {
      audioRef.current.src = currentSong.audioUrl;
      setIsPlaying(true);
      audioRef.current.play().catch(err => console.error("Playback error:", err));

      const incrementListen = async () => {
        try {
          await fetch(`${API_URL}/songs/listen/${currentSong.id}`, {
            method: "POST"
          });
        } catch (err) {
          console.error("Failed to increment listen count:", err);
        }
      };

      incrementListen();
    }
  }, [currentSong]);

  // PLAY / PAUSE
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play().catch(err => console.error(err));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // VOLUME
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // END SONG
  const handleEnded = () => {
    if (isRepeat) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      return;
    }

    if (isShuffle) {
      onNext(); // Layout xử lý random nếu cần
      return;
    }

    onNext();
  };

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && audioRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      const newTime = percentage * duration;

      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 bg-zinc-950/90 backdrop-blur-2xl border-t border-white/5 px-6 flex items-center justify-between z-50 shadow-2xl">

      {/* Left */}
      <div className="flex items-center gap-4 w-1/3 group">
        <div className="relative overflow-hidden rounded-lg shadow-lg shadow-black/40">
          <img
            src={currentSong.coverUrl}
            alt={currentSong.title}
            className="w-14 h-14 object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
        </div>
        <div className="min-w-0 pr-4">
          <p className="text-white font-semibold truncate hover:text-purple-400 transition-colors cursor-pointer">
            {currentSong.title}
          </p>
          <p className="text-xs text-zinc-400 truncate mt-0.5 hover:text-zinc-300 transition-colors cursor-pointer">
            {currentSong.artist}
          </p>
        </div>
      </div>

      {/* Center */}
      <div className="flex-1 max-w-2xl flex flex-col items-center">

        <div className="flex items-center gap-6 mb-3">

          <button
            onClick={() => setIsShuffle(prev => !prev)}
            className={`p-1.5 rounded-full transition-all duration-300 hover:scale-110 ${isShuffle
                ? "text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]"
                : "text-zinc-500 hover:text-zinc-300"
              }`}
          >
            <Shuffle size={18} strokeWidth={2.5} />
          </button>

          <button
            onClick={onPrevious}
            className="p-1.5 text-zinc-400 hover:text-white transition-all duration-200 hover:scale-110 active:scale-90"
          >
            <SkipBack size={22} fill="currentColor" />
          </button>

          <button
            onClick={togglePlayPause}
            className="w-12 h-12 flex items-center justify-center bg-white text-black rounded-full shadow-xl shadow-white/10 hover:scale-110 active:scale-95 transition-all duration-300 group/play"
          >
            {isPlaying ? (
              <Pause size={22} fill="currentColor" />
            ) : (
              <Play size={22} fill="currentColor" className="ml-1" />
            )}
          </button>

          <button
            onClick={onNext}
            className="p-1.5 text-zinc-400 hover:text-white transition-all duration-200 hover:scale-110 active:scale-90"
          >
            <SkipForward size={22} fill="currentColor" />
          </button>

          <button
            onClick={() => setIsRepeat(prev => !prev)}
            className={`p-1.5 rounded-full transition-all duration-300 hover:scale-110 ${isRepeat
                ? "text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.5)]"
                : "text-zinc-500 hover:text-zinc-300"
              }`}
          >
            <Repeat size={18} strokeWidth={2.5} />
          </button>

        </div>

        <div className="w-full flex items-center gap-3">
          <span className="text-[10px] font-medium text-zinc-500 tabular-nums w-10 text-right">
            {formatTime(currentTime)}
          </span>

          <div
            ref={progressRef}
            onClick={handleProgressClick}
            className="flex-1 h-1.5 bg-zinc-800/80 rounded-full cursor-pointer group relative overflow-hidden"
          >
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 rounded-full group-hover:h-full transition-all duration-200"
              style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
            />
          </div>

          <span className="text-[10px] font-medium text-zinc-500 tabular-nums w-10">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 w-1/3 justify-end pr-2">

        <button
          onClick={toggleMute}
          className="text-zinc-400 hover:text-white transition-colors duration-200"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>

        <div className="w-28 relative h-1.5 bg-zinc-800 rounded-full">
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
          />

          <div
            className="absolute inset-y-0 left-0 bg-indigo-500 rounded-full"
            style={{ width: `${isMuted ? 0 : volume}%` }}
          />
        </div>

      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

    </div>
  );
}