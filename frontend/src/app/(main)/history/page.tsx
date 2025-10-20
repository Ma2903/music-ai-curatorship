// frontend/src/app/(main)/history/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play, Trash2, Clock } from 'lucide-react';
import { Header } from '@/components/UI/Header';
import { mockSongs } from '@/lib/mockData';
import { HistoryEntry, Song } from '@/types/music';

export default function HistoryPage() {
  // Simular histórico de audição com datas
  const [history] = useState<HistoryEntry[]>(
    mockSongs.map((song, index) => ({
      song,
      listenedAt: new Date(Date.now() - index * 3600000), // Cada música com 1 hora de diferença
    }))
  );

  const handleRemoveFromHistory = (songId: number) => {
    console.log('Remover do histórico:', songId);
    // Implementar a lógica de remoção
  };

  const handlePlaySong = (song: Song) => {
    console.log('Tocar música:', song.title);
    // Implementar a lógica de reprodução
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Agora mesmo';
    if (diffMins < 60) return `${diffMins}m atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="px-4 sm:px-6 py-6 max-w-6xl mx-auto">
      {/* Header */}
      <Header
        title="Seu Histórico"
        subtitle={`${history.length} músicas ouvidas`}
      />

      {/* Lista de Histórico */}
      {history.length > 0 ? (
        <div className="space-y-2">
          {history.map((entry) => (
            <div
              key={`${entry.song.id}-${entry.listenedAt.getTime()}`}
              className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 rounded-lg hover:bg-neutral-800 transition-colors group"
            >
              {/* Capa */}
              <Image
                src={entry.song.imageUrl}
                alt={`Capa de ${entry.song.title}`}
                width={48}
                height={48}
                className="rounded w-12 h-12 flex-shrink-0"
              />

              {/* Informações da Música */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {entry.song.title}
                </p>
                <p className="text-xs text-neutral-400 truncate">
                  {entry.song.artist}
                </p>
              </div>

              {/* Duração e Data */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-neutral-400 text-xs sm:text-sm">
                <div className="flex items-center gap-1">
                  <Clock size={14} className="flex-shrink-0" />
                  <span className="truncate">{formatDate(entry.listenedAt)}</span>
                </div>
                <span className="text-neutral-500">{entry.song.duration}</span>
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button
                  onClick={() => handlePlaySong(entry.song)}
                  className="p-2 rounded-full hover:bg-neutral-700 transition-colors"
                  aria-label={`Tocar ${entry.song.title}`}
                >
                  <Play size={16} className="text-neutral-400 hover:text-white" />
                </button>
                <button
                  onClick={() => handleRemoveFromHistory(entry.song.id)}
                  className="p-2 rounded-full hover:bg-neutral-700 transition-colors"
                  aria-label={`Remover ${entry.song.title} do histórico`}
                >
                  <Trash2 size={16} className="text-neutral-400 hover:text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Clock size={48} className="mx-auto text-neutral-600 mb-4" />
          <p className="text-neutral-400 text-lg">
            Seu histórico está vazio
          </p>
          <p className="text-neutral-500 text-sm mt-2">
            Comece a ouvir músicas para que elas apareçam aqui
          </p>
        </div>
      )}
    </div>
  );
}

