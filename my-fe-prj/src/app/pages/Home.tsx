import { useOutletContext } from "react-router";
import { SongCard } from "../components/SongCard";
import { mockSongs, Song } from "../data/mockData";

interface OutletContext {
  onSongSelect: (song: Song) => void;
}

export function Home() {
  const { onSongSelect } = useOutletContext<OutletContext>();
  const featuredSongs = mockSongs.slice(0, 4);
  const recentlyPlayed = mockSongs.slice(2, 6);

  return (
    <div className="p-6">
      <section className="mb-8">
        <h2 className="text-3xl text-white mb-6">Good evening</h2>
        <div className="grid grid-cols-2 gap-4">
          {featuredSongs.map((song) => (
            <button
              key={song.id}
              onClick={() => onSongSelect(song)}
              className="bg-zinc-800/50 rounded flex items-center gap-4 hover:bg-zinc-700/50 transition-all group overflow-hidden"
            >
              <img
                src={song.coverUrl}
                alt={song.title}
                className="w-20 h-20 object-cover"
              />
              <span className="text-white truncate">{song.title}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl text-white">Recently Played</h2>
          <button className="text-sm text-zinc-400 hover:text-white transition-colors">
            See all
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {recentlyPlayed.map((song) => (
            <SongCard key={song.id} song={song} onPlay={onSongSelect} />
          ))}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl text-white">Made for You</h2>
          <button className="text-sm text-zinc-400 hover:text-white transition-colors">
            See all
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {mockSongs.map((song) => (
            <SongCard key={song.id} song={song} onPlay={onSongSelect} />
          ))}
        </div>
      </section>
    </div>
  );
}
