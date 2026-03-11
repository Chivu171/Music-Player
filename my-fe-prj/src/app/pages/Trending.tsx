import { useEffect, useState } from "react";
import { API_URL } from "../apiConfig";
import { useOutletContext } from "react-router";
import { TrendingUp, Play, Heart, MoreHorizontal, Loader2, Music2, User as UserIcon } from "lucide-react";
import { Song } from "../data/mockData";

interface OutletContext {
  onSongSelect: (song: Song) => void;
}

interface TrendingArtist {
  _id: string;
  name: string;
  imageUrl?: string;
  weeklyListenCount: number;
}

export function Trending() {
  const { onSongSelect } = useOutletContext<OutletContext>();
  const [trendingSongs, setTrendingSongs] = useState<Song[]>([]);
  const [trendingArtists, setTrendingArtists] = useState<TrendingArtist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [songsRes, artistsRes] = await Promise.all([
          fetch(`${API_URL}/songs/trending?limit=10`),
          fetch(`${API_URL}/artists/trending?limit=6`)
        ]);

        const songsData = await songsRes.json();
        const artistsData = await artistsRes.json();

        const mappedSongs: Song[] = (songsData || []).map((s: any) => ({
          id: s._id,
          title: s.title,
          artist: typeof s.artist === 'object' ? s.artist.name : (s.artist || "Unknown Artist"),
          album: s.album || "Single",
          duration: s.duration ? `${Math.floor(s.duration / 60)}:${Math.floor(s.duration % 60).toString().padStart(2, '0')}` : "0:00",
          coverUrl: s.coverUrl || "https://res.cloudinary.com/dywwla9mp/image/upload/v1/default-song.png",
          audioUrl: s.fileUrl,
          weeklyListen: s.weeklyListen || 0
        }));

        setTrendingSongs(mappedSongs);
        setTrendingArtists(artistsData || []);
      } catch (err) {
        console.error("Failed to fetch trending data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-green-500" size={40} />
      </div>
    );
  }

  const top3 = trendingSongs.slice(0, 3);

  return (
    <div className="p-6">
      {/* Hero Section */}
      <div className="relative h-80 rounded-3xl overflow-hidden mb-8 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 shadow-2xl">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        <div className="relative h-full flex items-end p-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-500 p-2 rounded-lg shadow-lg shadow-green-500/20">
                <TrendingUp size={24} className="text-black" />
              </div>
              <span className="text-sm font-black uppercase tracking-[0.2em] text-zinc-300">Global Chart</span>
            </div>
            <h1 className="text-7xl font-black text-white mb-4 tracking-tighter italic">Weekly Top 40</h1>
            <p className="text-zinc-300 text-lg mb-8 font-medium">Discover the most played tracks from the last 7 days. Updated in real-time.</p>
            <button
              onClick={() => top3.length > 0 && onSongSelect(top3[0])}
              className="bg-white text-black px-10 py-4 rounded-full font-black hover:bg-green-500 transition-all hover:scale-105 flex items-center gap-3 shadow-xl"
            >
              <Play size={24} fill="currentColor" />
              Listen Now
            </button>
          </div>
        </div>
      </div>

      {/* Top 3 Trending */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-black text-white tracking-tight">Top Trending This Week</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {top3.map((song, index) => (
            <div
              key={song.id}
              className="relative bg-zinc-900/40 border border-white/5 rounded-3xl p-6 hover:bg-zinc-800/60 transition-all cursor-pointer group shadow-xl"
              onClick={() => onSongSelect(song)}
            >
              <div className="absolute top-4 right-6 text-7xl font-black text-white/5 italic">
                {index + 1}
              </div>
              <div className="flex gap-6 items-center">
                <div className="relative flex-shrink-0">
                  <img
                    src={song.coverUrl}
                    alt={song.title}
                    className="w-28 h-28 rounded-2xl object-cover shadow-2xl group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                    <Play size={32} className="text-white fill-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl font-black text-white mb-1 truncate tracking-tight">{song.title}</h3>
                  <p className="text-zinc-400 font-bold">{song.artist}</p>
                  <div className="flex items-center gap-2 mt-3 bg-green-500/10 w-fit px-3 py-1 rounded-full border border-green-500/20">
                    <TrendingUp size={14} className="text-green-500" />
                    <span className="text-xs font-black text-green-500 uppercase tracking-wider">
                      {(song as any).weeklyListen} plays
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Table */}
      <section className="mb-12">
        <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-widest text-zinc-500 border-b border-white/5 pb-4">Full Chart</h2>
        <div className="bg-zinc-900/20 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-sm">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-white/5 bg-zinc-900/40">
                <th className="p-6 text-zinc-500 text-xs font-black uppercase tracking-widest w-16 text-center">#</th>
                <th className="p-6 text-zinc-500 text-xs font-black uppercase tracking-widest">Track</th>
                <th className="p-6 text-zinc-500 text-xs font-black uppercase tracking-widest hidden md:table-cell">Album</th>
                <th className="p-6 text-zinc-500 text-xs font-black uppercase tracking-widest text-center">Activity</th>
                <th className="p-6 text-zinc-500 text-xs font-black uppercase tracking-widest text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {trendingSongs.map((song, index) => (
                <tr
                  key={song.id}
                  className="group hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => onSongSelect(song)}
                >
                  <td className="p-6 text-center">
                    <span className="text-zinc-500 font-black group-hover:hidden italic">{index + 1}</span>
                    <Play size={16} className="hidden group-hover:inline-block text-green-500 fill-green-500 mx-auto" />
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <img
                        src={song.coverUrl}
                        alt={song.title}
                        className="w-12 h-12 rounded-lg object-cover shadow-lg"
                      />
                      <div className="min-w-0">
                        <p className="text-white font-black truncate tracking-tight">{song.title}</p>
                        <p className="text-sm text-zinc-500 font-bold truncate">{song.artist}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 text-zinc-400 font-bold hidden md:table-cell">{song.album}</td>
                  <td className="p-6 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-800 rounded-full text-xs font-black text-zinc-300">
                      <TrendingUp size={12} className="text-green-500" />
                      {(song as any).weeklyListen}
                    </div>
                  </td>
                  <td className="p-6 text-right text-zinc-500 font-mono text-xs tabular-nums">{song.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {trendingSongs.length === 0 && (
            <div className="p-20 text-center text-zinc-600">
              <Music2 className="mx-auto mb-4 opacity-20" size={64} />
              <p className="text-lg font-bold uppercase tracking-widest">No data available for this period</p>
            </div>
          )}
        </div>
      </section>

      {/* Trending Artists */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-black text-white tracking-tight italic">Top Creators</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {trendingArtists.map((artist) => (
            <div
              key={artist._id}
              className="group bg-zinc-900/40 border border-white/5 p-6 rounded-[32px] hover:bg-zinc-800/60 transition-all cursor-pointer text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-green-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              <div className="relative mb-6">
                {artist.imageUrl ? (
                  <img
                    src={artist.imageUrl}
                    alt={artist.name}
                    className="w-full aspect-square object-cover rounded-full shadow-2xl group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full aspect-square bg-zinc-800 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
                    <UserIcon size={48} className="text-zinc-600" />
                  </div>
                )}
                <div className="absolute bottom-0 right-0 bg-green-500 text-black px-2 py-1 rounded-full text-[10px] font-black shadow-lg">
                  HOT
                </div>
              </div>
              <h3 className="text-white font-black truncate tracking-tighter text-lg">{artist.name}</h3>
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mt-2 group-hover:text-green-500 transition-colors">
                {artist.weeklyListenCount} Weekly Plays
              </p>
            </div>
          ))}
          {trendingArtists.length === 0 && (
            <div className="col-span-full py-12 text-center text-zinc-600">
              <p className="text-xs uppercase font-black tracking-widest">Artist charts are still populating...</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
