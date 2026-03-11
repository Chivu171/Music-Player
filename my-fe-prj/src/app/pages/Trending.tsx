import { API_URL } from "../apiConfig";
import { useQuery } from "@tanstack/react-query";
import { useOutletContext } from "react-router";
import { TrendingUp, Play, Loader2, Music2, User as UserIcon } from "lucide-react";
import { Song } from "../data/mockData";

interface OutletContext {
  onSongSelect: (song: Song, songs: Song[]) => void;
}

interface TrendingArtist {
  _id: string;
  name: string;
  imageUrl?: string;
  weeklyListenCount: number;
}

const fetchTrendingData = async () => {
  const [songsRes, artistsRes] = await Promise.all([
    fetch(`${API_URL}/songs/trending?limit=10`),
    fetch(`${API_URL}/artists/trending?limit=6`)
  ]);

  const songsData = await songsRes.json();
  const artistsData = await artistsRes.json();

  const mappedSongs: Song[] = (songsData || []).map((s: any) => ({
    id: s._id,
    title: s.title,
    artist: typeof s.artist === "object" ? s.artist.name : (s.artist || "Unknown Artist"),
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
    weeklyListen: s.weeklyListen || 0
  }));

  return { songs: mappedSongs, artists: artistsData || [] };
};

export function Trending() {
  const { onSongSelect } = useOutletContext<OutletContext>();

  const { data, isLoading: loading } = useQuery({
    queryKey: ["trending"],
    queryFn: fetchTrendingData,
    staleTime: 1000 * 60 * 10
  });

  const trendingSongs = data?.songs || [];
  const trendingArtists = data?.artists || [];

  const top3 = trendingSongs.slice(0, 3);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-green-500" size={40} />
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* HERO */}
      <div className="relative h-80 rounded-3xl overflow-hidden mb-8 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 shadow-2xl">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

        <div className="relative h-full flex items-end p-10">
          <div className="max-w-2xl">

            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-500 p-2 rounded-lg shadow-lg shadow-green-500/20">
                <TrendingUp size={24} className="text-black" />
              </div>

              <span className="text-sm font-black uppercase tracking-[0.2em] text-zinc-300">
                Global Chart
              </span>
            </div>

            <h1 className="text-7xl font-black text-white mb-4 tracking-tighter italic">
              Weekly Top 40
            </h1>

            <p className="text-zinc-300 text-lg mb-8 font-medium">
              Discover the most played tracks from the last 7 days.
            </p>

            <button
              onClick={() => top3.length > 0 && onSongSelect(top3[0], trendingSongs)}
              className="bg-white text-black px-10 py-4 rounded-full font-black hover:bg-green-500 transition-all hover:scale-105 flex items-center gap-3 shadow-xl"
            >
              <Play size={24} fill="currentColor" />
              Listen Now
            </button>

          </div>
        </div>
      </div>

      {/* TOP 3 */}
      <section className="mb-12">

        <h2 className="text-3xl font-black text-white mb-6">
          Top Trending This Week
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {top3.map((song, index) => (

            <div
              key={song.id}
              className="relative bg-zinc-900/40 border border-white/5 rounded-3xl p-6 hover:bg-zinc-800/60 transition-all cursor-pointer group shadow-xl"
              onClick={() => onSongSelect(song, trendingSongs)}
            >

              <div className="absolute top-4 right-6 text-7xl font-black text-white/5 italic">
                {index + 1}
              </div>

              <div className="flex gap-6 items-center">

                <img
                  src={song.coverUrl}
                  alt={song.title}
                  className="w-28 h-28 rounded-2xl object-cover shadow-2xl"
                />

                <div className="flex-1 min-w-0">

                  <h3 className="text-2xl font-black text-white truncate">
                    {song.title}
                  </h3>

                  <p className="text-zinc-400 font-bold">
                    {song.artist}
                  </p>

                  <div className="flex items-center gap-2 mt-3 bg-green-500/10 w-fit px-3 py-1 rounded-full">

                    <TrendingUp size={14} className="text-green-500" />

                    <span className="text-xs font-black text-green-500">
                      {(song as any).weeklyListen} plays
                    </span>

                  </div>

                </div>
              </div>

            </div>

          ))}

        </div>
      </section>

      {/* TABLE */}
      <section className="mb-12">

        <h2 className="text-2xl font-black text-white mb-6">
          Full Chart
        </h2>

        <div className="bg-zinc-900/20 border border-white/5 rounded-3xl overflow-hidden">

          <table className="w-full">

            <tbody>

              {trendingSongs.map((song, index) => (

                <tr
                  key={song.id}
                  className="group hover:bg-white/5 transition cursor-pointer"
                  onClick={() => onSongSelect(song, trendingSongs)}
                >

                  <td className="p-6 text-center w-16 text-zinc-500 font-bold">
                    {index + 1}
                  </td>

                  <td className="p-6">

                    <div className="flex items-center gap-4">

                      <img
                        src={song.coverUrl}
                        className="w-12 h-12 rounded-lg object-cover"
                      />

                      <div className="min-w-0">

                        <p className="text-white font-bold truncate">
                          {song.title}
                        </p>

                        <p className="text-sm text-zinc-500 truncate">
                          {song.artist}
                        </p>

                      </div>

                    </div>

                  </td>

                  <td className="p-6 text-right text-zinc-500 text-xs">
                    {song.duration}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {trendingSongs.length === 0 && (

            <div className="p-20 text-center text-zinc-600">

              <Music2 className="mx-auto mb-4 opacity-20" size={64} />

              <p>No trending songs yet</p>

            </div>

          )}

        </div>

      </section>

      {/* ARTISTS */}
      <section>

        <h2 className="text-3xl font-black text-white mb-6">
          Top Creators
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">

          {trendingArtists.map((artist: TrendingArtist) => (

            <div
              key={artist._id}
              className="bg-zinc-900/40 border border-white/5 p-6 rounded-[32px] text-center"
            >

              {artist.imageUrl ? (

                <img
                  src={artist.imageUrl}
                  className="w-full aspect-square object-cover rounded-full mb-4"
                />

              ) : (

                <div className="w-full aspect-square bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                  <UserIcon size={40} className="text-zinc-600" />
                </div>

              )}

              <h3 className="text-white font-bold truncate">
                {artist.name}
              </h3>

              <p className="text-xs text-zinc-500">
                {artist.weeklyListenCount} plays
              </p>

            </div>

          ))}

        </div>

      </section>

    </div>
  );
}