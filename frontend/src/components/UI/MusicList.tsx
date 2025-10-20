// frontend/src/components/UI/MusicList.tsx
import Image from 'next/image';
import { Play, Pause } from 'lucide-react';
import { Song } from '@/types/music';

interface MusicListProps {
  songs: Song[];
  currentSongId?: number;
  isPlaying?: boolean;
  onPlayClick?: (song: Song) => void;
}

export function MusicList({
  songs,
  currentSongId,
  isPlaying = false,
  onPlayClick,
}: MusicListProps) {
  return (
    <div className="space-y-2">
      {songs.map((song, index) => (
        <div
          key={song.id}
          className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
            currentSongId === song.id
              ? 'bg-neutral-700'
              : 'hover:bg-neutral-800'
          }`}
        >
          {/* Número ou Ícone de Reprodução */}
          <div className="w-8 text-center">
            {currentSongId === song.id ? (
              isPlaying ? (
                <Pause size={16} className="text-green-400" />
              ) : (
                <Play size={16} className="text-green-400" />
              )
            ) : (
              <span className="text-neutral-400 text-sm">{index + 1}</span>
            )}
          </div>

          {/* Capa do Álbum */}
          <Image
            src={song.imageUrl}
            alt={`Capa de ${song.title}`}
            width={40}
            height={40}
            className="rounded"
          />

          {/* Informações da Música */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {song.title}
            </p>
            <p className="text-xs text-neutral-400 truncate">
              {song.artist}
            </p>
          </div>

          {/* Duração */}
          <span className="text-sm text-neutral-400 w-12 text-right">
            {song.duration}
          </span>

          {/* Botão de Play */}
          <button
            onClick={() => onPlayClick?.(song)}
            className="p-2 rounded-full hover:bg-neutral-700 transition-colors opacity-0 group-hover:opacity-100"
            aria-label={`Tocar ${song.title}`}
          >
            <Play size={16} className="text-neutral-400 hover:text-white" />
          </button>
        </div>
      ))}
    </div>
  );
}

