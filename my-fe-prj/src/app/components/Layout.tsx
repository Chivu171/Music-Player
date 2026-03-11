import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { PlayerBar } from "./PlayerBar";
import { useState, useCallback } from "react";
import { Song } from "../data/mockData";
import { API_URL } from "../apiConfig";
import { useQueryClient } from "@tanstack/react-query";

export function Layout() {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  const queryClient = useQueryClient();

  const handleNext = () => {
    if (currentIndex < queue.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentSong(queue[nextIndex]);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setCurrentSong(queue[prevIndex]);
    }
  };

  const handleSongSelect = useCallback(
    async (song: Song, songs: Song[]) => {
      const index = songs.findIndex((s) => s.id === song.id);

      setQueue(songs);
      setCurrentIndex(index);
      setCurrentSong(song);

      // Add to history if logged in
      const token = localStorage.getItem("token");
      if (token && song.id) {
        try {
          await fetch(`${API_URL}/auth/history/${song.id}`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          queryClient.invalidateQueries({ queryKey: ["history"] });
        } catch (error) {
          console.error("Failed to add to history:", error);
        }
      }
    },
    [queryClient]
  );

  return (
    <div className="h-screen flex flex-col bg-zinc-950">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 flex flex-col overflow-hidden">
          <TopBar />

          <div className="flex-1 overflow-y-auto">
            <Outlet context={{ onSongSelect: handleSongSelect }} />
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