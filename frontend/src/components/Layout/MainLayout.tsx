// frontend/src/components/Layout/MainLayout.tsx
import { MusicPlayer } from './MusicPlayer';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen bg-neutral-950 text-white">
      {/* Sidebar Fixo */}
      <Sidebar />

      {/* Conteúdo Principal e Player */}
      <div className="flex-1 flex flex-col ml-60 overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <main className="flex-1 pt-6 pb-24 h-full overflow-y-auto bg-neutral-950">
            {children}
          </main>
        </div>

        {/* Player Fixo */}
        <MusicPlayer />
      </div>
    </div>
  );
}

