import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle
} from "lucide-react";
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

  // load new song
  useEffect(() => {
    if (!audioRef.current || !currentSong?.audioUrl) return;

    audioRef.current.src = currentSong.audioUrl;
    audioRef.current.currentTime = 0;

    setCurrentTime(0);
    setIsPlaying(true);

    audioRef.current.play().catch(err => console.error("Playback error:", err));

    const incrementListen = async () => {
      try {
        await fetch(`${API_URL}/songs/listen/${currentSong.id}`, {
          method: "POST"
        });
      } catch (err) {
        console.error("Listen increment failed:", err);
      }
    };

    incrementListen();
  }, [currentSong]);

  // play / pause
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play().catch(err => console.error(err));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // volume
  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.volume = isMuted ? 0 : volume / 100;
  }, [volume, isMuted]);

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  };

  const handleEnded = () => {
    if (isRepeat && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      return;
    }

    setIsPlaying(false);
    onNext();
  };

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !audioRef.current || !duration) return;

    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;

    const newTime = percentage * duration;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (sec: number) => {
    if (!sec) return "0:00";

    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);

    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!currentSong) return null;

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 bg-zinc-950/90 backdrop-blur-xl border-t border-white/5 px-6 flex items-center justify-between z-50">

      {/* song info */}
      <div className="flex items-center gap-4 w-1/3">
        <img
          src={currentSong.coverUrl}
          className="w-14 h-14 object-cover rounded"
        />

        <div className="min-w-0">
          <p className="text-white font-semibold truncate">
            {currentSong.title}
          </p>

          <p className="text-xs text-zinc-400 truncate">
            {currentSong.artist}
          </p>
        </div>
      </div>

      {/* controls */}
      <div className="flex-1 max-w-xl flex flex-col items-center">

        <div className="flex items-center gap-6 mb-3">

          <button
            onClick={() => setIsShuffle(p => !p)}
            className={isShuffle ? "text-green-400" : "text-zinc-400"}
          >
            <Shuffle size={18} />
          </button>

          <button onClick={onPrevious}>
            <SkipBack size={22} />
          </button>

          <button
            onClick={togglePlayPause}
            className="w-11 h-11 bg-white text-black rounded-full flex items-center justify-center"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
          </button>

          <button onClick={onNext}>
            <SkipForward size={22} />
          </button>

          <button
            onClick={() => setIsRepeat(p => !p)}
            className={isRepeat ? "text-purple-400" : "text-zinc-400"}
          >
            <Repeat size={18} />
          </button>

        </div>

        {/* progress */}
        <div className="w-full flex items-center gap-3">

          <span className="text-xs text-zinc-400 w-10 text-right">
            {formatTime(currentTime)}
          </span>

          <div
            ref={progressRef}
            onClick={handleProgressClick}
            className="flex-1 h-1.5 bg-zinc-800 rounded cursor-pointer"
          >
            <div
              className="h-full bg-indigo-500 rounded"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <span className="text-xs text-zinc-400 w-10">
            {formatTime(duration)}
          </span>

        </div>
      </div>

      {/* volume */}
      <div className="flex items-center gap-3 w-1/3 justify-end">

        <button onClick={toggleMute}>
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>

        <input
          type="range"
          min="0"
          max="100"
          value={isMuted ? 0 : volume}
          onChange={e => setVolume(Number(e.target.value))}
          className="w-24"
        />

      </div>

      <audio
        ref={audioRef}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

    </div>
  );
}