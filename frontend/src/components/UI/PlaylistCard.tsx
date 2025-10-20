// frontend/src/components/UI/PlaylistCard.tsx
import Image from 'next/image';
import { Play } from 'lucide-react';
import { Playlist } from '@/types/music';

interface PlaylistCardProps {
  playlist: Playlist;
  onClick?: () => void;
}

export function PlaylistCard({ playlist, onClick }: PlaylistCardProps) {
  return (
    <div
      onClick={onClick}
      className="group bg-neutral-800/50 hover:bg-neutral-800 transition-all duration-300 p-4 rounded-lg cursor-pointer flex flex-col relative overflow-hidden shadow-xl"
      role="button"
      tabIndex={0}
      aria-label={`Abrir playlist ${playlist.name}`}
    >
      {/* Botão de Play Flutuante */}
      <button
        className="absolute right-6 bottom-24 p-4 rounded-full bg-green-500 text-black shadow-lg opacity-0 group-hover:opacity-100 group-hover:bottom-28 transition-all duration-300 ease-in-out hover:scale-105"
        aria-label={`Tocar playlist ${playlist.name}`}
      >
        <Play fill="currentColor" size={24} />
      </button>

      {/* Imagem/Capa */}
      <div className="w-full aspect-square mb-4 relative">
        <Image
          src={playlist.coverUrl}
          alt={`Capa da playlist ${playlist.name}`}
          width={150}
          height={150}
          className="rounded-lg object-cover w-full h-full shadow-lg"
          priority
        />
      </div>

      {/* Informações da Playlist */}
      <div className="flex flex-col">
        <strong className="font-bold text-base truncate">{playlist.name}</strong>
        <span className="text-sm text-neutral-400 mt-1">
          Playlist • {playlist.songCount} músicas
        </span>
      </div>
    </div>
  );
}

