// frontend/src/app/(main)/layout.tsx
import { MusicPlayer } from '@/components/Layout/MusicPlayer';
import { Sidebar } from '@/components/Layout/Sidebar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // ESTE É O CONTAINER GLOBAL QUE DEFINE O FUNDO, ALTURA E COR DO TEXTO
    // Se o fundo não for preto, o Tailwind não está ativo ou esta div não está ocupando a tela.
    <div className="flex min-h-screen bg-neutral-950 text-white"> 
      
      {/* 1. Sidebar Fixo (Deve aparecer) */}
      <Sidebar /> 

      {/* 2. Conteúdo Principal e Player */}
      <div className="flex-1 flex flex-col ml-60 overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <main className="flex-1 pt-6 pb-24 h-full overflow-y-auto bg-neutral-950">
            {children}
          </main>
        </div>

        {/* Player Fixo (Deve aparecer) */}
        <MusicPlayer />
      </div>
    </div>
  );
}