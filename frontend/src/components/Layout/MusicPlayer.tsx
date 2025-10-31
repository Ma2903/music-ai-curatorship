// frontend/src/components/Layout/MusicPlayer.tsx
'use client'; 

import Image from 'next/image';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Volume1 } from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext'; 
import { formatDuration } from '@/lib/utils';
import { useRef, MouseEvent, useState, useEffect, useCallback } from 'react'; 

export function MusicPlayer() {
    // --- 1. CHAMADA DE HOOK (useContext) ---
    const { 
        currentSong, 
        isPlaying, 
        togglePlayPause,
        currentTime,
        duration,
        volume,
        seek,
        changeVolume,
        isSeeking,
        setIsSeeking
    } = usePlayer(); 

    // --- 2. CHAMADAS DE HOOK (useRef, useState) ---
    // Estes hooks devem vir ANTES de qualquer return condicional.
    const progressRef = useRef<HTMLDivElement>(null);
    const volumeRef = useRef<HTMLDivElement>(null);
    const [isChangingVolume, setIsChangingVolume] = useState(false);

    // --- 3. CHAMADAS DE HOOK (useCallback) ---
    // Calcula a nova posição da música (seek)
    const handleProgressDrag = useCallback((e: MouseEvent | globalThis.MouseEvent) => {
        if (!progressRef.current || duration === 0) return;
        const rect = progressRef.current.getBoundingClientRect();
        let progress = (e.clientX - rect.left) / rect.width;
        progress = Math.max(0, Math.min(1, progress)); // Limita entre 0 e 1
        seek(progress * duration);
    }, [duration, seek]);

    // Calcula o novo volume
    const handleVolumeDrag = useCallback((e: MouseEvent | globalThis.MouseEvent) => {
        if (!volumeRef.current) return;
        const rect = volumeRef.current.getBoundingClientRect();
        let newVolume = (e.clientX - rect.left) / rect.width;
        newVolume = Math.max(0, Math.min(1, newVolume)); // Limita entre 0 e 1
        changeVolume(newVolume);
    }, [changeVolume]);

    // Inicia o arraste do PROGREsSO
    const handleProgressMouseDown = (e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsSeeking(true);
        handleProgressDrag(e); // Permite clicar para mudar
    };

    // Inicia o arraste do VOLUME
    const handleVolumeMouseDown = (e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsChangingVolume(true);
        handleVolumeDrag(e); // Permite clicar para mudar
    };

    // --- 4. CHAMADA DE HOOK (useEffect) ---
    // Efeito para monitorar o arraste (mousemove) e soltar (mouseup)
    useEffect(() => {
        const handleMouseMove = (e: globalThis.MouseEvent) => {
            if (isSeeking) {
                handleProgressDrag(e);
            } else if (isChangingVolume) {
                handleVolumeDrag(e);
            }
        };

        const handleMouseUp = () => {
            setIsSeeking(false);
            setIsChangingVolume(false);
        };

        // Adiciona listeners globais se estiver arrastando
        if (isSeeking || isChangingVolume) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        // Limpa os listeners
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [
        isSeeking, 
        isChangingVolume, 
        setIsSeeking, 
        handleProgressDrag, 
        handleVolumeDrag
    ]);
    // --- FIM DE TODAS AS CHAMADAS DE HOOKS ---


    // Se não houver música tocando, renderiza o player vazio
    // Este 'return' agora é seguro, pois todos os hooks acima já foram chamados.
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

    // Lógica de renderização (só é executada se currentSong existir)
    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
    const volumePercent = volume * 100;
    const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;


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
                        <Play size={20}/> 
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
                    <button
                        onClick={togglePlayPause} 
                        className="w-10 h-10 flex items-center justify-center p-2 rounded-full bg-white text-black hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-neutral-600"
                        disabled={!currentSong.audioUrl} 
                        aria-label={isPlaying ? "Pausar" : "Reproduzir"}
                    >
                        {isPlaying ? <Pause fill='black' size={18} /> : <Play fill='black' size={18} />}
                    </button>
                    <SkipForward size={20} className="text-neutral-400 hover:text-white cursor-pointer" />
                </div>
                
                <div className="flex items-center gap-2 w-full mt-2">
                    <span className="text-xs text-neutral-400 w-10 text-right">
                        {formatDuration(currentTime * 1000)}
                    </span>
                    <div 
                        ref={progressRef}
                        onMouseDown={handleProgressMouseDown}
                        className="flex-1 h-1 bg-neutral-700 rounded-full cursor-pointer group"
                    >
                        <div 
                            className="h-full bg-green-500 rounded-full group-hover:bg-green-400 relative" 
                            style={{ width: `${progressPercent}%` }}
                        >
                           <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full transition-opacity ${isSeeking ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></div>
                        </div>
                    </div>
                    <span className="text-xs text-neutral-400 w-10 text-left">
                        {formatDuration(duration * 1000)}
                    </span>
                </div>
            </div>

            {/* 3. Controles de Volume Interativos */}
            <div className="flex items-center gap-2 w-1/4 justify-end">
                <button onClick={() => changeVolume(volume === 0 ? 0.5 : 0)} className="text-neutral-400 hover:text-white">
                  <VolumeIcon size={20} />
                </button>
                <div 
                    ref={volumeRef}
                    onMouseDown={handleVolumeMouseDown}
                    className="w-24 h-1 bg-neutral-700 rounded-full cursor-pointer group"
                >
                    <div 
                        className="h-full bg-white group-hover:bg-green-400 rounded-full relative" 
                        style={{ width: `${volumePercent}%` }}
                    >
                        <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full transition-opacity ${isChangingVolume ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></div>
                    </div>
                </div>
            </div>
        </footer>
    );
}