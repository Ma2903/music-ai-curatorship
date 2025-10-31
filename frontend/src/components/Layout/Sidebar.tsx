// frontend/src/components/Layout/Sidebar.tsx
'use client';

import Link from 'next/link';
import { Home as HomeIcon, Search, Library, Plus, ChevronRight, LogIn, LogOut, UserPlus } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
// import { Playlist } from '@/types/music'; // Não é mais necessário aqui
import { useState, useEffect } from 'react'; 
import { CreatePlaylistModal } from '@/components/Playlist'; 
import { useRouter } from 'next/navigation'; 
import Swal from 'sweetalert2';
// --- ADIÇÃO ---
import { usePlaylists } from '@/context/PlaylistContext';
// --- FIM DA ADIÇÃO ---

export function Sidebar() {
  const { user, logout: performActualLogout, isLoading, token } = useAuth(); 
  const router = useRouter(); 

  // --- ALTERAÇÃO: Remover estado local de playlists ---
  // const [playlists, setPlaylists] = useState<Playlist[]>([]);
  // const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(false);
  
  // --- ALTERAÇÃO: Consumir do contexto ---
  const { playlists, isLoading: isLoadingPlaylists } = usePlaylists();
  // --- FIM DA ALTERAÇÃO ---

  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- ALTERAÇÃO: Remover useEffect de busca ---
  // O useEffect que buscava playlists foi removido
  // --- FIM DA ALTERAÇÃO ---


  const showLogoutConfirmation = () => {
    Swal.fire({
      title: 'Você tem certeza?',
      text: "Sua sessão será encerrada.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1DB954',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, quero sair!',
      cancelButtonText: 'Cancelar',
      background: '#181818',
      color: '#FFFFFF'
    }).then((result) => {
      if (result.isConfirmed) {
        performActualLogout();
      }
    });
  };

  return (
    <> 
      <aside className="w-60 bg-neutral-900 p-6 flex flex-col fixed h-full top-0 left-0 z-40 border-r border-neutral-800 box-border pb-32">
        {/* ... (Navegação Principal sem mudança) ... */}
        {/* Logo/Título */}
        <div className="mb-8">
          <h1 className="text-xl font-bold text-white">Music AI</h1>
          <p className="text-xs text-neutral-400">Curatorship</p>
        </div>

        {/* 1. Navegação Principal */}
        <nav className="space-y-5 mb-8">
          <Link
            href="/"
            className="flex items-center gap-3 text-sm font-semibold text-white hover:text-green-400 transition-colors"
          >
            <HomeIcon size={24} />
            Início
          </Link>
          <Link
            href="/search"
            className="flex items-center gap-3 text-sm font-semibold text-neutral-400 hover:text-white transition-colors"
          >
            <Search size={24} />
            Buscar
          </Link>
        </nav>

        {/* Divisor */}
        <div className="h-px bg-neutral-800 mb-6"></div>

        {/* 2. Sua Biblioteca */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Cabeçalho da Biblioteca */}
          <div className="flex items-center justify-between text-neutral-400 mb-4">
            <Link
              href="/history" 
              className="flex items-center gap-2 text-sm font-semibold hover:text-white transition-colors"
            >
              <Library size={24} />
              Biblioteca
            </Link>
            <div className="flex items-center gap-3">
              <button
                className="p-1 rounded-full hover:bg-neutral-800 transition-colors"
                aria-label="Criar nova Playlist"
                onClick={() => {
                  if (user) {
                    setIsModalOpen(true);
                  } else {
                    router.push('/login'); 
                  }
                }}
              >
                <Plus size={20} />
              </button>
              <button
                className="p-1 rounded-full hover:bg-neutral-800 transition-colors"
                aria-label="Ordenar biblioteca"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Lista de Playlists (Scrollável) */}
          {/* A lógica de renderização agora usa os dados do contexto */}
          <nav className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2">
            {(isLoading || (user && isLoadingPlaylists)) && ( 
                <p className="text-xs text-neutral-500 px-2">Carregando...</p>
            )}
            
            {user && !isLoadingPlaylists && playlists.length > 0 && (
              playlists.map((playlist) => ( 
                <Link
                  key={playlist.id}
                  href={`/playlist/${playlist.id}`} 
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-800 transition-colors group"
                  role="link"
                  aria-label={`Abrir playlist ${playlist.name}`}
                >
                  <Image
                    src={playlist.coverUrl}
                    alt={`Capa da playlist ${playlist.name}`}
                    width={48}
                    height={48}
                    className="rounded-md object-cover"
                  />
                  <div className="flex flex-col min-w-0">
                    <strong className="font-medium text-sm text-white group-hover:text-green-400 transition-colors truncate">
                      {playlist.name}
                    </strong>
                    <span className="text-xs text-neutral-400 truncate">
                      Playlist • {playlist.songCount} {playlist.songCount === 1 ? 'música' : 'músicas'}
                    </span>
                  </div>
                </Link>
              ))
            )}
            {user && !isLoadingPlaylists && playlists.length === 0 && (
              <p className="text-xs text-neutral-500 px-2">Crie sua primeira playlist no ícone (+).</p>
            )}
            {!user && !isLoading && (
              <p className="text-xs text-neutral-500 px-2">Faça login para ver suas playlists.</p>
            )}
          </nav>
        </div>

        {/* ... (Footer da Sidebar sem mudança) ... */}
        {/* Footer da Sidebar com Botões de Auth */}
        <div className="mt-6 pt-6 border-t border-neutral-800">
          {isLoading ? (
              <p className="text-xs text-neutral-500 text-center">Carregando...</p>
          ) : user ? (
              // Usuário está logado
              <div className="space-y-3">
                  <p className="text-sm text-neutral-300 truncate" title={user.email}>
                      Logado como: <span className="font-medium text-white">{user.name || user.email}</span>
                  </p>
                  <button
                      onClick={showLogoutConfirmation} 
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-red-600/50 hover:bg-red-600/80 rounded-lg transition-colors"
                  >
                      <LogOut size={16} />
                      Sair
                  </button>
              </div>
          ) : (
              // Usuário está deslogado
              <div className="space-y-3">
                  <Link
                      href="/login"
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-black bg-green-500 hover:bg-green-400 rounded-lg transition-colors"
                  >
                      <LogIn size={16} />
                      Entrar
                  </Link>
                  <Link
                      href="/register"
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors"
                  >
                      <UserPlus size={16} />
                      Registrar
                  </Link>
              </div>
          )}
        </div>
      </aside>

      <CreatePlaylistModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}