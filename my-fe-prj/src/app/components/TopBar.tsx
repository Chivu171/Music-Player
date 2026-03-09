import { Search, Settings, LogOut, User as UserIcon, Loader2, Play } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { Song, Artist } from "../data/mockData";

export function TopBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<{ songs: Song[], artists: Artist[] }>({ songs: [], artists: [] });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch results when debounced query changes
  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery.trim()) {
        setSearchResults({ songs: [], artists: [] });
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const res = await fetch(`http://localhost:8000/api/songs/search?q=${encodeURIComponent(debouncedQuery)}`);
        const data = await res.json();

        // The API returns songs, we can extract unique artists from the song results or a separate API.
        // For now, based on instructions, we'll map songs and extract their artists to show a mixed view.
        const songs: Song[] = data.map((s: any) => ({
          id: s._id,
          title: s.title,
          artist: s.artist?.name || "Unknown Artist",
          album: "Single",
          duration: `${Math.floor(s.duration / 60)}:${(s.duration % 60).toString().padStart(2, '0')}`,
          coverUrl: s.coverUrl,
          audioUrl: s.fileUrl
        }));

        // Deduplicate artists from the searched songs just to show them in the artists section if any
        const uniqueArtistsIds = new Set();
        const artists: Artist[] = [];
        data.forEach((s: any) => {
          if (s.artist && !uniqueArtistsIds.has(s.artist._id)) {
            uniqueArtistsIds.add(s.artist._id);
            artists.push({
              id: s.artist._id,
              name: s.artist.name,
              imageUrl: s.artist.imageUrl || 'https://res.cloudinary.com/dywwla9mp/image/upload/v1/default-artist.png',
              genre: s.artist.genre || 'Artist',
              followers: s.artist.followers?.toString() || '0'
            });
          }
        });

        setSearchResults({ songs: songs.slice(0, 4), artists: artists.slice(0, 3) });
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsSearching(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setIsDropdownOpen(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSeeAll = () => {
    setIsDropdownOpen(false);
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="h-16 bg-zinc-950/50 backdrop-blur-sm border-b border-zinc-800 px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex-1 max-w-2xl" ref={searchRef}>
        <div className="relative group">
          {isSearching ? (
            <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500 animate-spin" size={20} />
          ) : (
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isDropdownOpen && searchQuery ? 'text-green-500' : 'text-zinc-500 group-focus-within:text-green-500'}`} size={20} />
          )}
          <input
            type="text"
            placeholder="Search for songs, artists, or albums..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            onKeyDown={handleSearchSubmit}
            className="w-full bg-zinc-900/50 text-white pl-12 pr-4 py-2.5 rounded-full outline-none focus:ring-2 focus:ring-green-500/20 focus:bg-zinc-900 transition-all placeholder:text-zinc-600 border border-transparent"
          />

          {/* Search Autocomplete Dropdown */}
          {isDropdownOpen && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="max-h-[70vh] overflow-y-auto p-2">

                {(!isSearching && searchResults.songs.length === 0 && searchResults.artists.length === 0) && (
                  <div className="p-8 text-center text-zinc-400">
                    No results found for "{searchQuery}"
                  </div>
                )}

                {searchResults.songs.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider px-3 py-2 mb-1">Songs</h3>
                    <div className="flex flex-col gap-1">
                      {searchResults.songs.map(song => (
                        <div key={song.id} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-xl cursor-pointer group transition-colors">
                          <div className="relative flex-shrink-0">
                            <img src={song.coverUrl} alt={song.title} className="w-10 h-10 rounded object-cover shadow-sm" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded">
                              <Play size={16} className="text-white" fill="currentColor" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate group-hover:text-green-400 transition-colors">{song.title}</p>
                            <p className="text-xs text-zinc-400 truncate">{song.artist}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.artists.length > 0 && (
                  <div className="mb-2">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider px-3 py-2 mb-1">Artists</h3>
                    <div className="flex flex-col gap-1">
                      {searchResults.artists.map(artist => (
                        <div
                          key={artist.id}
                          onClick={() => {
                            setIsDropdownOpen(false);
                            navigate(`/artist/${artist.id}`);
                          }}
                          className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-xl cursor-pointer group transition-colors"
                        >
                          <img src={artist.imageUrl} alt={artist.name} className="w-10 h-10 rounded-full object-cover shadow-sm ring-1 ring-white/10" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate group-hover:text-green-400 transition-colors">{artist.name}</p>
                            <p className="text-xs text-zinc-500 capitalize">{artist.genre}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* See All Button */}
              {(searchResults.songs.length > 0 || searchResults.artists.length > 0) && (
                <div
                  onClick={handleSeeAll}
                  className="bg-white/5 hover:bg-white/10 p-3 text-center text-sm font-bold text-white cursor-pointer border-t border-white/5 transition-colors"
                >
                  See all results for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-zinc-400 hover:text-white transition-colors">
          <Settings size={20} />
        </button>

        {user ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 rounded-full border border-white/5">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-black text-sm font-black">
                {user.username?.[0]?.toUpperCase() || "U"}
              </div>
              <span className="text-sm text-zinc-300 font-bold pr-1">{user.username}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-zinc-500 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-white font-bold text-sm px-6 py-2.5 rounded-full hover:bg-white/5 transition-all outline outline-1 outline-white/10"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="bg-white text-black font-black text-sm px-6 py-2.5 rounded-full hover:bg-zinc-200 transition-all shadow-lg"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
