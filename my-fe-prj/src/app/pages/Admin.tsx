import React, { useState, useEffect } from "react";
import {
    Upload,
    Plus,
    Music2,
    Image as ImageIcon,
    User,
    ListMusic,
    Loader2,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    Search
} from "lucide-react";

interface Artist {
    _id: string;
    name: string;
}

interface Genre {
    _id: string;
    name: string;
}

interface Song {
    _id: string;
    title: string;
    artist: { name: string } | string;
}

export function Admin() {
    const [activeTab, setActiveTab] = useState<"upload" | "album" | "artist">("upload");
    const [artists, setArtists] = useState<Artist[]>([]);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [songs, setSongs] = useState<Song[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingData, setIsFetchingData] = useState(true);
    const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

    // Song Upload State
    const [songData, setSongData] = useState({
        title: "",
        artist: "",
        artistName: "", // for display/search
        genreId: "",
        album: ""
    });
    const [songFile, setSongFile] = useState<File | null>(null);
    const [coverFile, setCoverFile] = useState<File | null>(null);

    // Album State
    const [albumData, setAlbumData] = useState({
        name: "",
        description: "",
        artistName: "",
        thumbnail: "" // Not used in multipart but for model reference
    });
    const [selectedSongs, setSelectedSongs] = useState<string[]>([]);

    // Artist State
    const [artistData, setArtistData] = useState({
        name: "",
        bio: "",
        imageUrl: ""
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [artistsRes, genresRes, songsRes] = await Promise.all([
                    fetch("http://localhost:8000/api/artists"),
                    fetch("http://localhost:8000/api/genres"),
                    fetch("http://localhost:8000/api/songs/getsongs?limit=100")
                ]);
                const artistsData = await artistsRes.json();
                const genresData = await genresRes.json();
                const songsData = await songsRes.json();

                setArtists(artistsData);
                setGenres(genresData);
                setSongs(songsData.songs || []);
            } catch (err) {
                console.error("Failed to fetch data:", err);
            } finally {
                setIsFetchingData(false);
            }
        };
        fetchData();
    }, []);

    const toggleSongSelection = (songId: string) => {
        setSelectedSongs(prev =>
            prev.includes(songId)
                ? prev.filter(id => id !== songId)
                : [...prev, songId]
        );
    };

    const handleSongUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!songFile) {
            setMessage({ type: "error", text: "Please select a song file" });
            return;
        }

        setIsLoading(true);
        setMessage(null);

        const formData = new FormData();
        formData.append("title", songData.title);
        formData.append("artistId", songData.artist);
        formData.append("genreId", songData.genreId);
        formData.append("album", songData.album);
        formData.append("file", songFile);
        if (coverFile) {
            formData.append("cover", coverFile);
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:8000/api/upload", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Upload failed");

            setMessage({ type: "success", text: "Song uploaded successfully!" });
            setSongData({ title: "", artist: "", artistName: "", genreId: "", album: "" });
            setSongFile(null);
            setCoverFile(null);

            // Refresh song list to include the new song
            const songsRes = await fetch("http://localhost:8000/api/songs/getsongs?limit=100");
            const songsData = await songsRes.json();
            setSongs(songsData.songs || []);
        } catch (err: any) {
            setMessage({ type: "error", text: err.message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateAlbum = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:8000/api/playlists/admin/create-album", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...albumData,
                    songs: selectedSongs
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to create album");

            setMessage({ type: "success", text: "Album created successfully!" });
            setAlbumData({ name: "", description: "", artistName: "", thumbnail: "" });
            setSelectedSongs([]);
        } catch (err: any) {
            setMessage({ type: "error", text: err.message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateArtist = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:8000/api/artists", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(artistData)
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to create artist");

            setMessage({ type: "success", text: "Artist created successfully!" });
            setArtistData({ name: "", bio: "", imageUrl: "" });

            // Refresh artist list
            const artistsRes = await fetch("http://localhost:8000/api/artists");
            const artistsData = await artistsRes.json();
            setArtists(artistsData);
        } catch (err: any) {
            setMessage({ type: "error", text: err.message });
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetchingData) {
        return (
            <div className="flex-1 bg-zinc-950 flex items-center justify-center">
                <Loader2 className="animate-spin text-green-500" size={40} />
            </div>
        );
    }

    return (
        <div className="flex-1 bg-zinc-950 overflow-y-auto p-8 relative">
            {/* Full Screen Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 z-[100] bg-zinc-950/80 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
                    <div className="relative">
                        <div className="absolute inset-0 bg-green-500/20 blur-[100px] rounded-full animate-pulse" />
                        <div className="relative bg-zinc-900 border border-white/10 p-12 rounded-[40px] shadow-2xl flex flex-col items-center gap-6">
                            <div className="relative">
                                <Loader2 className="animate-spin text-green-500" size={64} strokeWidth={2.5} />
                                <div className="absolute inset-0 bg-green-500/20 blur-xl animate-pulse" />
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-2xl font-black text-white tracking-tight">Processing Media</h3>
                                <p className="text-zinc-400 font-medium">Uploading to Cloudinary...</p>
                            </div>
                            <div className="w-48 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 animate-progress origin-left" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-5xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Admin Dashboard</h1>
                    <p className="text-zinc-500 font-medium">Manage your music library and artists</p>
                </header>

                {/* Tabs */}
                <div className="flex gap-2 p-1.5 bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl w-fit mb-10">
                    <button
                        onClick={() => setActiveTab("upload")}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === "upload"
                            ? "bg-green-500 text-black shadow-lg shadow-green-500/20"
                            : "text-zinc-400 hover:text-white"
                            }`}
                    >
                        <Upload size={18} />
                        Upload Song
                    </button>
                    <button
                        onClick={() => setActiveTab("album")}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === "album"
                            ? "bg-green-500 text-black shadow-lg shadow-green-500/20"
                            : "text-zinc-400 hover:text-white"
                            }`}
                    >
                        <Plus size={18} />
                        Create Album
                    </button>
                    <button
                        onClick={() => setActiveTab("artist")}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === "artist"
                            ? "bg-green-500 text-black shadow-lg shadow-green-500/20"
                            : "text-zinc-400 hover:text-white"
                            }`}
                    >
                        <User size={18} />
                        Create Artist
                    </button>
                </div>

                {message && (
                    <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${message.type === "success"
                        ? "bg-green-500/10 border border-green-500/20 text-green-500"
                        : "bg-red-500/10 border border-red-500/20 text-red-500"
                        }`}>
                        {message.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                        <span className="font-bold">{message.text}</span>
                    </div>
                )}

                <div className="bg-zinc-900/40 backdrop-blur-2xl border border-white/5 rounded-[32px] p-10">
                    {activeTab === "upload" ? (
                        <form onSubmit={handleSongUpload} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-zinc-500 text-xs font-black uppercase tracking-widest px-1">Song Title</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Music2 size={18} className="text-zinc-600 group-focus-within:text-green-500 transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={songData.title}
                                            onChange={(e) => setSongData({ ...songData, title: e.target.value })}
                                            className="w-full bg-zinc-800/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all font-medium"
                                            placeholder="Enter song title"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-zinc-500 text-xs font-black uppercase tracking-widest px-1">Artist</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <User size={18} className="text-zinc-600 group-focus-within:text-green-500 transition-colors" />
                                        </div>
                                        <select
                                            required
                                            value={songData.artist}
                                            onChange={(e) => setSongData({ ...songData, artist: e.target.value })}
                                            className="w-full bg-zinc-800/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all font-medium appearance-none"
                                        >
                                            <option value="" className="bg-zinc-900">Select Artist</option>
                                            {artists.map(a => (
                                                <option key={a._id} value={a._id} className="bg-zinc-900">{a.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-zinc-500 text-xs font-black uppercase tracking-widest px-1">Genre</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <ListMusic size={18} className="text-zinc-600 group-focus-within:text-green-500 transition-colors" />
                                        </div>
                                        <select
                                            required
                                            value={songData.genreId}
                                            onChange={(e) => setSongData({ ...songData, genreId: e.target.value })}
                                            className="w-full bg-zinc-800/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all font-medium appearance-none"
                                        >
                                            <option value="" className="bg-zinc-900">Select Genre</option>
                                            {genres.map(g => (
                                                <option key={g._id} value={g._id} className="bg-zinc-900">{g.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-zinc-500 text-xs font-black uppercase tracking-widest px-1">Album Name (Optional)</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Search size={18} className="text-zinc-600 group-focus-within:text-green-500 transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            value={songData.album}
                                            onChange={(e) => setSongData({ ...songData, album: e.target.value })}
                                            className="w-full bg-zinc-800/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all font-medium"
                                            placeholder="Enter album name"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-zinc-500 text-xs font-black uppercase tracking-widest px-1">Audio File</label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="audio/*"
                                            required
                                            onChange={(e) => setSongFile(e.target.files?.[0] || null)}
                                            className="hidden"
                                            id="song-file"
                                        />
                                        <label
                                            htmlFor="song-file"
                                            className={`flex flex-col items-center justify-center gap-3 w-full h-32 bg-zinc-800/30 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-green-500/50 hover:bg-green-500/5 transition-all ${songFile ? 'border-green-500/50 bg-green-500/5' : ''}`}
                                        >
                                            <Upload size={24} className={songFile ? 'text-green-500' : 'text-zinc-600'} />
                                            <span className={`text-sm font-bold ${songFile ? 'text-green-500' : 'text-zinc-500'}`}>
                                                {songFile ? songFile.name : "Choose audio file"}
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-zinc-500 text-xs font-black uppercase tracking-widest px-1">Cover Art (Optional)</label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                                            className="hidden"
                                            id="cover-file"
                                        />
                                        <label
                                            htmlFor="cover-file"
                                            className={`flex flex-col items-center justify-center gap-3 w-full h-32 bg-zinc-800/30 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-green-500/50 hover:bg-green-500/5 transition-all ${coverFile ? 'border-green-500/50 bg-green-500/5' : ''}`}
                                        >
                                            <ImageIcon size={24} className={coverFile ? 'text-green-500' : 'text-zinc-600'} />
                                            <span className={`text-sm font-bold ${coverFile ? 'text-green-500' : 'text-zinc-500'}`}>
                                                {coverFile ? coverFile.name : "Choose cover image"}
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-green-500 hover:bg-green-400 text-black h-16 rounded-2xl font-black flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] mt-8 shadow-xl shadow-green-500/20 disabled:opacity-50"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" /> : "Publish Song"}
                                </button>
                            </div>
                        </form>
                    ) : activeTab === "album" ? (
                        <form onSubmit={handleCreateAlbum} className="max-w-2xl mx-auto space-y-8">
                            <div className="space-y-2">
                                <label className="text-zinc-500 text-xs font-black uppercase tracking-widest px-1">Album Title</label>
                                <input
                                    type="text"
                                    required
                                    value={albumData.name}
                                    onChange={(e) => setAlbumData({ ...albumData, name: e.target.value })}
                                    className="w-full bg-zinc-800/40 border border-white/5 rounded-2xl py-4 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all font-medium"
                                    placeholder="Enter album title"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-zinc-500 text-xs font-black uppercase tracking-widest px-1">Artist Name</label>
                                <select
                                    required
                                    value={albumData.artistName}
                                    onChange={(e) => setAlbumData({ ...albumData, artistName: e.target.value })}
                                    className="w-full bg-zinc-800/40 border border-white/5 rounded-2xl py-4 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all font-medium appearance-none"
                                >
                                    <option value="" className="bg-zinc-900">Select Artist</option>
                                    {artists.map(a => (
                                        <option key={a._id} value={a.name} className="bg-zinc-900">{a.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-zinc-500 text-xs font-black uppercase tracking-widest px-1">Description</label>
                                <textarea
                                    value={albumData.description}
                                    onChange={(e) => setAlbumData({ ...albumData, description: e.target.value })}
                                    rows={4}
                                    className="w-full bg-zinc-800/40 border border-white/5 rounded-2xl py-4 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all font-medium resize-none"
                                    placeholder="Tell us about this album..."
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-1">
                                    <label className="text-zinc-500 text-xs font-black uppercase tracking-widest">Select Songs ({selectedSongs.length})</label>
                                    <span className="text-[10px] text-zinc-600 font-bold bg-zinc-800 px-2 py-0.5 rounded-full uppercase tracking-tighter">Optional</span>
                                </div>
                                <div className="bg-zinc-800/20 border border-white/5 rounded-2xl overflow-hidden">
                                    <div className="max-h-64 overflow-y-auto custom-scrollbar p-2 space-y-1">
                                        {songs.length > 0 ? (
                                            songs.map((song) => (
                                                <div
                                                    key={song._id}
                                                    onClick={() => toggleSongSelection(song._id)}
                                                    className={`group flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all ${selectedSongs.includes(song._id)
                                                        ? "bg-green-500/10 border border-green-500/20"
                                                        : "hover:bg-white/5 border border-transparent"
                                                        }`}
                                                >
                                                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${selectedSongs.includes(song._id)
                                                        ? "bg-green-500 border-green-500"
                                                        : "border-zinc-700 group-hover:border-zinc-500"
                                                        }`}>
                                                        {selectedSongs.includes(song._id) && <CheckCircle2 size={12} className="text-black" strokeWidth={4} />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`font-bold text-sm truncate ${selectedSongs.includes(song._id) ? "text-green-500" : "text-zinc-200"}`}>
                                                            {song.title}
                                                        </p>
                                                        <p className="text-xs text-zinc-500 truncate">
                                                            {typeof song.artist === 'object' ? song.artist.name : song.artist}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-8 text-center text-zinc-600">
                                                <Music2 className="mx-auto mb-2 opacity-20" size={32} />
                                                <p className="text-xs font-medium">No songs discovered yet</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-green-500 hover:bg-green-400 text-black h-16 rounded-2xl font-black flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-green-500/20 disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 className="animate-spin" /> : "Create Collection"}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleCreateArtist} className="max-w-2xl mx-auto space-y-8">
                            <div className="space-y-2">
                                <label className="text-zinc-500 text-xs font-black uppercase tracking-widest px-1">Artist Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User size={18} className="text-zinc-600 group-focus-within:text-green-500 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={artistData.name}
                                        onChange={(e) => setArtistData({ ...artistData, name: e.target.value })}
                                        className="w-full bg-zinc-800/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all font-medium"
                                        placeholder="Enter artist name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-zinc-500 text-xs font-black uppercase tracking-widest px-1">Image URL (Optional)</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <ImageIcon size={18} className="text-zinc-600 group-focus-within:text-green-500 transition-colors" />
                                    </div>
                                    <input
                                        type="url"
                                        value={artistData.imageUrl}
                                        onChange={(e) => setArtistData({ ...artistData, imageUrl: e.target.value })}
                                        className="w-full bg-zinc-800/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all font-medium"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-zinc-500 text-xs font-black uppercase tracking-widest px-1">Artist Bio</label>
                                <textarea
                                    value={artistData.bio}
                                    onChange={(e) => setArtistData({ ...artistData, bio: e.target.value })}
                                    rows={4}
                                    className="w-full bg-zinc-800/40 border border-white/5 rounded-2xl py-4 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all font-medium resize-none"
                                    placeholder="Tell us about this artist..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-green-500 hover:bg-green-400 text-black h-16 rounded-2xl font-black flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-green-500/20 disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 className="animate-spin" /> : "Confirm Creation"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
