import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";
import { SongCard } from "../components/SongCard";
import { mockSongs, Song } from "../data/mockData";

interface OutletContext {
  onSongSelect: (song: Song) => void;
}

export function Home() {
  const { onSongSelect } = useOutletContext<OutletContext>();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/songs/getsongs?page=1&limit=12');
        const data = await response.json();

        const mappedSongs: Song[] = (data.songs || []).map((s: any) => ({
          id: s._id,
          title: s.title,
          artist: typeof s.artist === 'object' ? s.artist.name : (s.artist || "Unknown Artist"),
          album: s.album || "Single",
          duration: s.duration ? `${Math.floor(s.duration / 60)}:${Math.floor(s.duration % 60).toString().padStart(2, '0')}` : "0:00",
          coverUrl: s.coverUrl || "https://res.cloudinary.com/dywwla9mp/image/upload/v1/default-song.png",
          audioUrl: s.fileUrl
        }));

        setSongs(mappedSongs);
      } catch (err) {
        console.error("Failed to fetch songs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, []);

  const featuredSongs = songs.slice(0, 4);
  const recentlyPlayed = songs.slice(0, 6); // Mocking recently played with random DB songs as requested

  if (loading) {
    return (
      <div className="p-6 animate-pulse">
        <section className="mb-8">
          <div className="h-10 w-48 bg-zinc-800 rounded-lg mb-6" />
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-zinc-800/50 rounded-lg" />
            ))}
          </div>
        </section>
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="h-8 w-40 bg-zinc-800 rounded-lg" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="aspect-square bg-zinc-800/50 rounded-lg" />
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="p-6">
      <section className="mb-8">
        <h2 className="text-3xl text-white mb-6">Good evening</h2>
        {featuredSongs.length > 0 ? (
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
                <span className="text-white truncate font-medium">{song.title}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="h-20 flex items-center justify-center bg-zinc-800/20 rounded-xl border border-white/5 text-zinc-500 text-sm">
            No songs discovered yet.
          </div>
        )}
      </section>

      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl text-white">Recently Played</h2>
          <button className="text-sm text-zinc-400 hover:text-white transition-colors font-medium">
            See all
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {recentlyPlayed.length > 0 ? (
            recentlyPlayed.map((song) => (
              <SongCard key={song.id} song={song} onPlay={onSongSelect} />
            ))
          ) : (
            <div className="col-span-full h-40 flex items-center justify-center bg-zinc-800/20 rounded-xl border border-white/5 text-zinc-500 text-sm">
              Start listening to see your history.
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl text-white">Made for You</h2>
          <button className="text-sm text-zinc-400 hover:text-white transition-colors font-medium">
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
