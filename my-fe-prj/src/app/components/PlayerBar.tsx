import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle } from "lucide-react";
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

  useEffect(() => {
    if (audioRef.current && currentSong?.audioUrl) {
      audioRef.current.src = currentSong.audioUrl;
      if (isPlaying) {
        audioRef.current.play().catch(err => console.error("Playback error:", err));
      }

      // Increment listen count in backend
      const incrementListen = async () => {
        try {
          await fetch(`http://localhost:8000/api/songs/listen/${currentSong.id}`, {
            method: "POST"
          });
        } catch (err) {
          console.error("Failed to increment listen count:", err);
        }
      };
      incrementListen();
    }
  }, [currentSong]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => console.error("Playback error:", err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

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

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (isRepeat && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      onNext();
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
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
    setIsMuted(!isMuted);
  };

  if (!currentSong) {
    return (
      <div className="h-24 bg-zinc-950 border-t border-zinc-800 flex items-center justify-center">
        <p className="text-zinc-500">Select a song to play</p>
      </div>
    );
  }

  return (
    <div className="h-24 bg-zinc-950 border-t border-zinc-800 px-4 flex items-center justify-between">
      <div className="flex items-center gap-4 w-1/4">
        <img
          src={currentSong.coverUrl}
          alt={currentSong.title}
          className="w-14 h-14 rounded"
        />
        <div className="min-w-0">
          <p className="text-white truncate">{currentSong.title}</p>
          <p className="text-sm text-zinc-400 truncate">{currentSong.artist}</p>
        </div>
      </div>

      <div className="flex-1 max-w-2xl">
        <div className="flex items-center justify-center gap-4 mb-2">
          <button
            onClick={() => setIsShuffle(!isShuffle)}
            className={`p-2 rounded-full transition-colors ${isShuffle ? "text-green-500" : "text-zinc-400 hover:text-white"
              }`}
          >
            <Shuffle size={18} />
          </button>
          <button
            onClick={onPrevious}
            className="p-2 text-zinc-400 hover:text-white transition-colors"
          >
            <SkipBack size={20} />
          </button>
          <button
            onClick={togglePlayPause}
            className="bg-white text-black rounded-full p-3 hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
          </button>
          <button
            onClick={onNext}
            className="p-2 text-zinc-400 hover:text-white transition-colors"
          >
            <SkipForward size={20} />
          </button>
          <button
            onClick={() => setIsRepeat(!isRepeat)}
            className={`p-2 rounded-full transition-colors ${isRepeat ? "text-green-500" : "text-zinc-400 hover:text-white"
              }`}
          >
            <Repeat size={18} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 w-10 text-right">
            {formatTime(currentTime)}
          </span>
          <div
            ref={progressRef}
            onClick={handleProgressClick}
            className="flex-1 h-1 bg-zinc-700 rounded-full cursor-pointer group"
          >
            <div
              className="h-full bg-white rounded-full relative group-hover:bg-green-500 transition-colors"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <span className="text-xs text-zinc-400 w-10">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 w-1/4 justify-end">
        <button onClick={toggleMute} className="text-zinc-400 hover:text-white">
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <input
          type="range"
          min="0"
          max="100"
          value={isMuted ? 0 : volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-24 h-1 bg-zinc-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
        />
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
