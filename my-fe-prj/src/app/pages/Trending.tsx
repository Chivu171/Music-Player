import { useOutletContext } from "react-router";
import { TrendingUp, Play, Heart, MoreHorizontal } from "lucide-react";
import { mockSongs, Song } from "../data/mockData";
import { SongCard } from "../components/SongCard";

interface OutletContext {
  onSongSelect: (song: Song) => void;
}

export function Trending() {
  const { onSongSelect } = useOutletContext<OutletContext>();

  const topTrending = mockSongs.slice(0, 3);
  const trendingThisWeek = mockSongs;

  return (
    <div className="p-6">
      {/* Hero Section */}
      <div className="relative h-80 rounded-lg overflow-hidden mb-8 bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full flex items-end p-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={24} className="text-green-500" />
              <span className="text-sm uppercase tracking-wider text-zinc-300">Playlist</span>
            </div>
            <h1 className="text-6xl text-white mb-4">Trending Now</h1>
            <p className="text-zinc-300 mb-6">The hottest tracks right now • Updated daily</p>
            <button className="bg-green-500 text-black px-8 py-3 rounded-full hover:bg-green-400 transition-all hover:scale-105 flex items-center gap-2">
              <Play size={20} fill="currentColor" />
              Play All
            </button>
          </div>
        </div>
      </div>

      {/* Top 3 Trending */}
      <section className="mb-10">
        <h2 className="text-2xl text-white mb-4">Top Trending This Week</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topTrending.map((song, index) => (
            <div
              key={song.id}
              className="relative bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-lg p-6 hover:from-zinc-800 hover:to-zinc-700 transition-all cursor-pointer group"
              onClick={() => onSongSelect(song)}
            >
              <div className="absolute top-4 right-4 text-5xl font-bold text-white/10">
                #{index + 1}
              </div>
              <div className="flex gap-4">
                <img
                  src={song.coverUrl}
                  alt={song.title}
                  className="w-24 h-24 rounded-lg"
                />
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-xl text-white mb-1">{song.title}</h3>
                  <p className="text-zinc-400">{song.artist}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <TrendingUp size={16} className="text-green-500" />
                    <span className="text-sm text-green-500">
                      +{Math.floor(Math.random() * 100) + 50}% this week
                    </span>
                  </div>
                </div>
              </div>
              <button className="absolute bottom-4 right-4 bg-green-500 text-black rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all">
                <Play size={18} fill="currentColor" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Table */}
      <section className="mb-8">
        <h2 className="text-2xl text-white mb-4">All Trending Songs</h2>
        <div className="bg-zinc-900/30 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left p-4 text-zinc-400 text-sm w-12">#</th>
                <th className="text-left p-4 text-zinc-400 text-sm">Title</th>
                <th className="text-left p-4 text-zinc-400 text-sm">Album</th>
                <th className="text-left p-4 text-zinc-400 text-sm">Trending</th>
                <th className="text-left p-4 text-zinc-400 text-sm">Duration</th>
                <th className="text-left p-4 text-zinc-400 text-sm w-12"></th>
              </tr>
            </thead>
            <tbody>
              {trendingThisWeek.map((song, index) => (
                <tr
                  key={song.id}
                  className="border-b border-zinc-800/50 hover:bg-zinc-800/30 cursor-pointer group"
                >
                  <td className="p-4">
                    <div className="flex items-center justify-center w-6">
                      <span className="text-zinc-400 group-hover:hidden">
                        {index + 1}
                      </span>
                      <button
                        onClick={() => onSongSelect(song)}
                        className="text-white hidden group-hover:block"
                      >
                        <Play size={16} fill="currentColor" />
                      </button>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={song.coverUrl}
                        alt={song.title}
                        className="w-12 h-12 rounded"
                      />
                      <div>
                        <p className="text-white">{song.title}</p>
                        <p className="text-sm text-zinc-400">{song.artist}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-zinc-400">{song.album}</td>
                  <td className="p-4">
                    <span className="text-green-500 text-sm flex items-center gap-1">
                      <TrendingUp size={14} />
                      +{Math.floor(Math.random() * 50) + 1}
                    </span>
                  </td>
                  <td className="p-4 text-zinc-400">{song.duration}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100">
                      <button className="text-zinc-400 hover:text-white">
                        <Heart size={18} />
                      </button>
                      <button className="text-zinc-400 hover:text-white">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Trending Artists */}
      <section>
        <h2 className="text-2xl text-white mb-4">Trending Artists</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {mockSongs.slice(0, 6).map((song) => (
            <div
              key={song.id}
              className="bg-zinc-900/50 p-4 rounded-lg hover:bg-zinc-800/50 transition-all cursor-pointer text-center"
            >
              <img
                src={song.coverUrl}
                alt={song.artist}
                className="w-full aspect-square object-cover rounded-full mb-3"
              />
              <h3 className="text-white truncate">{song.artist}</h3>
              <p className="text-sm text-zinc-400">Artist</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
