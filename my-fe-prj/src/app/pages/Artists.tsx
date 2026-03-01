import { useOutletContext } from "react-router";
import { Play, UserCheck, Music2 } from "lucide-react";
import { mockArtists, mockSongs, Song } from "../data/mockData";

interface OutletContext {
  onSongSelect: (song: Song) => void;
}

export function Artists() {
  const { onSongSelect } = useOutletContext<OutletContext>();

  const topArtists = mockArtists.slice(0, 3);
  const trendingArtists = mockArtists.slice(3, 6);

  return (
    <div className="p-6">
      {/* Hero Section */}
      <div className="relative h-80 rounded-lg overflow-hidden mb-8">
        <img
          src="https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=1200"
          alt="Artists"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8">
          <div className="flex items-center gap-2 mb-2">
            <Music2 size={24} className="text-green-500" />
            <span className="text-sm uppercase tracking-wider text-zinc-300">
              Discover
            </span>
          </div>
          <h1 className="text-6xl text-white mb-4">Artists</h1>
          <p className="text-zinc-300 text-lg">
            Follow your favorite artists and discover new ones
          </p>
        </div>
      </div>

      {/* Top Artists Spotlight */}
      <section className="mb-10">
        <h2 className="text-2xl text-white mb-4">Top Artists This Month</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topArtists.map((artist, index) => (
            <div
              key={artist.id}
              className="relative bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer group"
            >
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
              <div className="relative p-6">
                <div className="absolute top-4 right-4 bg-yellow-500 text-black rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold">
                  {index + 1}
                </div>
                <div className="flex flex-col items-center text-center pt-8">
                  <img
                    src={artist.imageUrl}
                    alt={artist.name}
                    className="w-40 h-40 rounded-full object-cover mb-6 ring-4 ring-white/20"
                  />
                  <h3 className="text-2xl text-white mb-2">{artist.name}</h3>
                  <p className="text-zinc-300 mb-1">{artist.genre}</p>
                  <p className="text-sm text-zinc-400 mb-6">
                    {artist.followers} followers
                  </p>
                  <div className="flex gap-3">
                    <button className="bg-green-500 text-black px-6 py-2 rounded-full hover:bg-green-400 transition-all flex items-center gap-2">
                      <Play size={16} fill="currentColor" />
                      Play
                    </button>
                    <button className="border border-white/50 text-white px-6 py-2 rounded-full hover:bg-white/10 transition-all flex items-center gap-2">
                      <UserCheck size={16} />
                      Follow
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Artists */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl text-white">Trending Artists</h2>
          <button className="text-sm text-zinc-400 hover:text-white transition-colors">
            See all
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trendingArtists.map((artist) => (
            <div
              key={artist.id}
              className="bg-zinc-900/50 rounded-lg p-6 hover:bg-zinc-800/50 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <img
                  src={artist.imageUrl}
                  alt={artist.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-xl text-white mb-1">{artist.name}</h3>
                  <p className="text-sm text-zinc-400 mb-2">{artist.genre}</p>
                  <p className="text-xs text-zinc-500 mb-3">
                    {artist.followers} followers
                  </p>
                  <button className="bg-white/10 text-white px-4 py-1.5 rounded-full text-sm hover:bg-white/20 transition-all flex items-center gap-2">
                    <UserCheck size={14} />
                    Follow
                  </button>
                </div>
                <button className="bg-green-500 text-black rounded-full p-4 opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                  <Play size={20} fill="currentColor" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* All Artists Grid */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl text-white">All Artists</h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-zinc-800 text-white rounded-full text-sm hover:bg-zinc-700 transition-colors">
              Popular
            </button>
            <button className="px-4 py-2 bg-zinc-900 text-zinc-400 rounded-full text-sm hover:bg-zinc-800 transition-colors">
              A-Z
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {mockArtists.map((artist) => (
            <div
              key={artist.id}
              className="bg-zinc-900/50 p-4 rounded-lg hover:bg-zinc-800/50 transition-all cursor-pointer group"
            >
              <div className="relative mb-4">
                <img
                  src={artist.imageUrl}
                  alt={artist.name}
                  className="w-full aspect-square object-cover rounded-full"
                />
                <button className="absolute bottom-2 right-2 bg-green-500 text-black rounded-full p-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all shadow-lg hover:scale-105">
                  <Play size={20} fill="currentColor" />
                </button>
              </div>
              <h3 className="text-white truncate mb-1 text-center">
                {artist.name}
              </h3>
              <p className="text-sm text-zinc-400 truncate text-center">
                {artist.genre}
              </p>
              <p className="text-xs text-zinc-500 mt-1 text-center">
                {artist.followers}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Tracks from Artists */}
      <section>
        <h2 className="text-2xl text-white mb-4">Popular Tracks from Your Artists</h2>
        <div className="bg-zinc-900/30 rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-800">
            {mockSongs.map((song) => (
              <div
                key={song.id}
                onClick={() => onSongSelect(song)}
                className="bg-zinc-900/50 p-4 hover:bg-zinc-800/50 cursor-pointer group flex items-center gap-4"
              >
                <div className="relative">
                  <img
                    src={song.coverUrl}
                    alt={song.title}
                    className="w-16 h-16 rounded"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Play size={24} className="text-white" fill="currentColor" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white truncate">{song.title}</h4>
                  <p className="text-sm text-zinc-400 truncate">{song.artist}</p>
                </div>
                <span className="text-sm text-zinc-500">{song.duration}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
