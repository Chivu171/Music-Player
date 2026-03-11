import { useMemo } from "react";
import { API_URL } from "../apiConfig";
import { useQuery } from "@tanstack/react-query";
import { useOutletContext, useNavigate } from "react-router";
import { Play, UserCheck, Music2, Loader2 } from "lucide-react";
import { Song, Artist } from "../data/mockData";

interface OutletContext {
  onSongSelect: (song: Song, playlist?: Song[]) => void;
}

const mapArtist = (a: any): Artist => ({
  id: a._id || a.id,
  name: a.name,
  imageUrl:
    a.imageUrl ||
    "https://res.cloudinary.com/dywwla9mp/image/upload/v1/default-artist.png",
  followers: a.followers?.toLocaleString() || "0",
  genre: a.genre || "Artist",
});

const mapSong = (s: any): Song => ({
  id: s._id,
  title: s.title,
  artist: s.artist?.name || "Unknown Artist",
  album: "Single",
  duration: `${Math.floor(s.duration / 60)}:${Math.floor(
    s.duration % 60
  )
    .toString()
    .padStart(2, "0")}`,
  coverUrl: s.coverUrl,
  audioUrl: s.fileUrl,
});

const fetchTrendingArtists = async (): Promise<Artist[]> => {
  const res = await fetch(`${API_URL}/artists/trending?limit=6`);
  const data = await res.json();
  return data.map(mapArtist);
};

const fetchAllArtists = async (): Promise<Artist[]> => {
  const res = await fetch(`${API_URL}/artists`);
  const data = await res.json();
  return data.map(mapArtist);
};

const fetchPopularTracks = async (): Promise<Song[]> => {
  const res = await fetch(`${API_URL}/songs/popular?limit=8`);
  const data = await res.json();
  return data.map(mapSong);
};

const fetchSongsByArtist = async (artistId: string): Promise<Song[]> => {
  const res = await fetch(`${API_URL}/songs/artist/${artistId}`);
  const data = await res.json();
  return data.map(mapSong);
};

const fetchFollowedArtists = async (): Promise<Set<string>> => {
  const token = localStorage.getItem("token");
  if (!token) return new Set();

  const res = await fetch(`${API_URL}/auth/followed-artists`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) return new Set();

  const data = await res.json();
  return new Set(data.map((a: any) => a._id));
};

export function Artists() {
  const { onSongSelect } = useOutletContext<OutletContext>();
  const navigate = useNavigate();

  const { data: trendingArtists = [], isLoading: trendingLoading } = useQuery({
    queryKey: ["trendingArtists"],
    queryFn: fetchTrendingArtists,
    staleTime: 1000 * 60 * 10,
  });

  const { data: allArtists = [], isLoading: allLoading } = useQuery({
    queryKey: ["allArtists"],
    queryFn: fetchAllArtists,
    staleTime: 1000 * 60 * 30,
  });

  const { data: popularTracks = [], isLoading: popularLoading } = useQuery({
    queryKey: ["popularTracks"],
    queryFn: fetchPopularTracks,
    staleTime: 1000 * 60 * 5,
  });

  const { data: followedArtists = new Set<string>(), refetch: refetchFollowed } =
    useQuery({
      queryKey: ["followedArtists"],
      queryFn: fetchFollowedArtists,
    });

  const loading = trendingLoading || allLoading || popularLoading;

  const handleFollow = async (artistId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (followedArtists.has(artistId)) return;

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const res = await fetch(`${API_URL}/auth/follow/${artistId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        refetchFollowed();
      }
    } catch (error) {
      console.error("Failed to follow artist:", error);
    }
  };

  const playArtist = async (artistId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      const songs = await fetchSongsByArtist(artistId);

      if (songs.length > 0) {
        onSongSelect(songs[0], songs);
      }
    } catch (error) {
      console.error("Failed to load artist songs", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)]">
        <Loader2 className="w-12 h-12 text-green-500 animate-spin" />
      </div>
    );
  }

  const spotlightArtists = trendingArtists.slice(0, 3);
  const weeklyTrending = trendingArtists.slice(0, 6);

  return (
    <div className="p-6">
      {/* Hero */}
      <div className="relative h-80 rounded-lg overflow-hidden mb-8 shadow-2xl">
        <img
          src="https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=1200"
          alt="Artists"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8">
          <div className="flex items-center gap-2 mb-2">
            <Music2 size={24} className="text-green-500" />
            <span className="text-sm uppercase tracking-widest text-zinc-300 font-medium">
              Discover
            </span>
          </div>

          <h1 className="text-6xl font-bold text-white mb-4 tracking-tight">
            Artists
          </h1>

          <p className="text-zinc-200 text-lg max-w-xl">
            Follow your favorite artists and discover new ones tailored just
            for you.
          </p>
        </div>
      </div>

      {/* Spotlight */}
      {spotlightArtists.length > 0 && (
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">
            Top Artists This Month
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {spotlightArtists.map((artist, index) => (
              <div
                key={artist.id}
                onClick={() => navigate(`/artist/${artist.id}`)}
                className="relative bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl overflow-hidden hover:scale-[1.03] transition-all duration-300 cursor-pointer group border border-white/5 shadow-xl"
              >
                <div className="relative p-8">
                  <div className="absolute top-4 right-4 bg-yellow-500 text-black rounded-full w-10 h-10 flex items-center justify-center text-lg font-black">
                    {index + 1}
                  </div>

                  <div className="flex flex-col items-center text-center pt-4">
                    <img
                      src={artist.imageUrl}
                      alt={artist.name}
                      className="w-40 h-40 rounded-full object-cover mb-6"
                    />

                    <h3 className="text-2xl font-bold text-white mb-1">
                      {artist.name}
                    </h3>

                    <p className="text-zinc-400 mb-6">{artist.genre}</p>

                    <div className="flex gap-3">
                      <button
                        onClick={(e) => playArtist(artist.id, e)}
                        className="bg-white text-black px-6 py-2.5 rounded-full font-bold flex items-center gap-2"
                      >
                        <Play size={16} fill="currentColor" />
                        Play
                      </button>

                      <button
                        onClick={(e) => handleFollow(artist.id, e)}
                        disabled={followedArtists.has(artist.id)}
                        className={`px-6 py-2.5 rounded-full font-bold border ${followedArtists.has(artist.id)
                            ? "bg-white text-black"
                            : "bg-zinc-800 text-white"
                          }`}
                      >
                        {followedArtists.has(artist.id)
                          ? "Following"
                          : "Follow"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Popular Tracks */}
      {popularTracks.length > 0 && (
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8">Top Releases</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {popularTracks.map((song, index) => (
              <TrackItem
                key={song.id}
                song={song}
                index={index + 1}
                onSongSelect={onSongSelect}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function TrackItem({
  song,
  index,
  onSongSelect,
}: {
  song: Song;
  index: number;
  onSongSelect: (song: Song) => void;
}) {
  return (
    <div
      onClick={() => onSongSelect(song)}
      className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-white/[0.03] transition-all duration-300 cursor-pointer"
    >
      <span className="text-2xl font-black text-zinc-700 w-8">
        {index.toString().padStart(2, "0")}
      </span>

      <img
        src={song.coverUrl}
        alt={song.title}
        className="w-16 h-16 rounded-xl object-cover"
      />

      <div className="flex-1">
        <h4 className="text-white font-bold truncate">{song.title}</h4>
        <p className="text-zinc-400 text-sm truncate">{song.artist}</p>
      </div>

      <span className="text-sm text-zinc-500">{song.duration}</span>
    </div>
  );
}