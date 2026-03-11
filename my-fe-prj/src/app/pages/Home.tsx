import { useMemo } from "react";
import { API_URL } from "../apiConfig";
import { Sunrise, Sun, Moon } from "lucide-react";
import { useOutletContext } from "react-router";
import { SongCard } from "../components/SongCard";
import { Song } from "../data/mockData";
import { useQuery } from "@tanstack/react-query";

interface OutletContext {
  onSongSelect: (song: Song) => void;
}

const mapSong = (s: any): Song => ({
  id: s._id,
  title: s.title,
  artist:
    typeof s.artist === "object"
      ? s.artist.name
      : s.artist || "Unknown Artist",
  album: s.album || "Single",
  duration: s.duration
    ? `${Math.floor(s.duration / 60)}:${Math.floor(s.duration % 60)
      .toString()
      .padStart(2, "0")}`
    : "0:00",
  coverUrl:
    s.coverUrl ||
    "https://res.cloudinary.com/dywwla9mp/image/upload/v1/default-song.png",
  audioUrl: s.fileUrl,
});

const fetchSongs = async (): Promise<Song[]> => {
  const response = await fetch(`${API_URL}/songs/popular?limit=12`);

  if (!response.ok) throw new Error("Network error");

  const data = await response.json();

  return (data || []).map(mapSong);
};

const fetchHistory = async (): Promise<Song[]> => {
  const token = localStorage.getItem("token");
  if (!token) return [];

  const response = await fetch(`${API_URL}/auth/history`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) return [];

  const data = await response.json();

  return (data || [])
    .map((item: any) => (item.song ? mapSong(item.song) : null))
    .filter(Boolean);
};

export function Home() {
  const { onSongSelect } = useOutletContext<OutletContext>();

  const { data: songs = [], isLoading: loading } = useQuery<Song[]>({
    queryKey: ["popularSongs"],
    queryFn: fetchSongs,
    staleTime: 1000 * 60 * 5,
  });

  const { data: historySongs = [] } = useQuery<Song[]>({
    queryKey: ["history"],
    queryFn: fetchHistory,
    staleTime: 1000 * 30,
  });

  const { text: greeting, subtext: greetingSubtext, icon: greetingIcon } =
    useMemo(() => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12)
        return {
          text: "Good morning",
          subtext: "Ready to start your day with some music?",
          icon: <Sunrise size={40} className="text-amber-400" />,
        };

      if (hour >= 12 && hour < 18)
        return {
          text: "Good afternoon",
          subtext: "Time for a musical break and some fresh tunes?",
          icon: <Sun size={40} className="text-yellow-400" />,
        };

      return {
        text: "Good evening",
        subtext: "Relax and unwind with your favorite collection.",
        icon: <Moon size={40} className="text-indigo-400" />,
      };
    }, []);

  const featuredSongs = songs.slice(0, 4);
  const recentlyPlayed = historySongs.slice(0, 6);

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
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* UI giữ nguyên hoàn toàn */}

      {/* Greeting */}
      <section className="mb-8 p-6 bg-gradient-to-br from-zinc-900/80 to-zinc-950 border border-white/5 rounded-[32px] shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-5 mb-8">
          <div className="bg-zinc-800/50 p-4 rounded-2xl border border-white/5 shadow-inner">
            {greetingIcon}
          </div>

          <div>
            <h2 className="text-4xl font-black text-white tracking-tighter mb-1">
              {greeting}
            </h2>

            <p className="text-zinc-400 font-medium tracking-wide">
              {greetingSubtext}
            </p>
          </div>
        </div>

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

              <span className="text-white truncate font-medium">
                {song.title}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Recently Played */}
      <section className="mb-8">
        <h2 className="text-2xl text-white mb-4">Recently Played</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {recentlyPlayed.map((song) => (
            <SongCard key={song.id} song={song} onPlay={onSongSelect} />
          ))}
        </div>
      </section>

      {/* Made for You */}
      <section>
        <h2 className="text-2xl text-white mb-4">Made for You</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {songs.map((song) => (
            <SongCard key={song.id} song={song} onPlay={onSongSelect} />
          ))}
        </div>
      </section>
    </div>
  );
}