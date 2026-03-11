import { useState, useEffect } from "react";
import { API_URL } from "../apiConfig";
import { useParams, useNavigate, useOutletContext } from "react-router";
import { Play, Clock, Music, Loader2, ChevronLeft, Calendar, Disc } from "lucide-react";
import { Song } from "../data/mockData";

interface AlbumDetailData {
    id: string;
    name: string;
    artistName: string;
    thumbnail: string;
    description: string;
    createdAt: string;
    songs: Song[];
}

interface OutletContext {
    onSongSelect: (song: Song) => void;
}

export function AlbumDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { onSongSelect } = useOutletContext<OutletContext>();

    const [loading, setLoading] = useState(true);
    const [album, setAlbum] = useState<AlbumDetailData | null>(null);

    useEffect(() => {
        const fetchAlbumDetail = async () => {
            if (!id) return;
            try {
                const response = await fetch(`${API_URL}/playlists/${id}`);
                if (!response.ok) throw new Error("Album not found");

                const data = await response.json();

                setAlbum({
                    id: data._id,
                    name: data.name,
                    artistName: data.artistName || "Unknown Artist",
                    thumbnail: data.thumbnail || "https://marketplace.canva.com/EAFiB-8g3-E/1/0/1600w/canva-black-minimalist-vinyl-record-album-cover-gBwZOS_0A_w.jpg",
                    description: data.description || "",
                    createdAt: data.createdAt,
                    songs: (data.songs || []).map((s: any) => ({
                        id: s._id,
                        title: s.title,
                        artist: data.artistName,
                        album: data.name,
                        duration: `${Math.floor(s.duration / 60)}:${Math.floor(s.duration % 60).toString().padStart(2, '0')}`,
                        coverUrl: s.coverUrl,
                        audioUrl: s.fileUrl
                    }))
                });
            } catch (error) {
                console.error("Failed to fetch album details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAlbumDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-160px)]">
                <Loader2 className="w-12 h-12 text-green-500 animate-spin" />
            </div>
        );
    }

    if (!album) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] text-zinc-400">
                <h2 className="text-2xl font-bold text-white mb-2">Album not found</h2>
                <button onClick={() => navigate("/albums")} className="text-green-500 hover:underline">Go back to Albums</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-20">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="fixed top-24 left-8 z-50 p-3 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-white transition-all group"
            >
                <ChevronLeft className="group-hover:-translate-x-0.5 transition-transform" />
            </button>

            {/* Hero Section */}
            <div className="relative h-[500px] w-full overflow-hidden">
                {/* Blurred Background */}
                <div className="absolute inset-0">
                    <img src={album.thumbnail} alt="" className="w-full h-full object-cover blur-3xl scale-110 opacity-40" />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative h-full flex items-end p-8 lg:p-12 max-w-7xl mx-auto w-full gap-8 lg:gap-12 pb-16">
                    <div className="relative group shrink-0">
                        <img
                            src={album.thumbnail}
                            alt={album.name}
                            className="w-56 h-56 lg:w-72 lg:h-72 object-cover rounded-[40px] shadow-2xl ring-1 ring-white/10 transform transition-transform group-hover:scale-[1.02]"
                        />
                        <div className="absolute inset-0 rounded-[40px] ring-1 ring-inset ring-white/20" />
                    </div>

                    <div className="flex flex-col justify-end pb-4 min-w-0">
                        <div className="flex items-center gap-2 mb-4 bg-white/10 self-start px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                            <Disc size={14} className="text-green-400 animate-spin-slow" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Album</span>
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-black text-white mb-6 tracking-tighter leading-none break-words">
                            {album.name}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-zinc-300 font-bold">
                            <div
                                className="flex items-center gap-2 hover:text-white cursor-pointer transition-colors"
                                onClick={() => navigate(`/artists`)} // Assuming a general artists link for now
                            >
                                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden ring-2 ring-white/10">
                                    <Music size={16} />
                                </div>
                                <span className="text-lg">{album.artistName}</span>
                            </div>

                            <div className="flex items-center gap-2 text-zinc-500">
                                <span>•</span>
                                <Calendar size={18} />
                                <span>{new Date(album.createdAt).getFullYear()}</span>
                            </div>

                            <div className="flex items-center gap-2 text-zinc-500">
                                <span>•</span>
                                <span>{album.songs.length} songs</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Songs Section */}
            <div className="max-w-7xl mx-auto w-full px-8 lg:px-12 mt-8">
                {/* Action Bar */}
                <div className="flex items-center gap-8 mb-10 pb-8 border-b border-white/5">
                    <button
                        onClick={() => album.songs.length > 0 && onSongSelect(album.songs[0])}
                        className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-black hover:scale-110 active:scale-95 transition-all shadow-xl shadow-green-500/20 group"
                    >
                        <Play size={32} fill="currentColor" className="ml-1 group-hover:scale-110 transition-transform" />
                    </button>

                    <div className="flex flex-col">
                        <span className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-1">Description</span>
                        <p className="text-zinc-400 font-medium max-w-2xl text-sm leading-relaxed">
                            {album.description || "No description available for this album."}
                        </p>
                    </div>
                </div>

                {/* Songs List */}
                <div className="space-y-1">
                    {/* Header */}
                    <div className="grid grid-cols-[48px_1fr_120px] gap-4 px-4 py-3 text-xs font-black uppercase tracking-widest text-zinc-500 border-b border-white/5 mb-2">
                        <span className="text-center">#</span>
                        <span>Title</span>
                        <div className="flex justify-end pr-4">
                            <Clock size={14} />
                        </div>
                    </div>

                    {/* List */}
                    {album.songs.map((song, index) => (
                        <div
                            key={song.id}
                            onClick={() => onSongSelect(song)}
                            className="grid grid-cols-[48px_1fr_120px] gap-4 px-4 py-4 rounded-2xl hover:bg-white/5 cursor-pointer group transition-all items-center border border-transparent hover:border-white/5"
                        >
                            <div className="text-center font-bold text-zinc-500 group-hover:text-green-500 transition-colors tabular-nums">
                                <span className="group-hover:hidden">{index + 1}</span>
                                <Play size={16} className="hidden group-hover:inline-block mx-auto" fill="currentColor" />
                            </div>

                            <div className="flex flex-col min-w-0">
                                <span className="text-white font-bold truncate group-hover:text-green-400 transition-colors uppercase tracking-tight">
                                    {song.title}
                                </span>
                                <span className="text-xs text-zinc-500 font-bold group-hover:text-zinc-400 transition-colors tracking-wide">
                                    {album.artistName}
                                </span>
                            </div>

                            <div className="flex justify-end pr-4 text-zinc-500 font-bold tabular-nums">
                                {song.duration}
                            </div>
                        </div>
                    ))}

                    {album.songs.length === 0 && (
                        <div className="py-20 text-center bg-zinc-900/40 rounded-[40px] border border-dashed border-white/10">
                            <Music size={48} className="mx-auto text-zinc-700 mb-4" />
                            <p className="text-zinc-500 font-bold">This album is empty.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
