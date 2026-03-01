import { useOutletContext } from "react-router";
import { Play, Clock, Music } from "lucide-react";
import { mockAlbums, Song } from "../data/mockData";

interface OutletContext {
  onSongSelect: (song: Song) => void;
}

export function Albums() {
  const { onSongSelect } = useOutletContext<OutletContext>();

  const newReleases = mockAlbums.filter((album) => album.year >= 2024);
  const popularAlbums = [...mockAlbums].sort(() => Math.random() - 0.5);
  const classicAlbums = mockAlbums.filter((album) => album.year <= 2023);

  return (
    <div className="p-6">
      {/* Hero Section */}
      <div className="relative h-80 rounded-lg overflow-hidden mb-8">
        <img
          src="https://images.unsplash.com/photo-1631692362908-7fcbc77c5104?w=1200"
          alt="Albums"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8">
          <div className="flex items-center gap-2 mb-2">
            <Music size={24} className="text-green-500" />
            <span className="text-sm uppercase tracking-wider text-zinc-300">
              Collection
            </span>
          </div>
          <h1 className="text-6xl text-white mb-4">Albums</h1>
          <p className="text-zinc-300 text-lg">
            Explore the best albums from your favorite artists
          </p>
        </div>
      </div>

      {/* New Releases */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl text-white">New Releases</h2>
          <button className="text-sm text-zinc-400 hover:text-white transition-colors">
            See all
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {newReleases.map((album) => (
            <div
              key={album.id}
              className="bg-zinc-900/50 p-4 rounded-lg hover:bg-zinc-800/50 transition-all cursor-pointer group"
            >
              <div className="relative mb-4">
                <img
                  src={album.coverUrl}
                  alt={album.title}
                  className="w-full aspect-square object-cover rounded-md"
                />
                <button
                  onClick={() => album.songs[0] && onSongSelect(album.songs[0])}
                  className="absolute bottom-2 right-2 bg-green-500 text-black rounded-full p-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all shadow-lg hover:scale-105"
                >
                  <Play size={20} fill="currentColor" />
                </button>
                <div className="absolute top-2 left-2 bg-green-500 text-black text-xs px-2 py-1 rounded">
                  NEW
                </div>
              </div>
              <h3 className="text-white truncate mb-1">{album.title}</h3>
              <p className="text-sm text-zinc-400 truncate">{album.artist}</p>
              <p className="text-xs text-zinc-500 mt-1">{album.year}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Albums */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl text-white">Popular Albums</h2>
          <button className="text-sm text-zinc-400 hover:text-white transition-colors">
            See all
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularAlbums.slice(0, 3).map((album, index) => (
            <div
              key={album.id}
              className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-lg p-6 hover:from-zinc-800 hover:to-zinc-700 transition-all cursor-pointer group"
            >
              <div className="flex gap-4">
                <div className="relative">
                  <img
                    src={album.coverUrl}
                    alt={album.title}
                    className="w-32 h-32 rounded-lg shadow-lg"
                  />
                  <div className="absolute top-2 right-2 bg-yellow-500 text-black rounded-full w-8 h-8 flex items-center justify-center text-sm">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-xl text-white mb-2">{album.title}</h3>
                  <p className="text-zinc-400 mb-2">{album.artist}</p>
                  <div className="flex items-center gap-4 text-sm text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {album.year}
                    </span>
                    <span>{album.songs.length} songs</span>
                  </div>
                  <button
                    onClick={() => album.songs[0] && onSongSelect(album.songs[0])}
                    className="mt-4 bg-green-500 text-black px-6 py-2 rounded-full hover:bg-green-400 transition-all self-start flex items-center gap-2"
                  >
                    <Play size={16} fill="currentColor" />
                    Play
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Classic Albums */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl text-white">Classic Albums</h2>
          <button className="text-sm text-zinc-400 hover:text-white transition-colors">
            See all
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {classicAlbums.map((album) => (
            <div
              key={album.id}
              className="bg-zinc-900/50 p-4 rounded-lg hover:bg-zinc-800/50 transition-all cursor-pointer group"
            >
              <div className="relative mb-4">
                <img
                  src={album.coverUrl}
                  alt={album.title}
                  className="w-full aspect-square object-cover rounded-md"
                />
                <button
                  onClick={() => album.songs[0] && onSongSelect(album.songs[0])}
                  className="absolute bottom-2 right-2 bg-green-500 text-black rounded-full p-3 opacity-0 group-hover:opacity-100 translate-y-2 group-group:translate-y-0 transition-all shadow-lg hover:scale-105"
                >
                  <Play size={20} fill="currentColor" />
                </button>
              </div>
              <h3 className="text-white truncate mb-1">{album.title}</h3>
              <p className="text-sm text-zinc-400 truncate">{album.artist}</p>
              <p className="text-xs text-zinc-500 mt-1">{album.year}</p>
            </div>
          ))}
        </div>
      </section>

      {/* All Albums */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl text-white">All Albums</h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-zinc-800 text-white rounded-full text-sm hover:bg-zinc-700 transition-colors">
              Grid
            </button>
            <button className="px-4 py-2 bg-zinc-900 text-zinc-400 rounded-full text-sm hover:bg-zinc-800 transition-colors">
              List
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {mockAlbums.map((album) => (
            <div
              key={album.id}
              className="bg-zinc-900/50 p-4 rounded-lg hover:bg-zinc-800/50 transition-all cursor-pointer group"
            >
              <div className="relative mb-4">
                <img
                  src={album.coverUrl}
                  alt={album.title}
                  className="w-full aspect-square object-cover rounded-md"
                />
                <button
                  onClick={() => album.songs[0] && onSongSelect(album.songs[0])}
                  className="absolute bottom-2 right-2 bg-green-500 text-black rounded-full p-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all shadow-lg hover:scale-105"
                >
                  <Play size={20} fill="currentColor" />
                </button>
              </div>
              <h3 className="text-white truncate mb-1">{album.title}</h3>
              <p className="text-sm text-zinc-400 truncate">{album.artist}</p>
              <p className="text-xs text-zinc-500 mt-1">{album.year}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
