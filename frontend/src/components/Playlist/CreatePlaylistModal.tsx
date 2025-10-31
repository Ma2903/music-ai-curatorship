// frontend/src/components/Playlist/CreatePlaylistModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useDebounce } from '@/hooks/useDebounce';
import { Song, Recommendation } from '@/types/music'; 
import { Modal } from '@/components/UI/Modal';
import { Button } from '@/components/UI/Button';
import { SearchBar } from '@/components/UI/SearchBar';
import { Music, X } from 'lucide-react';
// --- ADIÇÃO ---
import { usePlaylists } from '@/context/PlaylistContext'; // 1. Importar o hook
// --- FIM DA ADIÇÃO ---

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type JamendoTrack = Omit<Recommendation, 'justification'>;
type SuggestionItem = Pick<Song, 'id' | 'title' | 'artist' | 'imageUrl'>;

export function CreatePlaylistModal({
  isOpen,
  onClose,
}: CreatePlaylistModalProps) {
  const [name, setName] = useState('');
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [selectedSong, setSelectedSong] = useState<JamendoTrack | null>(null);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { token } = useAuth();
  const router = useRouter();
  const debouncedQuery = useDebounce(query, 400);
  
  // --- ADIÇÃO ---
  const { refetchPlaylists } = usePlaylists(); // 2. Pegar a função de refetch
  // --- FIM DA ADIÇÃO ---

  // Busca sugestões de músicas (Não muda)
  useEffect(() => {
    if (!debouncedQuery.trim() || selectedSong) { 
      setSuggestions([]);
      return;
    }
    const fetchSuggestions = async () => {
      setIsLoadingSearch(true);
      try {
        const response = await fetch(
          `http://localhost:3333/api/search?q=${encodeURIComponent(
            debouncedQuery
          )}&limit=5`
        );
        if (!response.ok) throw new Error('Falha ao buscar músicas.');
        const data: JamendoTrack[] = await response.json();
        setSuggestions(
          data.map((track) => ({
            id: track.id,
            title: track.title,
            artist: track.artist,
            imageUrl: track.imageUrl,
          }))
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Erro ao buscar sugestões.'
        );
      } finally {
        setIsLoadingSearch(false);
      }
    };
    fetchSuggestions();
  }, [debouncedQuery, selectedSong]); 

  // Limpa o estado quando o modal fecha (Não muda)
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => { 
        setName('');
        setQuery('');
        setSuggestions([]);
        setSelectedSong(null);
        setError(null);
        setIsLoadingCreate(false);
      }, 300);
    }
  }, [isOpen]);

  // Handler para selecionar música (Não muda)
  const handleSelectSong = async (suggestion: SuggestionItem) => {
    setQuery(suggestion.title); 
    setSuggestions([]); 
    setIsLoadingSearch(true); 
    
    try {
        const response = await fetch(`http://localhost:3333/api/search?q=${encodeURIComponent(suggestion.title + " " + suggestion.artist)}&limit=5`);
        const tracks: JamendoTrack[] = await response.json();
        
        const foundTrack = tracks.find(t => t.id === suggestion.id);
        
        if (foundTrack) {
             setSelectedSong(foundTrack);
             console.log("Música selecionada:", foundTrack);
        } else {
            setSelectedSong({ 
                ...suggestion, 
                id: suggestion.id.toString(), 
                album: 'Desconhecido', 
                duration: '0:00', 
                audioUrl: null 
            });
        }
    } catch (e) {
         setError("Erro ao selecionar música.");
    } finally {
        setIsLoadingSearch(false);
    }
  };

  // Handler para criar a playlist
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !selectedSong) {
      setError('Nome da playlist e uma música inicial são obrigatórios.');
      return;
    }
    if (!token) {
      setError('Você precisa estar logado.');
      return;
    }

    setIsLoadingCreate(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3333/api/playlists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name,
          initialSong: selectedSong, 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Falha ao criar playlist.');
      }

      console.log('Playlist criada:', data);
      
      // --- ADIÇÃO ---
      await refetchPlaylists(); // 3. Avisa o contexto que uma nova playlist existe
      // --- FIM DA ADIÇÃO ---

      onClose(); // Fecha o modal
      router.push(`/playlist/${data.id}`); // Redireciona para a nova playlist
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido.');
    } finally {
      setIsLoadingCreate(false);
    }
  };

  // --- O RESTO DO JSX (RETURN) PERMANECE O MESMO ---
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Criar nova playlist">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campo Nome */}
        <div>
          <label
            htmlFor="playlistName"
            className="block text-sm font-medium text-neutral-300 mb-2"
          >
            Nome da Playlist
          </label>
          <input
            id="playlistName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Músicas para relaxar"
            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            disabled={isLoadingCreate}
          />
        </div>

        {/* Campo Música Inicial */}
        <div>
          <label
            htmlFor="songSearch"
            className="block text-sm font-medium text-neutral-300 mb-2"
          >
            Adicionar música inicial
          </label>
          <div className="relative">
            <SearchBar
              placeholder="Buscar música inicial..."
              onQueryChange={setQuery} 
              onSearch={() => {}} 
              suggestions={[]} 
              isLoadingSuggestions={isLoadingSearch}
            />
            {/* Lista de Sugestões Customizada */}
            {suggestions.length > 0 && !selectedSong && (
              <div className="absolute w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-lg max-h-48 overflow-y-auto z-10 shadow-lg">
                {suggestions.map((s) => (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => handleSelectSong(s)}
                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-neutral-700 transition-colors"
                  >
                    {s.imageUrl ? (
                      <img
                        src={s.imageUrl}
                        alt={s.title}
                        className="w-10 h-10 rounded object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded bg-neutral-700 flex items-center justify-center flex-shrink-0">
                        <Music size={20} />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm text-white truncate">{s.title}</p>
                      <p className="text-xs text-neutral-400 truncate">
                        {s.artist}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Música Selecionada */}
        {selectedSong && (
          <div className="p-3 bg-neutral-800 rounded-lg flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-3 min-w-0">
               {selectedSong.imageUrl ? (
                  <img src={selectedSong.imageUrl} alt={selectedSong.title} className="w-10 h-10 rounded object-cover flex-shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded bg-neutral-700 flex items-center justify-center flex-shrink-0"><Music size={20} /></div>
                )}
                <div className="min-w-0">
                  <p className="text-sm text-green-400 truncate">{selectedSong.title}</p>
                  <p className="text-xs text-neutral-400 truncate">{selectedSong.artist}</p>
                </div>
            </div>
            <button 
              type="button" 
              onClick={() => { setSelectedSong(null); setQuery(''); }} 
              className="text-neutral-500 hover:text-white transition-colors flex-shrink-0" 
              aria-label="Remover música selecionada"
              disabled={isLoadingCreate}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Erro e Botão Criar */}
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoadingCreate}
            disabled={!name.trim() || !selectedSong || isLoadingSearch}
          >
            Criar Playlist
          </Button>
        </div>
      </form>
    </Modal>
  );
}