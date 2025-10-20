// frontend/src/components/Layout/Sidebar.tsx
import Link from 'next/link';
import { Home as HomeIcon, Search, Library, Plus, ChevronRight } from 'lucide-react';
import { mockPlaylists } from '@/lib/mockData';
import Image from 'next/image';

export function Sidebar() {
  return (
    // Sidebar fixa com largura definida (240px) e fundo escuro
    <aside className="w-60 bg-neutral-900 p-6 flex flex-col fixed h-screen top-0 left-0 z-40 border-r border-neutral-800">
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
        <nav className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2">
          {mockPlaylists.map((playlist) => (
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
                  Playlist • {playlist.songCount} músicas
                </span>
              </div>
            </Link>
          ))}
        </nav>
      </div>

      {/* Footer da Sidebar */}
      <div className="mt-6 pt-6 border-t border-neutral-800">
        <p className="text-xs text-neutral-500 text-center">
          Music AI Curatorship © 2024
        </p>
      </div>
    </aside>
  );
}

