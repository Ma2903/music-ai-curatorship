// frontend/src/components/UI/MusicList.tsx
import Image from 'next/image';
import { Play, Pause, Music, Trash2 } from 'lucide-react'; // <<< IMPORTAR Trash2
import { Song } from '@/types/music';

interface MusicListProps {
  songs: Song[];
  currentSongId?: string; 
  isPlaying?: boolean;
  onPlayClick?: (song: Song) => void;
  onRemoveClick?: (song: Song) => void; // <<< ADICIONAR PROP DE REMOVER
}

export function MusicList({
  songs,
  currentSongId,
  isPlaying = false,
  onPlayClick,
  onRemoveClick, // <<< OBTER A PROP
}: MusicListProps) {
  return (
    <div className="space-y-2">
      {songs.map((song, index) => (
        <div
          key={song.id}
          className={`flex items-center gap-4 p-3 rounded-lg transition-colors group ${
            currentSongId === song.id
              ? 'bg-neutral-700'
              : 'hover:bg-neutral-800'
          }`}
        >
          {/* Número ou Ícone de Reprodução */}
          <div className="w-8 text-center flex-shrink-0">
            {currentSongId === song.id ? (
              <button onClick={() => onPlayClick?.(song)} aria-label={isPlaying ? "Pausar" : "Tocar"}>
                {isPlaying ? (
                  <Pause size={16} className="text-green-400" />
                ) : (
                  <Play size={16} className="text-green-400" />
                )}
              </button>
            ) : (
              <>
                <span className="text-neutral-400 text-sm group-hover:hidden">{index + 1}</span>
                <button 
                  onClick={() => onPlayClick?.(song)} 
                  className="hidden group-hover:flex text-white items-center justify-center w-full"
                  aria-label={`Tocar ${song.title}`}
                >
                  <Play size={16} />
                </button>
              </>
            )}
          </div>

          {/* Capa do Álbum */}
          {song.imageUrl ? (
            <Image
              src={song.imageUrl}
              alt={`Capa de ${song.title}`}
              width={40}
              height={40}
              className="rounded"
            />
          ) : (
             <div className="w-10 h-10 rounded bg-neutral-700 flex items-center justify-center text-neutral-500 flex-shrink-0">
                <Music size={20}/>
             </div>
          )}


          {/* Informações da Música */}
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium truncate ${
              currentSongId === song.id ? 'text-green-400' : 'text-white'
            }`}>
              {song.title}
            </p>
            <p className="text-xs text-neutral-400 truncate">
              {song.artist}
            </p>
          </div>

          {/* Duração */}
          <span className="text-sm text-neutral-400 w-12 text-right flex-shrink-0">
            {song.duration}
          </span>
          
          {/* <<< ADICIONAR BOTÃO DE REMOVER >>> */}
          {onRemoveClick && (
            <button
              onClick={() => onRemoveClick(song)}
              className="p-2 rounded-full hover:bg-neutral-700 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
              aria-label={`Remover ${song.title} da playlist`}
            >
              <Trash2 size={16} className="text-neutral-400 hover:text-red-400" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}