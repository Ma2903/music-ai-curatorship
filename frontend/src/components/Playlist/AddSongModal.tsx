// frontend/src/components/Playlist/AddSongModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useDebounce } from '@/hooks/useDebounce';
import { Song, Recommendation } from '@/types/music';
import { Modal } from '@/components/UI/Modal';
import { Button } from '@/components/UI/Button';
import { SearchBar } from '@/components/UI/SearchBar';
import { Music, Plus, Check } from 'lucide-react';

interface AddSongModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlistId: number;
  onSongAdded: (newSong: Song) => void; // Para atualização otimista
}

// O tipo de música que o /api/search retorna
type JamendoTrack = Omit<Recommendation, 'justification'>;

export function AddSongModal({
  isOpen,
  onClose,
  playlistId,
  onSongAdded,
}: AddSongModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<JamendoTrack[]>([]);
  const [addedSongIds, setAddedSongIds] = useState<Set<string>>(new Set());
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { token } = useAuth();
  const debouncedQuery = useDebounce(query, 400);

  // Busca sugestões de músicas
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }
    const fetchSongs = async () => {
      setIsLoadingSearch(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:3333/api/search?q=${encodeURIComponent(
            debouncedQuery
          )}&limit=10`
        );
        if (!response.ok) throw new Error('Falha ao buscar músicas.');
        const data: JamendoTrack[] = await response.json();
        setResults(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Erro ao buscar sugestões.'
        );
      } finally {
        setIsLoadingSearch(false);
      }
    };
    fetchSongs();
  }, [debouncedQuery]);

  // Limpa o estado quando o modal fecha
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setQuery('');
        setResults([]);
        setError(null);
        setAddedSongIds(new Set());
      }, 300); // Espera a animação de saída
    }
  }, [isOpen]);

  // Handler para ADICIONAR a música
  const handleAddSong = async (song: JamendoTrack) => {
    if (!token || addedSongIds.has(song.id)) return;

    try {
      const response = await fetch(
        `http://localhost:3333/api/playlists/${playlistId}/songs`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(song), // Envia o objeto Song completo
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Falha ao adicionar música.');
      }

      // Sucesso!
      setAddedSongIds(new Set(addedSongIds).add(song.id)); // Marca como adicionado
      onSongAdded(song); // Chama o callback para atualizar a UI da página
    } catch (err) {
      // Mostra o erro específico (ex: "Música já está na playlist")
      setError(err instanceof Error ? err.message : 'Erro desconhecido.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adicionar músicas">
      <div className="flex flex-col space-y-4">
        <SearchBar
          placeholder="Buscar músicas ou artistas..."
          onQueryChange={setQuery}
          isLoadingSuggestions={isLoadingSearch}
        />

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        {/* Lista de Resultados */}
        <div className="max-h-80 overflow-y-auto space-y-2">
          {!isLoadingSearch && results.length === 0 && debouncedQuery.length > 0 && (
            <p className="text-neutral-500 text-sm text-center py-4">
              Nenhum resultado para "{debouncedQuery}".
            </p>
          )}

          {isLoadingSearch && (
            <p className="text-neutral-500 text-sm text-center py-4">
              Buscando...
            </p>
          )}

          {results.map((song) => {
            const isAdded = addedSongIds.has(song.id);
            return (
              <div
                key={song.id}
                className="flex items-center gap-3 p-2 rounded-lg"
              >
                {song.imageUrl ? (
                  <img
                    src={song.imageUrl}
                    alt={song.title}
                    className="w-10 h-10 rounded object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded bg-neutral-700 flex items-center justify-center flex-shrink-0">
                    <Music size={20} />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-white truncate">{song.title}</p>
                  <p className="text-xs text-neutral-400 truncate">
                    {song.artist}
                  </p>
                </div>
                <Button
                  variant={isAdded ? 'success' : 'secondary'}
                  size="sm"
                  onClick={() => handleAddSong(song)}
                  disabled={isAdded}
                  icon={isAdded ? <Check size={16} /> : <Plus size={16} />}
                  className="flex-shrink-0"
                >
                  {isAdded ? 'Adicionado' : 'Adicionar'}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}