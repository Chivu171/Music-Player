import { API_URL } from "../apiConfig";
import { useQuery } from "@tanstack/react-query";
import { useOutletContext, useNavigate } from "react-router";
import { Play, UserCheck, Music2, Loader2 } from "lucide-react";
import { Song, Artist } from "../data/mockData";

interface OutletContext {
  onSongSelect: (song: Song) => void;
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
  duration: `${Math.floor(s.duration / 60)}:${Math.floor(s.duration % 60)
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
  });

  const { data: allArtists = [], isLoading: allLoading } = useQuery({
    queryKey: ["allArtists"],
    queryFn: fetchAllArtists,
  });

  const { data: popularTracks = [], isLoading: popularLoading } = useQuery({
    queryKey: ["popularTracks"],
    queryFn: fetchPopularTracks,
  });

  const { data: followedArtists = new Set<string>(), refetch } = useQuery({
    queryKey: ["followedArtists"],
    queryFn: fetchFollowedArtists,
  });

  const loading = trendingLoading || allLoading || popularLoading;

  const handleFollow = async (artistId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (followedArtists.has(artistId)) return;

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    await fetch(`${API_URL}/auth/follow/${artistId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    refetch();
  };

  const playArtistSongs = async (artistId: string) => {
    try {
      const songs = await fetchSongsByArtist(artistId);
      if (songs.length > 0) {
        onSongSelect(songs[0]);
      }
    } catch (err) {
      console.error("Failed to play artist songs", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Loader2 className="animate-spin text-green-500" size={40} />
      </div>
    );
  }

  const spotlightArtists = trendingArtists.slice(0, 3);

  return (
    <div className="p-6 space-y-12">

      {/* HERO */}
      <div className="relative h-80 rounded-xl overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=1200"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 p-8">
          <h1 className="text-5xl font-bold text-white">Artists</h1>
          <p className="text-zinc-300">
            Discover trending artists and top releases
          </p>
        </div>
      </div>

      {/* SPOTLIGHT */}
      <section>
        <h2 className="text-3xl text-white font-bold mb-6">
          Top Artists This Month
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {spotlightArtists.map((artist) => (
            <div
              key={artist.id}
              onClick={() => navigate(`/artist/${artist.id}`)}
              className="bg-zinc-900 rounded-xl p-6 cursor-pointer hover:bg-zinc-800 transition"
            >
              <img
                src={artist.imageUrl}
                className="w-40 h-40 mx-auto rounded-full object-cover"
              />

              <h3 className="text-xl text-white mt-4 text-center font-bold">
                {artist.name}
              </h3>

              <p className="text-zinc-400 text-center">{artist.genre}</p>

              <div className="flex gap-3 justify-center mt-4">

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playArtistSongs(artist.id);
                  }}
                  className="bg-white text-black px-4 py-2 rounded-full flex items-center gap-2"
                >
                  <Play size={16} fill="currentColor" />
                  Play
                </button>

                <button
                  onClick={(e) => handleFollow(artist.id, e)}
                  className="border px-4 py-2 rounded-full text-white"
                >
                  {followedArtists.has(artist.id)
                    ? "Following"
                    : "Follow"}
                </button>

              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ALL ARTISTS */}
      <section>
        <h2 className="text-2xl text-white font-bold mb-6">
          All Artists
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">

          {allArtists.map((artist) => (
            <div
              key={artist.id}
              onClick={() => navigate(`/artist/${artist.id}`)}
              className="bg-zinc-900 p-4 rounded-xl cursor-pointer hover:bg-zinc-800 transition"
            >
              <div className="relative">

                <img
                  src={artist.imageUrl}
                  className="rounded-full aspect-square object-cover"
                />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playArtistSongs(artist.id);
                  }}
                  className="absolute bottom-0 right-0 bg-green-500 p-3 rounded-full"
                >
                  <Play size={18} fill="currentColor" />
                </button>

              </div>

              <h3 className="text-white mt-3 text-center font-semibold">
                {artist.name}
              </h3>

              <p className="text-zinc-500 text-xs text-center">
                {artist.genre}
              </p>
            </div>
          ))}

        </div>
      </section>

      {/* TOP TRACKS */}
      <section>
        <h2 className="text-2xl text-white font-bold mb-6">
          Top Releases
        </h2>

        <div className="space-y-2">

          {popularTracks.map((song, index) => (
            <div
              key={song.id}
              onClick={() => onSongSelect(song)}
              className="flex items-center gap-4 p-4 hover:bg-zinc-900 rounded-lg cursor-pointer"
            >
              <span className="text-zinc-500 w-6">{index + 1}</span>

              <img
                src={song.coverUrl}
                className="w-14 h-14 rounded-lg object-cover"
              />

              <div className="flex-1">
                <h4 className="text-white font-semibold">
                  {song.title}
                </h4>

                <p className="text-zinc-400 text-sm">
                  {song.artist}
                </p>
              </div>

              <span className="text-zinc-500 text-sm">
                {song.duration}
              </span>

            </div>
          ))}

        </div>
      </section>

    </div>
  );
}