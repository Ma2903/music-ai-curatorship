// frontend/src/app/(main)/layout.tsx
'use client'; // Adicione 'use client' se ainda não tiver, pois PlayerProvider usa estado/contexto

import { MusicPlayer } from '@/components/Layout/MusicPlayer';
import { Sidebar } from '@/components/Layout/Sidebar';
import { PlayerProvider } from '@/context/PlayerContext'; // Importar o Provider

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // <<< REMOVIDO <html>, <head>, <body> daqui >>>
  return (
    // Envolver o conteúdo específico deste layout com o PlayerProvider
    <PlayerProvider>
      {/* Container principal deste layout específico */}
      <div className="flex min-h-screen"> {/* A cor de fundo e texto já vem do layout raiz */}
        <Sidebar />
        <div className="flex-1 flex flex-col ml-60 overflow-hidden"> {/* ml-60 para compensar a Sidebar */}
          {/* Container para o conteúdo da página e scroll */}
          <div className="flex-1 overflow-hidden">
            {/* O main agora aplica o padding e scroll */}
            <main className="pt-6 pb-24 h-full overflow-y-auto bg-neutral-950"> {/* Adiciona bg aqui se quiser fundo diferente */}
              {children} {/* Aqui entra o conteúdo da página (page.tsx) */}
            </main>
          </div>
          <MusicPlayer /> {/* Player fixo na parte inferior */}
        </div>
      </div>
    </PlayerProvider>
  );
}