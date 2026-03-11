import { API_URL } from "../apiConfig";
import { useQuery } from "@tanstack/react-query";
import { useOutletContext, useNavigate } from "react-router";
import { Play, Clock, Music, Loader2 } from "lucide-react";
import { Song } from "../data/mockData";

interface Album {
  id: string;
  title: string;
  artist: string;
  year: number;
  coverUrl: string;
  songs: Song[];
}

interface OutletContext {
  onSongSelect: (song: Song) => void;
}

const fetchAlbums = async (): Promise<Album[]> => {
  const token = localStorage.getItem("token");
  const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

  const response = await fetch(`${API_URL}/playlists/albums`, { headers });
  if (!response.ok) throw new Error("Failed to fetch albums");

  const data = await response.json();

  return data.map((album: any) => ({
    id: album._id,
    title: album.name,
    artist: album.artistName || "Unknown Artist",
    year: new Date(album.createdAt).getFullYear(),
    coverUrl: album.thumbnail || "https://marketplace.canva.com/EAFiB-8g3-E/1/0/1600w/canva-black-minimalist-vinyl-record-album-cover-gBwZOS_0A_w.jpg",
    songs: album.songs.map((s: any) => ({
      id: s._id,
      title: s.title,
      artist: album.artistName,
      album: album.name,
      duration: `${Math.floor(s.duration / 60)}:${Math.floor(s.duration % 60).toString().padStart(2, '0')}`,
      coverUrl: s.coverUrl,
      audioUrl: s.fileUrl
    }))
  }));
};

export function Albums() {
  const navigate = useNavigate();
  const { onSongSelect } = useOutletContext<OutletContext>();

  const { data: albums = [], isLoading: loading } = useQuery({
    queryKey: ["albums"],
    queryFn: fetchAlbums,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });

  const newReleases = albums.filter((album) => album.year >= 2024);
  const popularAlbums = [...albums].sort(() => Math.random() - 0.5);
  const classicAlbums = albums.filter((album) => album.year <= 2023);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)]">
        <Loader2 className="w-12 h-12 text-green-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Hero Section */}
      <div className="relative h-80 rounded-[40px] overflow-hidden mb-8 border border-white/5">
        <img
          src="https://images.unsplash.com/photo-1631692362908-7fcbc77c5104?w=1200"
          alt="Albums"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-green-500 p-2 rounded-xl">
              <Music size={20} className="text-black" />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-300">
              Collection
            </span>
          </div>
          <h1 className="text-7xl font-black text-white mb-4 tracking-tighter">Albums</h1>
          <p className="text-zinc-400 text-xl font-medium max-w-lg">
            Explore the best curated collections from your favorite artists
          </p>
        </div>
      </div>

      {albums.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="bg-zinc-900 p-8 rounded-[40px] border border-white/5 mb-6">
            <Music size={48} className="text-zinc-700" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No albums found</h3>
          <p className="text-zinc-500">Try discovering some artists first.</p>
        </div>
      ) : (
        <>
          {/* New Releases */}
          {newReleases.length > 0 && (
            <section className="mb-14">
              <div className="flex justify-between items-center mb-6 px-2">
                <h2 className="text-3xl font-black text-white tracking-tight">New Releases</h2>
                <button className="text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-green-500 transition-colors">
                  See all
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {newReleases.map((album) => (
                  <div
                    key={album.id}
                    onClick={() => navigate(`/album/${album.id}`)}
                    className="bg-zinc-900/40 p-5 rounded-[32px] hover:bg-zinc-800/60 transition-all border border-white/5 cursor-pointer group relative"
                  >
                    <div className="relative mb-5">
                      <img
                        src={album.coverUrl}
                        alt={album.title}
                        className="w-full aspect-square object-cover rounded-[24px] shadow-2xl"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          album.songs[0] && onSongSelect(album.songs[0]);
                        }}
                        className="absolute bottom-3 right-3 bg-green-500 text-black rounded-full p-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all shadow-xl hover:scale-110 active:scale-95 z-10"
                      >
                        <Play size={20} fill="currentColor" />
                      </button>
                      <div className="absolute top-3 left-3 bg-green-500 text-black text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg">
                        NEW
                      </div>
                    </div>
                    <h3 className="text-white font-bold truncate mb-1 px-1 tracking-tight">{album.title}</h3>
                    <p className="text-sm text-zinc-500 truncate px-1 font-medium">{album.artist}</p>
                    <p className="text-[10px] text-zinc-600 mt-2 px-1 font-black uppercase tracking-widest">{album.year}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Popular Albums */}
          {popularAlbums.length > 0 && (
            <section className="mb-14">
              <div className="flex justify-between items-center mb-6 px-2">
                <h2 className="text-3xl font-black text-white tracking-tight">Popular Albums</h2>
                <button className="text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-green-500 transition-colors">
                  See all
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {popularAlbums.slice(0, 3).map((album, index) => (
                  <div
                    key={album.id}
                    onClick={() => navigate(`/album/${album.id}`)}
                    className="bg-gradient-to-br from-zinc-900/60 to-zinc-950/40 rounded-[40px] p-8 hover:from-zinc-800 hover:to-zinc-900 border border-white/5 transition-all cursor-pointer group"
                  >
                    <div className="flex gap-6">
                      <div className="relative shrink-0">
                        <img
                          src={album.coverUrl}
                          alt={album.title}
                          className="w-32 h-32 rounded-[24px] shadow-2xl object-cover"
                        />
                        <div className="absolute -top-3 -right-3 bg-zinc-900 border border-white/10 text-white rounded-full w-10 h-10 flex items-center justify-center font-black shadow-xl">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col justify-center min-w-0">
                        <h3 className="text-2xl font-black text-white mb-2 truncate tracking-tight">{album.title}</h3>
                        <p className="text-zinc-400 font-bold mb-4">{album.artist}</p>
                        <div className="flex items-center gap-4 text-xs font-black text-zinc-600 uppercase tracking-widest">
                          <span className="flex items-center gap-1.5">
                            <Clock size={14} />
                            {album.year}
                          </span>
                          <span>•</span>
                          <span>{album.songs.length} songs</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            album.songs[0] && onSongSelect(album.songs[0]);
                          }}
                          className="mt-6 bg-green-500 hover:bg-green-400 text-black px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest transition-all self-start flex items-center gap-2 hover:scale-105 active:scale-95 shadow-lg shadow-green-500/10"
                        >
                          <Play size={16} fill="currentColor" />
                          Play Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Classic Albums */}
          {classicAlbums.length > 0 && (
            <section>
              <div className="flex justify-between items-center mb-6 px-2">
                <h2 className="text-3xl font-black text-white tracking-tight">Classic Albums</h2>
                <button className="text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-green-500 transition-colors">
                  See all
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {classicAlbums.map((album) => (
                  <div
                    key={album.id}
                    onClick={() => navigate(`/album/${album.id}`)}
                    className="bg-zinc-900/40 p-5 rounded-[32px] hover:bg-zinc-800/60 transition-all border border-white/5 cursor-pointer group"
                  >
                    <div className="relative mb-5">
                      <img
                        src={album.coverUrl}
                        alt={album.title}
                        className="w-full aspect-square object-cover rounded-[24px] shadow-2xl"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          album.songs[0] && onSongSelect(album.songs[0]);
                        }}
                        className="absolute bottom-3 right-3 bg-green-500 text-black rounded-full p-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all shadow-xl hover:scale-110 active:scale-95"
                      >
                        <Play size={20} fill="currentColor" />
                      </button>
                    </div>
                    <h3 className="text-white font-bold truncate mb-1 px-1 tracking-tight">{album.title}</h3>
                    <p className="text-sm text-zinc-500 truncate px-1 font-medium">{album.artist}</p>
                    <p className="text-[10px] text-zinc-600 mt-2 px-1 font-black uppercase tracking-widest">{album.year}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
