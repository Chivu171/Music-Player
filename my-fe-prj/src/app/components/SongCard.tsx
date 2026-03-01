import { Play } from "lucide-react";
import { Song } from "../data/mockData";

interface SongCardProps {
  song: Song;
  onPlay: (song: Song) => void;
}

export function SongCard({ song, onPlay }: SongCardProps) {
  return (
    <div
      onClick={() => onPlay(song)}
      className="bg-zinc-900/50 p-4 rounded-lg hover:bg-zinc-800/50 transition-all cursor-pointer group"
    >
      <div className="relative mb-4">
        <img
          src={song.coverUrl}
          alt={song.title}
          className="w-full aspect-square object-cover rounded-md"
        />
        <button className="absolute bottom-2 right-2 bg-green-500 text-black rounded-full p-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all shadow-lg hover:scale-105">
          <Play size={20} fill="currentColor" />
        </button>
      </div>
      <h3 className="text-white truncate mb-1">{song.title}</h3>
      <p className="text-sm text-zinc-400 truncate">{song.artist}</p>
    </div>
  );
}
