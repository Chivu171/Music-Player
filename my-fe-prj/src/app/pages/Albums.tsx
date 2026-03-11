import { useMemo } from "react";
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

const formatDuration = (duration?: number) => {
  if (!duration) return "0:00";
  const min = Math.floor(duration / 60);
  const sec = Math.floor(duration % 60)
    .toString()
    .padStart(2, "0");
  return `${min}:${sec}`;
};

const fetchAlbums = async (): Promise<Album[]> => {
  const token = localStorage.getItem("token");

  const headers: HeadersInit = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  const res = await fetch(`${API_URL}/playlists/albums`, { headers });

  if (!res.ok) throw new Error("Failed to fetch albums");

  const data = await res.json();

  return data.map((album: any) => ({
    id: album._id,
    title: album.name,
    artist: album.artistName || "Unknown Artist",
    year: album.createdAt
      ? new Date(album.createdAt).getFullYear()
      : 2024,
    coverUrl:
      album.thumbnail ||
      "https://marketplace.canva.com/EAFiB-8g3-E/1/0/1600w/canva-black-minimalist-vinyl-record-album-cover-gBwZOS_0A_w.jpg",

    songs: (album.songs || []).map((s: any) => ({
      id: s._id,
      title: s.title,
      artist: album.artistName || "Unknown Artist",
      album: album.name,
      duration: formatDuration(s.duration),
      coverUrl:
        s.coverUrl ||
        "https://res.cloudinary.com/dywwla9mp/image/upload/v1/default-song.png",
      audioUrl: s.fileUrl,
    })),
  }));
};

export function Albums() {
  const navigate = useNavigate();
  const { onSongSelect } = useOutletContext<OutletContext>();

  const {
    data: albums = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["albums"],
    queryFn: fetchAlbums,
    staleTime: 1000 * 60 * 15,
  });

  const { newReleases, popularAlbums, classicAlbums } = useMemo(() => {
    if (!albums.length)
      return { newReleases: [], popularAlbums: [], classicAlbums: [] };

    return {
      newReleases: albums.filter((a) => a.year >= 2024),
      popularAlbums: [...albums].sort(() => 0.5 - Math.random()).slice(0, 3),
      classicAlbums: albums.filter((a) => a.year < 2024),
    };
  }, [albums]);

  const playAlbum = (album: Album, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!album.songs.length) return;
    onSongSelect(album.songs[0]);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-green-500" size={40} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <Music size={48} className="text-red-500 mb-4 opacity-60" />
        <h3 className="text-xl font-bold text-white">Failed to load albums</h3>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 bg-white text-black px-6 py-2 rounded-full font-bold"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-14">

      {/* HERO */}
      <div className="relative h-80 rounded-3xl overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1631692362908-7fcbc77c5104?w=1200"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 p-10">
          <h1 className="text-6xl font-black text-white">Albums</h1>
          <p className="text-zinc-400">
            Explore curated music collections
          </p>
        </div>
      </div>

      {/* NEW RELEASES */}
      {newReleases.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold text-white mb-6">
            New Releases
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-6">
            {newReleases.map((album) => (
              <div
                key={album.id}
                onClick={() => navigate(`/album/${album.id}`)}
                className="bg-zinc-900 p-4 rounded-2xl hover:bg-zinc-800 cursor-pointer group"
              >
                <div className="relative">
                  <img
                    src={album.coverUrl}
                    className="rounded-xl aspect-square object-cover"
                  />

                  <button
                    onClick={(e) => playAlbum(album, e)}
                    className="absolute bottom-3 right-3 bg-green-500 p-3 rounded-full opacity-0 group-hover:opacity-100"
                  >
                    <Play size={18} fill="currentColor" />
                  </button>
                </div>

                <h3 className="text-white mt-3 font-semibold truncate">
                  {album.title}
                </h3>

                <p className="text-sm text-zinc-400 truncate">
                  {album.artist}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* POPULAR */}
      {popularAlbums.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold text-white mb-6">
            Popular Albums
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {popularAlbums.map((album, i) => (
              <div
                key={album.id}
                onClick={() => navigate(`/album/${album.id}`)}
                className="bg-zinc-900 rounded-3xl p-6 hover:bg-zinc-800 cursor-pointer"
              >
                <img
                  src={album.coverUrl}
                  className="w-32 h-32 rounded-xl object-cover mb-4"
                />

                <h3 className="text-xl font-bold text-white">
                  {album.title}
                </h3>

                <p className="text-zinc-400">{album.artist}</p>

                <div className="flex items-center gap-3 text-xs text-zinc-500 mt-3">
                  <Clock size={14} />
                  {album.year} • {album.songs.length} songs
                </div>

                <button
                  onClick={(e) => playAlbum(album, e)}
                  className="mt-4 bg-green-500 text-black px-6 py-2 rounded-full flex items-center gap-2"
                >
                  <Play size={14} fill="currentColor" />
                  Play
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CLASSIC */}
      {classicAlbums.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold text-white mb-6">
            Classic Albums
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-6">
            {classicAlbums.map((album) => (
              <div
                key={album.id}
                onClick={() => navigate(`/album/${album.id}`)}
                className="bg-zinc-900 p-4 rounded-2xl hover:bg-zinc-800 cursor-pointer group"
              >
                <div className="relative">
                  <img
                    src={album.coverUrl}
                    className="rounded-xl aspect-square object-cover"
                  />

                  <button
                    onClick={(e) => playAlbum(album, e)}
                    className="absolute bottom-3 right-3 bg-green-500 p-3 rounded-full opacity-0 group-hover:opacity-100"
                  >
                    <Play size={18} fill="currentColor" />
                  </button>
                </div>

                <h3 className="text-white mt-3 font-semibold truncate">
                  {album.title}
                </h3>

                <p className="text-sm text-zinc-400 truncate">
                  {album.artist}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}