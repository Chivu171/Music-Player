import { Search, Settings } from "lucide-react";
import { useState } from "react";

export function TopBar() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="h-16 bg-zinc-950/50 backdrop-blur-sm border-b border-zinc-800 px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex-1 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
          <input
            type="text"
            placeholder="Search for songs, artists, or albums..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 text-white pl-12 pr-4 py-2.5 rounded-full outline-none focus:ring-2 focus:ring-zinc-700 transition-all placeholder:text-zinc-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-zinc-400 hover:text-white transition-colors">
          <Settings size={20} />
        </button>
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm">
          U
        </div>
      </div>
    </div>
  );
}
