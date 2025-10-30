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

interface PlaylistPageProps {
  params: { id: string };
}

export default function PlaylistPage(props: PlaylistPageProps) { 
  
  // =================================================================
  // <<< 1. CORREÇÃO PARA O AVISO DO NEXT.JS >>>
  // Usamos o hook 'use' para acessar os params de forma segura.
  // =================================================================
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

  // Busca dados da playlist na API
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

  // Handler para tocar uma música da lista
  const handlePlayClick = (song: Song) => {
    if (currentSong?.id === song.id) {
      togglePlayPause(); 
    } else {
      playSong(song); 
    }
  };

  // Handler para tocar a playlist inteira
  const handlePlayPlaylist = () => {
    if (!playlist || playlist.songs.length === 0) return;
    if (currentSong?.id === playlist.songs[0].id) {
      togglePlayPause();
    } else {
      playSong(playlist.songs[0]);
    }
  };

  // Handler para remover música
  const handleRemoveSong = async (songToRemove: Song) => {
    if (!token || !playlist) return;
    
    if (!confirm(`Tem certeza que quer remover "${songToRemove.title}" da playlist?`)) {
      return;
    }

    setPlaylist((prev) => {
      if (!prev) return null;
      const newSongs = prev.songs.filter(s => s.id !== songToRemove.id);
      return {
        ...prev,
        songs: newSongs,
        songCount: newSongs.length,
      };
    });

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
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Erro ao remover');
      window.location.reload(); 
    }
  };

  // Handler para quando o modal adiciona uma música
  const handleSongAdded = (newSong: Song) => {
    if (!playlist) return;
    setPlaylist({
      ...playlist,
      songs: [...playlist.songs, newSong],
      songCount: playlist.songCount + 1,
    });
  };

  // Handler para Deletar a playlist inteira
  const handleDeletePlaylist = async () => {
    if (!token || !playlist) return;

    if (confirm(`Tem certeza que quer DELETAR a playlist "${playlist.name}"? Esta ação não pode ser desfeita.`)) {
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
        
        router.push('/');

      } catch (err) {
         setError(err instanceof Error ? err.message : 'Erro desconhecido ao deletar.');
      }
    }
  };

  // Verifica se a playlist (inteira) está tocando
  const isPlaylistPlaying = isPlaying && playlist?.songs.some(s => s.id === currentSong?.id);

  // =================================================================
  // <<< 2. CORREÇÃO PARA O ERRO "playlist is null" >>>
  // Estas verificações (guards) precisam vir ANTES do return principal.
  // Elas impedem que o código tente renderizar `playlist.coverUrl` se
  // a playlist for nula, estiver carregando ou tiver dado erro.
  // =================================================================

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

  // --- Renderização Principal ---
  // (Só acontece se isLoading=false, error=null, e playlist=objeto)
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