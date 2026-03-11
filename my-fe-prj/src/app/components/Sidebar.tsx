import { Home, TrendingUp, Music, Album, User, ShieldCheck } from "lucide-react";
import { Link, useLocation } from "react-router";
import logo from "../../assets/logo.jpg";

export function Sidebar() {
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "admin";

  const navItems = isAdmin
    ? [{ path: "/admin", icon: ShieldCheck, label: "Admin" }]
    : [
      { path: "/", icon: Home, label: "Home" },
      { path: "/trending", icon: TrendingUp, label: "Trending" },
      { path: "/recommended", icon: Music, label: "Recommended" },
      { path: "/albums", icon: Album, label: "Albums" },
      { path: "/artists", icon: User, label: "Artists" },
    ];

  return (
    <aside className="w-56 bg-zinc-950 h-full flex flex-col border-r border-zinc-800">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-purple-500/20 border border-white/10">
          <img src={logo} alt="MusicFlow Logo" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent tracking-tight">
          MusicFlow
        </h1>
      </div>

      <nav className="flex-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg mb-1 transition-colors ${isActive
                ? "bg-zinc-800 text-white"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}