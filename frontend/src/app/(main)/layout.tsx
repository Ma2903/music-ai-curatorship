// frontend/src/app/(main)/layout.tsx
'use client'; 

import { MusicPlayer } from '@/components/Layout/MusicPlayer';
import { Sidebar } from '@/components/Layout/Sidebar';
import { PlayerProvider } from '@/context/PlayerContext'; 
// --- ADIÇÃO ---
import { PlaylistProvider } from '@/context/PlaylistContext';
// --- FIM DA ADIÇÃO ---

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Envolvemos tudo com o PlayerProvider e o novo PlaylistProvider
    <PlayerProvider>
      {/* --- ADIÇÃO --- */}
      <PlaylistProvider>
      {/* --- FIM DA ADIÇÃO --- */}
        <div className="flex min-h-screen"> 
          <Sidebar />
          <div className="flex-1 flex flex-col ml-60 overflow-hidden">
            <div className="flex-1 overflow-hidden">
              <main className="pt-6 pb-24 h-full overflow-y-auto bg-neutral-950">
                {children} 
              </main>
            </div>
            <MusicPlayer />
          </div>
        </div>
      {/* --- ADIÇÃO --- */}
      </PlaylistProvider>
      {/* --- FIM DA ADIÇÃO --- */}
    </PlayerProvider>
  );
}