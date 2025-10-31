// frontend/src/app/(main)/playlist/[id]/page.tsx
'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import { Play, Pause, Heart, Share2, Clock, Music, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { MusicList } from '@/components/UI/MusicList';
import { Button } from '@/components/UI/Button';
import { Song, Playlist } from '@/types/music';
import { useAuth } from '@/context/AuthContext';
import { usePlayer } from '@/context/PlayerContext';
import { AddSongModal } from '@/components/Playlist/AddSongModal';
import Swal from 'sweetalert2';
// --- ADIÇÃO ---
import { usePlaylists } from '@/context/PlaylistContext'; // 1. Importar o hook
// --- FIM DA ADIÇÃO ---

interface PlaylistPageProps {
  params: { id: string };
}

export default function PlaylistPage(props: PlaylistPageProps) {

  const params = use(props.params);
  const playlistId = parseInt(params.id, 10);
  const router = useRouter();

  // Estados da página
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isAddSongModalOpen, setIsAddSongModalOpen] = useState(false);

  // Estados do Contexto
  const { token } = useAuth();
  const { playSong, togglePlayPause, currentSong, isPlaying } = usePlayer();
  // --- ADIÇÃO ---
  const { refetchPlaylists } = usePlaylists(); // 2. Pegar a função de refetch
  // --- FIM DA ADIÇÃO ---

  // Busca dados da playlist na API (Não muda)
  useEffect(() => {
    if (!token || isNaN(playlistId)) {
      if (isNaN(playlistId)) setError('ID de playlist inválido.');
      if (!token) setError('Faça login para ver suas playlists.');
      setIsLoading(false);
      return;
    }

    const fetchPlaylist = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:3333/api/playlists/${playlistId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || `Erro ${response.status}`);
        }
        const data: Playlist = await response.json();
        setPlaylist(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Falha ao carregar playlist.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylist();
  }, [playlistId, token]);

  // Handlers de Play (Não mudam)
  const handlePlayClick = (song: Song) => {
    if (currentSong?.id === song.id) {
      togglePlayPause();
    } else {
      playSong(song);
    }
  };

  const handlePlayPlaylist = () => {
    if (!playlist || playlist.songs.length === 0) return;
    if (currentSong?.id === playlist.songs[0].id) {
      togglePlayPause();
    } else {
      playSong(playlist.songs[0]);
    }
  };

  // Handler para REMOVER música
  const handleRemoveSong = async (songToRemove: Song) => {
    if (!token || !playlist) return;

    const result = await Swal.fire({
      title: 'Remover música?',
      text: `Tem certeza que quer remover "${songToRemove.title}" da playlist?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1DB954',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, remover',
      cancelButtonText: 'Cancelar',
      background: '#181818',
      color: '#FFFFFF'
    });

    if (result.isConfirmed) {
      // Atualização otimista da UI
      setPlaylist((prev) => {
        if (!prev) return null;
        const newSongs = prev.songs.filter(s => s.id !== songToRemove.id);
        return {
          ...prev,
          songs: newSongs,
          songCount: newSongs.length,
        };
      });

      // Requisição à API
      try {
        const response = await fetch(
          `http://localhost:3333/api/playlists/${playlist.id}/songs/${songToRemove.id}`,
          {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error('Falha ao remover a música. Recarregando...');
        }
        
        // --- ADIÇÃO ---
        await refetchPlaylists(); // 3. Avisa o contexto para recarregar
        // --- FIM DA ADIÇÃO ---

      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Erro ao remover');
        Swal.fire('Erro!', 'Não foi possível remover a música. A página será atualizada.', 'error');
        setTimeout(() => window.location.reload(), 2000);
      }
    }
  };

  // Handler para ADICIONAR música
  const handleSongAdded = async (newSong: Song) => {
    if (!playlist) return;
    setPlaylist({
      ...playlist,
      songs: [...playlist.songs, newSong],
      songCount: playlist.songCount + 1,
    });
    
    // --- ADIÇÃO ---
    await refetchPlaylists(); // 4. Avisa o contexto para recarregar
    // --- FIM DA ADIÇÃO ---
  };

  // Handler para DELETAR playlist
  const handleDeletePlaylist = async () => {
    if (!token || !playlist) return;

    const result = await Swal.fire({
      title: 'DELETAR a playlist?',
      text: `Tem certeza que quer deletar "${playlist.name}"? Esta ação não pode ser desfeita.`,
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Cancelar',
      background: '#181818',
      color: '#FFFFFF'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `http://localhost:3333/api/playlists/${playlist.id}`,
          {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Falha ao deletar a playlist.');
        }

        await Swal.fire({
          title: 'Deletada!',
          text: 'Sua playlist foi deletada com sucesso.',
          icon: 'success',
          background: '#181818',
          color: '#FFFFFF',
          timer: 1500,
          showConfirmButton: false
        });
        
        // --- ADIÇÃO ---
        await refetchPlaylists(); // 5. Avisa o contexto ANTES de navegar
        // --- FIM DA ADIÇÃO ---
        
        router.push('/');

      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro desconhecido ao deletar.';
        setError(message);
        Swal.fire('Erro!', message, 'error');
      }
    }
  };

  const isPlaylistPlaying = isPlaying && playlist?.songs.some(s => s.id === currentSong?.id);

  // --- O RESTO DO JSX (RETURN) PERMANECE O MESMO ---
  if (isLoading) {
    return (
      <div className="px-6 py-6 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Carregando Playlist...</h1>
      </div>
    );
  }

  if (error) {
     return (
       <div className="px-6 py-6 text-center">
         <h1 className="text-2xl font-bold text-red-500 mb-4">Erro ao carregar</h1>
         <p className="text-neutral-400">{error}</p>
       </div>
     );
  }
  
  if (!playlist) {
    return (
      <div className="px-6 py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Playlist não encontrada</h1>
          <p className="text-neutral-400">A playlist que você procura não existe ou você não tem permissão.</p>
        </div>
      </div>
    );
  }

  return (
    <>
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
              className="rounded-lg shadow-2xl w-full sm:w-[200px] h-auto object-cover aspect-square"
            />
          </div>

          {/* Informações */}
          <div className="flex-1 w-full">
            <p className="text-xs sm:text-sm font-semibold text-neutral-400 mb-2">PLAYLIST</p>
            <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4 break-words">
              {playlist.name}
            </h1>
            <p className="text-neutral-400 mb-6 text-sm sm:text-base">
              {playlist.songCount} {playlist.songCount === 1 ? 'música' : 'músicas'}
            </p>

            {/* Botões de Ação */}
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Button
                onClick={handlePlayPlaylist}
                variant="primary"
                size="md"
                className="flex items-center gap-2"
                disabled={playlist.songs.length === 0}
              >
                {isPlaylistPlaying ? <Pause size={20} /> : <Play size={20} fill="currentColor" />}
                <span className="hidden sm:inline">{isPlaylistPlaying ? 'Pausar' : 'Reproduzir'}</span>
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
              
              <button
                onClick={handleDeletePlaylist}
                className="p-3 rounded-full border border-neutral-400 text-neutral-400 hover:border-red-500 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                aria-label="Deletar playlist"
              >
                <Trash2 size={24} />
              </button>

            </div>
          </div>
        </div>

        {/* Lista de Músicas */}
        <div className="bg-neutral-900/50 rounded-lg p-0 sm:p-2">
          {/* Cabeçalho da lista com Botão de Adicionar */}
          <div className="flex items-center gap-4 px-5 py-2 text-neutral-400 text-xs font-semibold uppercase border-b border-neutral-800">
              <span className="w-8 text-center hidden sm:block">#</span>
              <span className="flex-1 hidden sm:block">Título</span>
              
              <button
                onClick={() => setIsAddSongModalOpen(true)}
                className="flex sm:hidden items-center gap-2 text-white hover:text-green-400 transition-colors ml-auto p-2"
                aria-label="Adicionar músicas"
              >
                 <Plus size={20} />
              </button>
              
              <span className="w-12 text-right hidden sm:block"><Clock size={16} /></span>
              
              {/* Espaço para o botão de remover (para alinhar o header) */}
              <span className="w-9 h-9 hidden sm:block"></span>
          </div>
          
          <Button
            variant="ghost"
            size="md"
            onClick={() => setIsAddSongModalOpen(true)}
            icon={<Plus size={18} />}
            className="my-4 mx-4 hidden sm:inline-flex"
          >
            Adicionar Músicas
          </Button>

          {/* Lista de Músicas */}
          {playlist.songs.length > 0 ? (
            <MusicList
              songs={playlist.songs}
              currentSongId={currentSong?.id}
              isPlaying={isPlaying}
              onPlayClick={handlePlayClick}
              onRemoveClick={handleRemoveSong}
            />
          ) : (
            <p className="text-neutral-500 text-center py-10">
              Esta playlist ainda não tem músicas.
            </p>
          )}
        </div>
      </div>
      
      {/* Renderiza o Modal */}
      <AddSongModal
        isOpen={isAddSongModalOpen}
        onClose={() => setIsAddSongModalOpen(false)}
        playlistId={playlistId}
        onSongAdded={handleSongAdded}
      />
    </>
  );
}