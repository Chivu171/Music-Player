import { useNavigate, useSearchParams, useOutletContext } from "react-router";
import { useState, useEffect } from "react";
import { Loader2, Play, Search as SearchIcon } from "lucide-react";
import { Song, Artist } from "../data/mockData";

interface OutletContext {
    onSongSelect: (song: Song) => void;
}

export function Search() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";
    const navigate = useNavigate();
    const { onSongSelect } = useOutletContext<OutletContext>();

    const [loading, setLoading] = useState(false);
    const [songs, setSongs] = useState<Song[]>([]);
    const [artists, setArtists] = useState<Artist[]>([]);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query.trim()) return;

            setLoading(true);
            try {
                const res = await fetch(`http://localhost:8000/api/songs/search?q=${encodeURIComponent(query)}`);
                const data = await res.json();

                const mappedSongs: Song[] = data.map((s: any) => ({
                    id: s._id,
                    title: s.title,
                    artist: s.artist?.name || "Unknown Artist",
                    album: "Single",
                    duration: `${Math.floor(s.duration / 60)}:${(s.duration % 60).toString().padStart(2, '0')}`,
                    coverUrl: s.coverUrl,
                    audioUrl: s.fileUrl
                }));

                const uniqueArtistsIds = new Set();
                const mappedArtists: Artist[] = [];
                data.forEach((s: any) => {
                    if (s.artist && !uniqueArtistsIds.has(s.artist._id)) {
                        uniqueArtistsIds.add(s.artist._id);
                        mappedArtists.push({
                            id: s.artist._id,
                            name: s.artist.name,
                            imageUrl: s.artist.imageUrl || 'https://res.cloudinary.com/dywwla9mp/image/upload/v1/default-artist.png',
                            genre: s.artist.genre || 'Artist',
                            followers: s.artist.followers?.toString() || '0'
                        });
                    }
                });

                setSongs(mappedSongs);
                setArtists(mappedArtists);
            } catch (error) {
                console.error("Failed to fetch full search results:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    if (!query) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] text-zinc-400">
                <SearchIcon size={64} className="mb-4 opacity-50 text-green-500" />
                <h2 className="text-2xl font-bold text-white mb-2">Search our library</h2>
                <p>Type in the search bar above to find songs, artists, and albums.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-160px)]">
                <Loader2 className="w-12 h-12 text-green-500 animate-spin" />
            </div>
        );
    }

    if (songs.length === 0 && artists.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] text-zinc-400">
                <SearchIcon size={64} className="mb-4 opacity-30" />
                <h2 className="text-2xl font-bold text-white mb-2">No results found for "{query}"</h2>
                <p>Please make sure your words are spelled correctly or use less or different keywords.</p>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto w-full">
            <h1 className="text-3xl font-bold text-white mb-8">
                Search results for <span className="text-green-400">"{query}"</span>
            </h1>

            {artists.length > 0 && (
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6">Artists</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {artists.map((artist) => (
                            <div
                                key={artist.id}
                                onClick={() => navigate(`/artist/${artist.id}`)}
                                className="bg-zinc-900/40 p-5 rounded-2xl hover:bg-zinc-800/50 transition-all cursor-pointer group/card border border-white/5"
                            >
                                <div className="relative mb-5">
                                    <img
                                        src={artist.imageUrl}
                                        alt={artist.name}
                                        className="w-full aspect-square object-cover rounded-full shadow-2xl shadow-black/50 group-hover/card:scale-105 transition-transform duration-500 ring-4 ring-transparent group-hover/card:ring-green-500/20"
                                    />
                                    <div className="absolute inset-0 rounded-full bg-black/20 group-hover/card:bg-transparent transition-colors" />
                                </div>
                                <h3 className="text-lg font-bold text-white text-center truncate group-hover/card:text-green-400 transition-colors">
                                    {artist.name}
                                </h3>
                                <p className="text-sm font-medium text-zinc-500 text-center capitalize mt-1">
                                    Artist
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {songs.length > 0 && (
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6">Songs</h2>
                    <div className="bg-zinc-900/30 rounded-2xl border border-white/5 overflow-hidden backdrop-blur-sm">
                        <div className="flex flex-col divide-y divide-white/5">
                            {songs.map((song, index) => (
                                <div
                                    key={song.id}
                                    onClick={() => onSongSelect(song)}
                                    className="p-4 hover:bg-white/5 cursor-pointer group flex items-center gap-4 transition-colors relative overflow-hidden"
                                >
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="w-8 text-center text-zinc-500 font-medium group-hover:text-white transition-colors">
                                        <span className="group-hover:hidden">{index + 1}</span>
                                        <Play size={16} className="hidden group-hover:inline-block text-green-500" fill="currentColor" />
                                    </div>

                                    <div className="relative">
                                        <img
                                            src={song.coverUrl}
                                            alt={song.title}
                                            className="w-12 h-12 rounded object-cover shadow-md"
                                        />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-white font-semibold truncate group-hover:text-green-400 transition-colors text-lg">
                                            {song.title}
                                        </h4>
                                        <p className="text-sm text-zinc-400 truncate">{song.artist}</p>
                                    </div>

                                    <div className="text-sm text-zinc-400 group-hover:text-white transition-colors truncate px-8 hidden md:block w-1/4">
                                        Single
                                    </div>

                                    <div className="text-sm font-medium text-zinc-500 tabular-nums w-16 text-right group-hover:text-white transition-colors">
                                        {song.duration}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
