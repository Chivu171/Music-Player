import { useOutletContext, useNavigate } from "react-router";
import { Play, UserCheck, Music2, Loader2 } from "lucide-react";
import { Song, Artist } from "../data/mockData";
import { useState, useEffect } from "react";
import { API_URL } from "../apiConfig";

interface OutletContext {
  onSongSelect: (song: Song) => void;
}

export function Artists() {
  const { onSongSelect } = useOutletContext<OutletContext>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [trendingArtists, setTrendingArtists] = useState<Artist[]>([]);
  const [allArtists, setAllArtists] = useState<Artist[]>([]);
  const [popularTracks, setPopularTracks] = useState<Song[]>([]);
  const [followedArtists, setFollowedArtists] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch trending artists for spotlight and trending sections
        const trendingRes = await fetch(`${API_URL}/artists/trending?limit=6`);
        const trendingData = await trendingRes.json();

        // Fetch all artists
        const allRes = await fetch(`${API_URL}/artists`);
        const allData = await allRes.json();

        // Fetch popular tracks
        const popularRes = await fetch(`${API_URL}/songs/popular?limit=8`);
        const popularData = await popularRes.json();

        // Map backend data to frontend interfaces
        const mapArtist = (a: any): Artist => ({
          id: a._id || a.id,
          name: a.name,
          imageUrl: a.imageUrl || 'https://res.cloudinary.com/dywwla9mp/image/upload/v1/default-artist.png',
          followers: a.followers?.toLocaleString() || "0",
          genre: a.genre || "Artist"
        });

        const mapSong = (s: any): Song => ({
          id: s._id,
          title: s.title,
          artist: s.artist?.name || "Unknown Artist",
          album: "Single",
          duration: `${Math.floor(s.duration / 60)}:${(s.duration % 60).toString().padStart(2, '0')}`,
          coverUrl: s.coverUrl,
          audioUrl: s.fileUrl
        });

        setTrendingArtists(trendingData.map(mapArtist));
        setAllArtists(allData.map(mapArtist));
        setPopularTracks(popularData.map(mapSong));

        // Fetch followed artists if logged in
        const token = localStorage.getItem("token");
        if (token) {
          const followedRes = await fetch(`${API_URL}/auth/followed-artists`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (followedRes.ok) {
            const followedData = await followedRes.json();
            setFollowedArtists(new Set(followedData.map((a: any) => a._id)));
          }
        }
      } catch (error) {
        console.error("Failed to fetch artists data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFollow = async (artistId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent navigation
    if (followedArtists.has(artistId)) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const res = await fetch(`${API_URL}/auth/follow/${artistId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setFollowedArtists(prev => new Set(prev).add(artistId));
      }
    } catch (error) {
      console.error("Failed to follow artist:", error);
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
      {/* Hero Section */}
      <div className="relative h-80 rounded-lg overflow-hidden mb-8 shadow-2xl">
        <img
          src="https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=1200"
          alt="Artists"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8">
          <div className="flex items-center gap-2 mb-2">
            <Music2 size={24} className="text-green-500 drop-shadow-glow" />
            <span className="text-sm uppercase tracking-widest text-zinc-300 font-medium">
              Discover
            </span>
          </div>
          <h1 className="text-6xl font-bold text-white mb-4 tracking-tight text-shadow-lg">Artists</h1>
          <p className="text-zinc-200 text-lg max-w-xl">
            Follow your favorite artists and discover new ones tailored just for you.
          </p>
        </div>
      </div>

      {/* Top Artists Spotlight */}
      {spotlightArtists.length > 0 && (
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">Top Artists This Month</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {spotlightArtists.map((artist, index) => (
              <div
                key={artist.id}
                onClick={() => navigate(`/artist/${artist.id}`)}
                className="relative bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl overflow-hidden hover:scale-[1.03] transition-all duration-300 cursor-pointer group border border-white/5 shadow-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                <div className="relative p-8">
                  <div className="absolute top-4 right-4 bg-yellow-500 text-black rounded-full w-10 h-10 flex items-center justify-center text-lg font-black shadow-lg shadow-yellow-500/20">
                    {index + 1}
                  </div>
                  <div className="flex flex-col items-center text-center pt-4">
                    <img
                      src={artist.imageUrl}
                      alt={artist.name}
                      className="w-40 h-40 rounded-full object-cover mb-6 ring-4 ring-white/10 group-hover:ring-green-500/30 transition-all duration-500 shadow-2xl"
                    />
                    <h3 className="text-2xl font-bold text-white mb-1">{artist.name}</h3>
                    <p className="text-zinc-400 mb-6 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      {artist.genre}
                    </p>
                    <div className="flex gap-3">
                      <button className="bg-white text-black px-6 py-2.5 rounded-full font-bold hover:bg-green-500 hover:text-black transition-all flex items-center gap-2 shadow-lg shadow-white/5">
                        <Play size={16} fill="currentColor" />
                        Play
                      </button>
                      <button
                        onClick={(e) => handleFollow(artist.id, e)}
                        disabled={followedArtists.has(artist.id)}
                        className={`px-6 py-2.5 rounded-full font-bold transition-all border ${followedArtists.has(artist.id)
                          ? "bg-white text-black border-white"
                          : "bg-zinc-800/80 backdrop-blur-md text-white hover:bg-zinc-700 border-white/10"
                          }`}
                      >
                        {followedArtists.has(artist.id) ? "Following" : "Follow"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Trending Artists */}
      <section className="mb-12">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Trending Artists</h2>
            <p className="text-zinc-500 text-sm">Most listened this week</p>
          </div>
          <button className="text-xs font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-widest bg-zinc-900/50 px-4 py-2 rounded-full border border-white/5">
            See all
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {weeklyTrending.map((artist) => (
            <div
              key={artist.id}
              onClick={() => navigate(`/artist/${artist.id}`)}
              className="bg-zinc-900/40 backdrop-blur-sm border border-white/5 rounded-xl p-5 hover:bg-zinc-800/50 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-5">
                <div className="relative">
                  <img
                    src={artist.imageUrl}
                    alt={artist.name}
                    className="w-20 h-20 rounded-full object-cover shadow-lg shadow-black/50"
                  />
                  <div className="absolute inset-0 rounded-full border-2 border-green-500/20 group-hover:border-green-500/50 transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-white truncate group-hover:text-green-400 transition-colors">{artist.name}</h3>
                  <p className="text-sm text-zinc-400 mb-3">{artist.genre}</p>
                  <button
                    onClick={(e) => handleFollow(artist.id, e)}
                    disabled={followedArtists.has(artist.id)}
                    className={`text-xs font-bold border px-4 py-1.5 rounded-full transition-all flex items-center gap-2 w-fit ${followedArtists.has(artist.id)
                      ? "bg-white text-black border-white"
                      : "text-white/90 bg-white/5 border-white/5 hover:bg-white/10"
                      }`}
                  >
                    {!followedArtists.has(artist.id) && <UserCheck size={12} />}
                    {followedArtists.has(artist.id) ? "Following" : "Follow"}
                  </button>
                </div>
                <button className="bg-white text-black rounded-full p-3 transform translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 shadow-xl shadow-white/10">
                  <Play size={18} fill="currentColor" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* All Artists Grid */}
      <section className="mb-12">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold text-white">All Artists</h2>
          <div className="flex gap-2">
            <button className="px-4 py-1.5 bg-green-500 text-black font-bold rounded-full text-xs shadow-lg shadow-green-500/20">
              Popular
            </button>
            <button className="px-4 py-1.5 bg-zinc-900 text-zinc-400 font-bold rounded-full text-xs hover:bg-zinc-800 transition-colors border border-white/5">
              A-Z
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {allArtists.map((artist) => (
            <div
              key={artist.id}
              onClick={() => navigate(`/artist/${artist.id}`)}
              className="bg-zinc-900/30 p-5 rounded-2xl hover:bg-zinc-800/40 transition-all cursor-pointer group/card border border-white/5"
            >
              <div className="relative mb-6">
                <img
                  src={artist.imageUrl}
                  alt={artist.name}
                  className="w-full aspect-square object-cover rounded-full shadow-2xl group-hover/card:scale-[1.05] transition-transform duration-500"
                />
                <button className="absolute bottom-0 right-0 bg-green-500 text-black rounded-full p-3.5 opacity-0 group-hover/card:opacity-100 translate-y-4 group-hover/card:translate-y-0 transition-all shadow-xl hover:scale-110 active:scale-95 duration-300">
                  <Play size={20} fill="currentColor" />
                </button>
              </div>
              <h3 className="text-white font-bold truncate mb-1 text-center group-hover/card:text-green-400 transition-colors">
                {artist.name}
              </h3>
              <p className="text-xs text-zinc-500 truncate text-center font-medium uppercase tracking-wider">
                {artist.genre}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Tracks Section - Premium Chart Look */}
      {popularTracks.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-8 bg-green-500 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
              <h2 className="text-3xl font-black text-white tracking-tight uppercase italic">Top Releases</h2>
            </div>
            <button className="text-xs font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-widest px-6 py-2 border border-white/5 rounded-full hover:bg-white/5">
              Refreshed Daily
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-2 bg-zinc-900/20 p-4 rounded-[32px] border border-white/5 backdrop-blur-xl">
            {popularTracks.slice(0, 8).map((song, index) => (
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

function TrackItem({ song, index, onSongSelect }: { song: Song; index: number; onSongSelect: (song: Song) => void }) {
  return (
    <div
      onClick={() => onSongSelect(song)}
      className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-white/[0.03] transition-all duration-300 cursor-pointer relative overflow-hidden active:scale-[0.98]"
    >
      {/* Background Glow on Hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-center gap-6 relative z-10 w-full">
        <span className="text-2xl font-black text-zinc-700 w-8 group-hover:text-green-500/50 transition-colors italic tracking-tighter">
          {index.toString().padStart(2, '0')}
        </span>

        <div className="relative flex-shrink-0">
          <img
            src={song.coverUrl}
            alt={song.title}
            className="w-16 h-16 rounded-xl object-cover shadow-2xl group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 rounded-xl backdrop-blur-[2px]">
            <Play size={24} className="text-white scale-75 group-hover:scale-100 transition-transform" fill="currentColor" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-white font-bold text-lg truncate group-hover:text-green-400 transition-colors tracking-tight">
            {song.title}
          </h4>
          <p className="text-zinc-400 text-sm font-medium truncate group-hover:text-zinc-300 transition-colors">
            {song.artist}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="h-6 w-px bg-white/5" />
          <span className="text-sm font-bold text-zinc-600 tabular-nums group-hover:text-zinc-400 transition-colors">
            {song.duration}
          </span>
        </div>
      </div>
    </div>
  );
}

