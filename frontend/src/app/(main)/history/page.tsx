// frontend/src/app/(main)/history/page.tsx
'use client';

import { useState, useEffect } from 'react'; // Adicionado useEffect
import Image from 'next/image';
import { Play, Trash2, Clock, Music } from 'lucide-react'; // Adicionado Music
import { Header } from '@/components/UI/Header';
// import { mockSongs } from '@/lib/mockData'; // Não mais usado
import { HistoryEntry, Song } from '@/types/music';
import { useAuth } from '@/context/AuthContext'; // Importar Auth
import { usePlayer } from '@/context/PlayerContext'; // Importar Player

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();
  const { playSong } = usePlayer();

  useEffect(() => {
    if (!token) {
      setError("Faça login para ver seu histórico.");
      setIsLoading(false);
      setHistory([]);
      return;
    }

    const fetchHistory = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:3333/api/history', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || `Erro ${response.status}`);
        }
        // O backend retorna HistoryEntry, mas precisamos do formato Song para tocar
        const data: any[] = await response.json(); 
        
        // Converte o histórico do backend (que tem campos de música) para o tipo HistoryEntry do frontend
        const formattedHistory: HistoryEntry[] = data.map(entry => ({
          listenedAt: new Date(entry.listenedAt),
          song: {
            id: entry.jamendoSongId,
            title: entry.songTitle,
            artist: entry.songArtist,
            album: 'Desconhecido', // API de histórico não salva isso ainda
            duration: '0:00', // API de histórico não salva isso ainda
            genre: entry.songGenre || null,
            mood: entry.songMood || null,
            imageUrl: null, // API de histórico não salva isso ainda
            audioUrl: null, // <<< IMPORTANTE: Não podemos tocar direto do histórico
          }
        }));
        setHistory(formattedHistory);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Falha ao carregar histórico.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [token]);


  const handleRemoveFromHistory = (jamendoSongId: string) => { // <<< MUDANÇA: number para string
    console.log('Remover do histórico:', jamendoSongId);
    // TODO: Implementar a lógica de remoção (API DELETE /api/history/:id)
    // setHistory(history.filter(entry => entry.song.id !== jamendoSongId));
  };

  const handlePlaySong = (song: Song) => {
    console.log('Tocar música:', song.title);
    // ATENÇÃO: A música do histórico pode não ter audioUrl
    // O ideal seria buscar os detalhes da música na API /api/search
    // Mas, por simplicidade, vamos tentar tocar (pode falhar)
    if(song.audioUrl) {
        playSong(song);
    } else {
        console.warn(`Não é possível tocar ${song.title} do histórico, falta audioUrl. Implementar busca.`);
        // TODO: Implementar busca dos detalhes da música antes de tocar
        // Ex: fetch(`/api/search?q=${song.title} ${song.artist}&limit=1`)
    }
  };

  const formatDate = (date: Date) => {
    // ... (função formatDate sem mudança)
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
        subtitle={
          !isLoading && !error ? `${history.length} músicas ouvidas` : 'Suas últimas músicas'
        }
      />

      {/* Loading */}
      {isLoading && (
        <p className="text-neutral-400 text-center py-10">Carregando histórico...</p>
      )}

      {/* Error */}
      {error && (
         <p className="text-red-500 text-center py-10">{error}</p>
      )}

      {/* Lista de Histórico */}
      {!isLoading && !error && history.length > 0 && (
        <div className="space-y-2">
          {history.map((entry) => (
            <div
              key={`${entry.song.id}-${entry.listenedAt.getTime()}`} // <<< MUDANÇA: ID é string
              className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 rounded-lg hover:bg-neutral-800 transition-colors group"
            >
              {/* Capa */}
              {entry.song.imageUrl ? (
                <Image
                  src={entry.song.imageUrl}
                  alt={`Capa de ${entry.song.title}`}
                  width={48}
                  height={48}
                  className="rounded w-12 h-12 flex-shrink-0"
                />
              ) : (
                <div className="rounded w-12 h-12 bg-neutral-800 flex items-center justify-center text-neutral-600 flex-shrink-0">
                    <Music size={24} />
                </div>
              )}


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
                {entry.song.duration !== '0:00' && (
                    <span className="text-neutral-500">{entry.song.duration}</span>
                )}
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
                  onClick={() => handleRemoveFromHistory(entry.song.id)} // <<< MUDANÇA: ID é string
                  className="p-2 rounded-full hover:bg-neutral-700 transition-colors"
                  aria-label={`Remover ${entry.song.title} do histórico`}
                >
                  <Trash2 size={16} className="text-neutral-400 hover:text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )} 
      
      {/* Sem Histórico */}
      {!isLoading && !error && history.length === 0 && (
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