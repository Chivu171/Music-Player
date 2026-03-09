import { useOutletContext } from "react-router";
import { SongCard } from "../components/SongCard";
import { mockSongs, Song, mockAlbums } from "../data/mockData";
import { Play, Clock } from "lucide-react";

interface OutletContext {
  onSongSelect: (song: Song) => void;
}

export function Recommended() {
  const { onSongSelect } = useOutletContext<OutletContext>();

  return (
    <div className="p-6 relative min-h-screen">
      {/* Coming Soon Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none left-0 lg:left-64">
        <div className="pointer-events-auto bg-zinc-900/95 backdrop-blur-2xl p-10 rounded-3xl border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.8)] text-center max-w-md mx-4 scale-110">
          <div className="w-24 h-24 bg-gradient-to-tr from-purple-500 via-indigo-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse shadow-lg shadow-purple-500/20">
            <Clock size={48} className="text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Coming Soon</h2>
          <p className="text-zinc-300 text-xl leading-relaxed font-medium">
            Tính năng này chưa được phát triển. <br />
            Vui lòng quay lại sau nhé! 🎵
          </p>
          <div className="mt-10 flex justify-center gap-3">
            <div className="w-3 h-3 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '200ms' }} />
            <div className="w-3 h-3 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '400ms' }} />
          </div>
        </div>
      </div>

      {/* Blurred Content */}
      <div className="blur-[6px] pointer-events-none select-none opacity-50">
        {/* Hero Banner */}
        <div className="relative h-72 rounded-lg overflow-hidden mb-8 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative h-full flex items-end p-8">
            <div>
              <span className="text-sm uppercase tracking-wider text-zinc-300 mb-2 block">
                Made for You
              </span>
              <h1 className="text-5xl text-white mb-3">Your Daily Mix</h1>
              <p className="text-zinc-300 mb-6">
                Personalized recommendations based on your listening history
              </p>
              <div className="flex gap-4">
                <button className="bg-green-500 text-black px-8 py-3 rounded-full hover:bg-green-400 transition-all hover:scale-105 flex items-center gap-2">
                  <Play size={20} fill="currentColor" />
                  Play
                </button>
                <button className="border border-zinc-400 text-white px-8 py-3 rounded-full hover:bg-white/10 transition-all">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Picks */}
        <section className="mb-10">
          <h2 className="text-2xl text-white mb-4">Quick Picks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockSongs.slice(0, 4).map((song) => (
              <button
                key={song.id}
                onClick={() => onSongSelect(song)}
                className="bg-zinc-800/50 rounded-lg flex items-center gap-4 hover:bg-zinc-700/50 transition-all group overflow-hidden"
              >
                <img
                  src={song.coverUrl}
                  alt={song.title}
                  className="w-24 h-24 object-cover"
                />
                <div className="flex-1 text-left pr-4">
                  <p className="text-white truncate">{song.title}</p>
                  <p className="text-sm text-zinc-400 truncate">{song.artist}</p>
                </div>
                <div className="mr-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play size={24} className="text-white" fill="currentColor" />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Daily Mix Playlists */}
        <section className="mb-10">
          <h2 className="text-2xl text-white mb-4">Your Daily Mixes</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((mix) => (
              <div
                key={mix}
                className="bg-zinc-900/50 p-4 rounded-lg hover:bg-zinc-800/50 transition-all cursor-pointer group"
              >
                <div className="relative mb-4">
                  <div className="w-full aspect-square bg-gradient-to-br from-purple-600 to-blue-600 rounded-md flex items-center justify-center text-white text-4xl">
                    {mix}
                  </div>
                  <button
                    onClick={() => mockSongs[mix - 1] && onSongSelect(mockSongs[mix - 1])}
                    className="absolute bottom-2 right-2 bg-green-500 text-black rounded-full p-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all shadow-lg hover:scale-105"
                  >
                    <Play size={20} fill="currentColor" />
                  </button>
                </div>
                <h3 className="text-white mb-1">Daily Mix {mix}</h3>
                <p className="text-sm text-zinc-400">Based on your taste</p>
              </div>
            ))}
          </div>
        </section>

        {/* Recommended Albums */}
        <section className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl text-white">Recommended Albums</h2>
            <button className="text-sm text-zinc-400 hover:text-white transition-colors">
              See all
            </button>
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
              </div>
            ))}
          </div>
        </section>

        {/* Discover Weekly */}
        <section className="mb-10">
          <h2 className="text-2xl text-white mb-4">Discover Weekly</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {mockSongs.map((song) => (
              <SongCard key={song.id} song={song} onPlay={onSongSelect} />
            ))}
          </div>
        </section>

        {/* Because You Listened */}
        <section>
          <h2 className="text-2xl text-white mb-4">
            Because you listened to {mockSongs[0].artist}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {[...mockSongs].reverse().map((song) => (
              <SongCard key={song.id} song={song} onPlay={onSongSelect} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
