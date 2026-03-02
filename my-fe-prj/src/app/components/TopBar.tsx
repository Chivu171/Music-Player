import { Search, Settings, LogOut, User as UserIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";

export function TopBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="h-16 bg-zinc-950/50 backdrop-blur-sm border-b border-zinc-800 px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex-1 max-w-2xl">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-green-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search for songs, artists, or albums..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900/50 text-white pl-12 pr-4 py-2.5 rounded-full outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all placeholder:text-zinc-600 border border-transparent"
          />
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
