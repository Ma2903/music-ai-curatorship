// frontend/src/app/(main)/playlist/[id]/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play, Pause, Heart, Share2 } from 'lucide-react';
import { MusicList } from '@/components/UI/MusicList';
import { Button } from '@/components/UI/Button';
import { mockPlaylists } from '@/lib/mockData';
import { Song } from '@/types/music';

interface PlaylistPageProps {
  params: {
    id: string;
  };
}

export default function PlaylistPage({ params }: PlaylistPageProps) {
  const playlistId = parseInt(params.id);
  const playlist = mockPlaylists.find((p) => p.id === playlistId);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongId, setCurrentSongId] = useState<number | undefined>();
  const [isFavorited, setIsFavorited] = useState(false);

  if (!playlist) {
    return (
      <div className="px-6 py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Playlist não encontrada</h1>
          <p className="text-neutral-400">A playlist que você procura não existe.</p>
        </div>
      </div>
    );
  }

  const handlePlayClick = (song: Song) => {
    if (currentSongId === song.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSongId(song.id);
      setIsPlaying(true);
    }
  };

  return (
    <div className="px-4 sm:px-6 py-6 max-w-6xl mx-auto">
      {/* Header da Playlist */}
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 mb-12 items-start sm:items-end">
        {/* Capa */}
        <div className="flex-shrink-0 w-full sm:w-auto">
          <Image
            src={playlist.coverUrl}
            alt={`Capa da playlist ${playlist.name}`}
            width={200}
            height={200}
            className="rounded-lg shadow-2xl w-full sm:w-[200px] h-auto"
          />
        </div>

        {/* Informações */}
        <div className="flex-1 w-full">
          <p className="text-xs sm:text-sm font-semibold text-neutral-400 mb-2">PLAYLIST</p>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4 break-words">
            {playlist.name}
          </h1>
          <p className="text-neutral-400 mb-6 text-sm sm:text-base">
            {playlist.songCount} músicas • Curada por Music AI
          </p>

          {/* Botões de Ação */}
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              variant="primary"
              size="md"
              className="flex items-center gap-2"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} fill="currentColor" />}
              <span className="hidden sm:inline">{isPlaying ? 'Pausar' : 'Reproduzir'}</span>
            </Button>
            <button
              onClick={() => setIsFavorited(!isFavorited)}
              className={`p-3 rounded-full border transition-colors ${
                isFavorited
                  ? 'border-red-500 text-red-500 bg-red-500/10'
                  : 'border-neutral-400 text-neutral-400 hover:border-white hover:text-white'
              }`}
              aria-label="Adicionar aos favoritos"
            >
              <Heart size={24} fill={isFavorited ? 'currentColor' : 'none'} />
            </button>
            <button className="p-3 rounded-full border border-neutral-400 text-neutral-400 hover:border-white hover:text-white transition-colors">
              <Share2 size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Músicas */}
      <div className="bg-neutral-900/50 rounded-lg p-4 sm:p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">Músicas</h2>
        </div>
        <MusicList
          songs={playlist.songs}
          currentSongId={currentSongId}
          isPlaying={isPlaying}
          onPlayClick={handlePlayClick}
        />
      </div>
    </div>
  );
}

