import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Play, Loader2, UserCheck } from "lucide-react";
import { Song, Artist } from "../data/mockData";
import { useOutletContext } from "react-router";

interface OutletContext {
    onSongSelect: (song: Song) => void;
}

export function ArtistDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { onSongSelect } = useOutletContext<OutletContext>();

    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [artist, setArtist] = useState<Artist | null>(null);
    const [songs, setSongs] = useState<Song[]>([]);
    const [albums, setAlbums] = useState<any[]>([]);

    useEffect(() => {
        const fetchArtistData = async () => {
            if (!id) return;
            setLoading(true);
            try {
                // Fetch Artist
                const artistRes = await fetch(`http://localhost:8000/api/artists/${id}`);
                if (!artistRes.ok) throw new Error("Artist not found");
                const artistData = await artistRes.json();

                setArtist({
                    id: artistData._id,
                    name: artistData.name,
                    imageUrl: artistData.imageUrl || 'https://res.cloudinary.com/dywwla9mp/image/upload/v1/default-artist.png',
                    genre: artistData.genre || 'Artist',
                    followers: artistData.followers?.toLocaleString() || '0',
                    bio: artistData.bio || 'Mô tả về nghệ sĩ chưa được cập nhật.'
                } as any);

                // Fetch Songs
                const songsRes = await fetch(`http://localhost:8000/api/songs/artist/${id}`);
                const songsData = await songsRes.json();
                setSongs(songsData.map((s: any) => ({
                    id: s._id,
                    title: s.title,
                    artist: s.artist?.name || artistData.name,
                    album: "Single",
                    duration: `${Math.floor(s.duration / 60)}:${(s.duration % 60).toString().padStart(2, '0')}`,
                    coverUrl: s.coverUrl,
                    audioUrl: s.fileUrl
                })));

                // Fetch Albums (Playlists with type=album)
                const token = localStorage.getItem("token");
                const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

                const albumsRes = await fetch(`http://localhost:8000/api/playlists/albums?artistName=${encodeURIComponent(artistData.name)}`, { headers });
                if (albumsRes.ok) {
                    const albumsData = await albumsRes.json();
                    setAlbums(albumsData);
                }

                // Fetch if following
                if (token) {
                    const followedRes = await fetch("http://localhost:8000/api/auth/followed-artists", { headers });
                    if (followedRes.ok) {
                        const followedData = await followedRes.json();
                        setIsFollowing(followedData.some((a: any) => a._id === id));
                    }
                }

            } catch (error) {
                console.error("Failed to load artist details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchArtistData();
    }, [id]);

    const handleFollow = async () => {
        if (!artist || isFollowing) return;
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }
            const res = await fetch(`http://localhost:8000/api/auth/follow/${artist.id}`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                // Remove commas and parse to int, increment, then put commas back
                const currentFollowers = parseInt(artist.followers.replace(/,/g, '')) || 0;
                setArtist(prev => prev ? {
                    ...prev,
                    followers: (currentFollowers + 1).toLocaleString()
                } : null);
                setIsFollowing(true);
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

    if (!artist) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] text-zinc-400">
                <h2 className="text-2xl font-bold text-white mb-2">Artist not found</h2>
                <button onClick={() => navigate("/artists")} className="text-green-500 hover:underline">Go back to Artists</button>
            </div>
        );
    }

    return (
        <div className="pb-20">
            {/* Hero Section */}
            <div className="relative h-[400px] flex items-end">
                <div className="absolute inset-0">
                    <img src={artist.imageUrl} alt={artist.name} className="w-full h-full object-cover blur-sm opacity-50" />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
                </div>

                <div className="relative z-10 p-8 flex items-end gap-8 max-w-7xl mx-auto w-full">
                    <img
                        src={artist.imageUrl}
                        alt={artist.name}
                        className="w-56 h-56 rounded-full object-cover shadow-2xl ring-4 ring-white/10"
                    />
                    <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <UserCheck className="text-blue-400" size={20} />
                            <span className="text-sm font-bold text-white uppercase tracking-widest">Verified Artist</span>
                        </div>
                        <h1 className="text-7xl font-bold text-white mb-6 tracking-tighter">{artist.name}</h1>
                        <div className="flex items-center gap-4 text-zinc-300">
                            <p className="font-medium text-lg">{artist.followers} <span className="text-zinc-500 text-sm">Monthly Listeners</span></p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto w-full p-8">
                {/* Controls */}
                <div className="flex items-center gap-6 mb-12">
                    <button
                        className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-green-500/20"
                        onClick={() => songs.length > 0 && onSongSelect(songs[0])}
                    >
                        <Play size={28} fill="currentColor" className="ml-1" />
                    </button>
                    <button
                        onClick={handleFollow}
                        disabled={isFollowing}
                        className={`px-8 py-2 rounded-full border text-sm font-bold tracking-widest transition-colors ${isFollowing
                            ? "bg-white text-black border-white"
                            : "border-zinc-500 text-white hover:border-white"
                            }`}
                    >
                        {isFollowing ? "FOLLOWING" : "FOLLOW"}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content: Songs & Albums */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* Popular Songs */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6">Popular</h2>
                            {songs.length > 0 ? (
                                <div className="flex flex-col">
                                    {songs.slice(0, 5).map((song, index) => (
                                        <div
                                            key={song.id}
                                            onClick={() => onSongSelect(song)}
                                            className="p-3 hover:bg-white/5 cursor-pointer group flex items-center gap-4 rounded-xl transition-colors"
                                        >
                                            <div className="w-6 text-center text-zinc-500 font-medium group-hover:text-white">
                                                <span className="group-hover:hidden">{index + 1}</span>
                                                <Play size={14} className="hidden group-hover:inline-block text-white" fill="currentColor" />
                                            </div>
                                            <img src={song.coverUrl} alt={song.title} className="w-12 h-12 rounded bg-zinc-800 object-cover" />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-white font-semibold truncate group-hover:text-green-400 transition-colors">{song.title}</h4>
                                            </div>
                                            <div className="text-sm font-medium text-zinc-500 tabular-nums w-16 text-right">
                                                {song.duration}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-zinc-500">Chưa có bài hát nào.</p>
                            )}
                        </section>

                        {/* Albums */}
                        {albums.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-6">Albums</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {albums.map((album) => (
                                        <div key={album._id} className="bg-zinc-900/40 p-4 rounded-2xl hover:bg-zinc-800/60 transition-all cursor-pointer group">
                                            <div className="relative mb-4">
                                                <img src={album.thumbnail || 'https://marketplace.canva.com/EAFiB-8g3-E/1/0/1600w/canva-black-minimalist-vinyl-record-album-cover-gBwZOS_0A_w.jpg'} alt={album.name} className="w-full aspect-square object-cover rounded-xl shadow-lg" />
                                                <button className="absolute bottom-3 right-3 bg-green-500 text-black rounded-full p-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all shadow-xl hover:scale-105">
                                                    <Play size={20} fill="currentColor" />
                                                </button>
                                            </div>
                                            <h3 className="text-white font-bold truncate mb-1">{album.name}</h3>
                                            <p className="text-sm text-zinc-500">{new Date(album.createdAt).getFullYear()} • Album</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                    </div>

                    {/* Sidebar: About */}
                    <div className="lg:col-span-1">
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6">About</h2>
                            <div className="bg-zinc-900 rounded-2xl p-6 group hover:bg-zinc-800/80 transition-colors cursor-pointer relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-zinc-800 to-transparent opacity-50 transition-opacity group-hover:opacity-100" />
                                <div className="relative z-10">
                                    <p className="text-zinc-300 font-medium leading-relaxed mb-4 line-clamp-6 text-sm">
                                        {(artist as any).bio}
                                    </p>
                                    <div className="mt-6 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-2xl font-bold text-white">{artist.followers}</span>
                                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Followers</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
