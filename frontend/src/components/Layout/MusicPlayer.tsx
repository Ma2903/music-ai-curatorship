// frontend/src/components/Layout/MusicPlayer.tsx
import Image from 'next/image';
import { mockSongs } from '@/lib/mockData';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';

// Simula a música atual
const currentSong = mockSongs[0];

export function MusicPlayer() {
    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 p-3 h-24 flex items-center justify-between z-50">
            {/* 1. Informações da Música (Esquerda) */}
            <div className="flex items-center gap-3 w-1/4">
                <Image 
                    src={currentSong.imageUrl} 
                    alt="Capa do Álbum" 
                    width={56} 
                    height={56} 
                    className="rounded"
                />
                <div>
                    <strong className="text-sm block">{currentSong.title}</strong>
                    <span className="text-xs text-neutral-400">{currentSong.artist}</span>
                </div>
            </div>

            {/* 2. Controles de Reprodução (Centro) */}
            <div className="flex flex-col items-center w-2/4">
                <div className="flex items-center gap-4">
                    <SkipBack size={20} className="text-neutral-400 hover:text-white cursor-pointer" />
                    <button className="w-10 h-10 flex items-center justify-center p-2 rounded-full bg-white text-black hover:scale-105 transition-transform">
                        <Play fill='black' size={18} />
                    </button>
                    <SkipForward size={20} className="text-neutral-400 hover:text-white cursor-pointer" />
                </div>
                {/* Barra de Progresso (Simulada) */}
                <div className="flex items-center gap-2 w-full mt-2">
                    <span className="text-xs text-neutral-400">0:30</span>
                    <div className="flex-1 h-1 bg-neutral-700 rounded-full">
                        <div className="w-[30%] h-full bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-xs text-neutral-400">{currentSong.duration}</span>
                </div>
            </div>

            {/* 3. Controles de Volume (Direita) */}
            <div className="flex items-center gap-2 w-1/4 justify-end">
                <Volume2 size={20} className="text-neutral-400" />
                <div className="w-24 h-1 bg-neutral-700 rounded-full">
                    <div className="w-1/2 h-full bg-white rounded-full"></div>
                </div>
            </div>
        </footer>
    );
}