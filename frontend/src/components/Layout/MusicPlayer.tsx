// frontend/src/components/Layout/MusicPlayer.tsx
'use client'; // Necessário para usar hooks

import Image from 'next/image';
// Remova mockSongs se não for mais necessário aqui
// import { mockSongs } from '@/lib/mockData';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react'; // Importar Pause
import { usePlayer } from '@/context/PlayerContext'; // Importar o hook do contexto
import { formatDuration } from '@/lib/utils'; // Importar formatDuration

// Remover a simulação de música atual
// const currentSong = mockSongs[0];

export function MusicPlayer() {
    const { currentSong, isPlaying, togglePlayPause } = usePlayer(); // Pega o estado do contexto

    // Se não houver música tocando, pode mostrar um player vazio ou com placeholder
    if (!currentSong) {
        return (
            <footer className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 p-3 h-24 flex items-center justify-between z-50 text-neutral-600">
                <div className="flex items-center gap-3 w-1/4">
                    <div className="w-14 h-14 bg-neutral-800 rounded flex items-center justify-center">
                        <Play size={20} />
                    </div>
                    <div>
                        <strong className="text-sm block">Nenhuma música</strong>
                        <span className="text-xs">Selecione uma para tocar</span>
                    </div>
                </div>
                 <div className="flex flex-col items-center w-2/4 opacity-50">
                     <div className="flex items-center gap-4">
                        <SkipBack size={20} />
                        <button className="w-10 h-10 flex items-center justify-center p-2 rounded-full bg-neutral-700 text-neutral-500 cursor-not-allowed">
                            <Play size={18} />
                        </button>
                        <SkipForward size={20} />
                    </div>
                     <div className="flex items-center gap-2 w-full mt-2">
                        <span className="text-xs">0:00</span>
                        <div className="flex-1 h-1 bg-neutral-700 rounded-full"></div>
                        <span className="text-xs">0:00</span>
                    </div>
                </div>
                 <div className="flex items-center gap-2 w-1/4 justify-end opacity-50">
                    <Volume2 size={20} />
                    <div className="w-24 h-1 bg-neutral-700 rounded-full"></div>
                </div>
            </footer>
        );
    }

    // Se houver música, mostra os detalhes e controles reais
    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 p-3 h-24 flex items-center justify-between z-50 text-white">
            {/* 1. Informações da Música */}
            <div className="flex items-center gap-3 w-1/4">
                {currentSong.imageUrl ? (
                     <Image
                        src={currentSong.imageUrl}
                        alt={`Capa de ${currentSong.album}`}
                        width={56}
                        height={56}
                        className="rounded"
                    />
                ) : (
                    <div className="w-14 h-14 bg-neutral-800 rounded flex items-center justify-center text-neutral-500">
                        <Play size={20}/> {/* Placeholder se não houver imagem */}
                    </div>
                )}

                <div>
                    <strong className="text-sm block truncate">{currentSong.title}</strong>
                    <span className="text-xs text-neutral-400 truncate">{currentSong.artist}</span>
                </div>
            </div>

            {/* 2. Controles de Reprodução */}
            <div className="flex flex-col items-center w-2/4">
                <div className="flex items-center gap-4">
                    <SkipBack size={20} className="text-neutral-400 hover:text-white cursor-pointer" />
                    {/* Botão Play/Pause dinâmico */}
                    <button
                        onClick={togglePlayPause} // Chama a função do contexto
                        className="w-10 h-10 flex items-center justify-center p-2 rounded-full bg-white text-black hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-neutral-600"
                        disabled={!currentSong.previewUrl} // Desabilita se não houver preview
                        aria-label={isPlaying ? "Pausar" : "Reproduzir"}
                    >
                        {isPlaying ? <Pause fill='black' size={18} /> : <Play fill='black' size={18} />}
                    </button>
                    <SkipForward size={20} className="text-neutral-400 hover:text-white cursor-pointer" />
                </div>
                {/* Barra de Progresso (AINDA SIMULADA - precisa conectar ao <audio>) */}
                <div className="flex items-center gap-2 w-full mt-2">
                    <span className="text-xs text-neutral-400">0:00</span> {/* TODO: Atualizar tempo atual */}
                    <div className="flex-1 h-1 bg-neutral-700 rounded-full">
                        <div className="w-[0%] h-full bg-green-500 rounded-full"></div> {/* TODO: Atualizar progresso */}
                    </div>
                    {/* Mostra duração total da música (ou 0:30 para previews) */}
                    <span className="text-xs text-neutral-400">
                        {currentSong.previewUrl ? "0:30" : currentSong.duration}
                    </span>
                </div>
            </div>

            {/* 3. Controles de Volume (AINDA SIMULADO) */}
            <div className="flex items-center gap-2 w-1/4 justify-end">
                <Volume2 size={20} className="text-neutral-400" />
                <div className="w-24 h-1 bg-neutral-700 rounded-full">
                    <div className="w-1/2 h-full bg-white rounded-full"></div> {/* TODO: Atualizar volume */}
                </div>
            </div>
        </footer>
    );
}