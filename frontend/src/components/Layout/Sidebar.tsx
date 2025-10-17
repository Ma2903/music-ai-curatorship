// frontend/src/components/Layout/Sidebar.tsx
import { Home as HomeIcon, Search, Library, Plus, ChevronRight } from 'lucide-react';
import { mockPlaylists } from '@/lib/mockData';
import Image from 'next/image';

export function Sidebar() {
    return (
        // Sidebar fixa com largura definida (240px) e fundo escuro
        <aside className="w-60 bg-neutral-900 p-6 flex flex-col fixed h-screen top-0 left-0 z-40">    {/* 1. Navegação Principal */}
            {/* 1. Navegação Principal */}
            <nav className="space-y-5">
                <a href="#" className="flex items-center gap-3 text-sm font-semibold text-white hover:text-neutral-300 transition-colors" aria-current="page">
                    <HomeIcon size={24} />
                    Início
                </a>
                <a href="#" className="flex items-center gap-3 text-sm font-semibold text-neutral-400 hover:text-white transition-colors">
                    <Search size={24} />
                    Buscar
                </a>
            </nav>
            
            {/* 2. Sua Biblioteca */}
            <div className="flex flex-col flex-1 mt-6 overflow-hidden">
                {/* Cabeçalho da Biblioteca */}
                <div className="flex items-center justify-between text-neutral-400 mb-4">
                    <a href="#" className="flex items-center gap-2 text-sm font-semibold hover:text-white transition-colors">
                        <Library size={24} />
                        Sua Biblioteca
                    </a>
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
                        <a 
                            key={playlist.id}
                            href="#" 
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
                            <div className="flex flex-col">
                                <strong className="font-medium text-sm text-white group-hover:text-green-400 transition-colors">
                                    {playlist.name}
                                </strong>
                                <span className="text-xs text-neutral-400">
                                    Playlist • {playlist.songCount} músicas
                                </span>
                            </div>
                        </a>
                    ))}
                </nav>
            </div>
        </aside>
    );
}