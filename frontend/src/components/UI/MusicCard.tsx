// frontend/src/components/UI/MusicCard.tsx
import Image from 'next/image';
import { Play } from 'lucide-react';
import { Recommendation } from '@/types/music';

// Recebe um objeto de recomendação (que inclui a justificativa)
interface MusicCardProps {
    recommendation: Recommendation;
}

export function MusicCard({ recommendation }: MusicCardProps) {
    const { title, artist, imageUrl, justification } = recommendation;

    return (
        // O Card principal, responsivo e com visual do Spotify (escuro)
        <div 
            className="group bg-neutral-800/50 hover:bg-neutral-800 transition-all duration-300 p-4 rounded-lg cursor-pointer flex flex-col relative overflow-hidden shadow-xl"
            title={title} // Acessibilidade: título completo no hover
        >
            {/* Botão de Play Flutuante */}
            <button
                className="absolute right-6 bottom-24 p-4 rounded-full bg-green-500 text-black shadow-lg opacity-0 group-hover:opacity-100 group-hover:bottom-28 transition-all duration-300 ease-in-out hover:scale-105"
                aria-label={`Tocar ${title} de ${artist}`}
            >
                <Play fill="currentColor" size={24} />
            </button>

            {/* Imagem/Capa */}
            <div className="w-full aspect-square mb-4 relative">
                <Image
                    src={imageUrl}
                    alt={`Capa do álbum de ${title}`}
                    width={150} // Next/Image precisa de largura e altura
                    height={150}
                    className="rounded-lg object-cover w-full h-full shadow-lg"
                    priority
                />
            </div>

            {/* Informações da Música */}
            <div className="flex flex-col min-h-[100px]">
                <strong className="font-bold text-base truncate" aria-label={`Música: ${title}`}>{title}</strong>
                <span className="text-sm text-neutral-400 mt-1 truncate" aria-label={`Artista: ${artist}`}>{artist}</span>

                {/* Justificativa da IA (O DIFERENCIAL) */}
                <p className="text-xs text-green-400 mt-2 line-clamp-2" title={`Justificativa da IA: ${justification}`}>
                    IA Curadoria: {justification}
                </p>
            </div>
        </div>
    );
}