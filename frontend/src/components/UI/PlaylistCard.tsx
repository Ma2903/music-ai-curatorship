// frontend/src/components/UI/PlaylistCard.tsx
'use client';

import Image from 'next/image';
import { Play, Heart, Share2, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { Playlist } from '@/types/music';

interface PlaylistCardProps {
  playlist: Playlist;
  onPlay?: () => void;
  onFavorite?: () => void;
}

export function PlaylistCard({ playlist, onPlay, onFavorite }: PlaylistCardProps) {
  const { name, description, imageUrl, songCount, duration } = playlist;
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    onFavorite?.();
  };

  return (
    <div className="group relative h-full">
      {/* Card Container */}
      <div className="relative h-full rounded-xl overflow-hidden bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700/50 transition-all duration-300 hover:border-neutral-600 hover:shadow-2xl">
        {/* Background Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

        {/* Image Container */}
        <div className="relative w-full aspect-square overflow-hidden bg-neutral-900">
          <Image
            src={imageUrl || playlist.coverUrl}
            alt={`Capa da playlist ${name}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            priority
          />
        </div>

        {/* Content Container */}
        <div className="absolute inset-0 flex flex-col justify-between p-4 z-20">
          {/* Top Actions */}
          <div className="flex justify-between items-start opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <div className="flex gap-2">
              <button
                onClick={handleFavorite}
                className={`p-2.5 rounded-full backdrop-blur-md transition-all duration-300 ${
                  isFavorited
                    ? 'bg-red-500/80 text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                aria-label={`${isFavorited ? 'Remover de' : 'Adicionar a'} favoritos`}
              >
                <Heart size={18} fill={isFavorited ? 'currentColor' : 'none'} />
              </button>
              <button
                className="p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300 backdrop-blur-md"
                aria-label="Mais opções"
              >
                <MoreVertical size={18} />
              </button>
            </div>
          </div>

          {/* Bottom Content */}
          <div className="space-y-3">
            {/* Playlist Info */}
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-white line-clamp-2 group-hover:text-green-400 transition-colors duration-300">
                {name}
              </h3>
              <p className="text-xs text-neutral-400 line-clamp-2">{description || 'Playlist curada'}</p>
              <p className="text-xs text-neutral-500">
                {songCount} músicas • {duration || '2h 30m'}
              </p>
            </div>

            {/* Play Button */}
            <button
              onClick={onPlay}
              className="w-full py-2.5 bg-green-500 hover:bg-green-400 text-black font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-green-500/50 active:scale-95 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
              aria-label={`Reproduzir playlist ${name}`}
            >
              <Play size={16} fill="currentColor" />
              <span className="text-sm">Reproduzir</span>
            </button>
          </div>
        </div>
      </div>

      {/* Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/0 via-green-500/0 to-green-500/0 rounded-xl opacity-0 group-hover:opacity-100 group-hover:from-green-500/20 group-hover:to-green-500/10 transition-opacity duration-300 -z-10 blur-xl" />
    </div>
  );
}

