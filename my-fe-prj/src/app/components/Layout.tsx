import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { PlayerBar } from "./PlayerBar";
import { useState } from "react";
import { Song } from "../data/mockData";

export function Layout() {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);

  const handleNext = () => {
    console.log("Next song");
  };

  const handlePrevious = () => {
    console.log("Previous song");
  };

  return (
    <div className="h-screen flex flex-col bg-zinc-950">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          <div className="flex-1 overflow-y-auto">
            <Outlet context={{ onSongSelect: setCurrentSong }} />
          </div>
        </main>
      </div>
      <PlayerBar
        currentSong={currentSong}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </div>
  );
}
