// frontend/src/components/UI/MusicCard.tsx
'use client';

import Image from 'next/image';
import { Play, Heart, Share2, Music, Pause, XCircle } from 'lucide-react'; // Importar XCircle
import { useState } from 'react';
import { Recommendation } from '@/types/music'; // Seu tipo Recommendation
import { usePlayer } from '@/context/PlayerContext'; // Seu hook do contexto

interface MusicCardProps {
  recommendation: Recommendation;
}

export function MusicCard({ recommendation }: MusicCardProps) {
  // Pega estado e funções do contexto do player
  const { playSong, currentSong, isPlaying, togglePlayPause } = usePlayer();
  // Desestrutura as propriedades da recomendação, incluindo audioUrl
  const { id, title, artist, imageUrl, justification, mood, genre, audioUrl } = recommendation;

  // Estado local para favorito (pode ser movido para contexto/API depois)
  const [isFavoritedLocal, setIsFavoritedLocal] = useState(false);

  // Verifica se esta música é a que está tocando no player
  const isCurrentlyPlaying = isPlaying && currentSong?.id === id;
  // <<< MUDANÇA: Verifica se existe audioUrl >>>
  const hasAudio = !!audioUrl; // Converte audioUrl (string|null|undefined) para boolean

  // Handler para clicar no botão de favorito
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Impede que o clique se propague e toque a música
    setIsFavoritedLocal(!isFavoritedLocal);
    console.log("Favoritar/Desfavoritar:", title);
    // TODO: Adicionar lógica real para salvar favorito via API/Contexto
  };

  // Handler para clicar no botão de compartilhar
  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Impede que o clique se propague
    console.log("Compartilhar:", title);
     // TODO: Adicionar lógica real de compartilhar (ex: copiar link)
  };

  // Handler para o botão Play/Pause que aparece sobre a imagem
  const handlePlayPauseOverlayClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Impede propagação

    // <<< MUDANÇA: Verifica hasAudio >>>
    if (hasAudio) {
        console.log(`Botão Play/Pause Overlay clicado para: ${title}. Estado atual: ${isPlaying ? 'Tocando' : 'Pausado'}. Esta música está tocando? ${isCurrentlyPlaying}`);
        if (isCurrentlyPlaying) {
            togglePlayPause(); // Se esta música está tocando, pausa
        } else {
            playSong(recommendation); // Se outra ou nenhuma está tocando, toca esta
        }
    } else {
        // Log ou feedback de que não há áudio
        console.log(`Tentativa de tocar "${title}" ignorada: Sem audioUrl.`);
        // Opcional: Mostrar uma notificação/toast para o usuário aqui
    }
  };

  return (
    // O div principal não tem mais onClick para evitar toques acidentais
    <div className="group relative h-full">
      {/* Container do Card com estilo condicional de opacidade */}
      <div className={`relative h-full rounded-xl overflow-hidden bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700/50 transition-all duration-300 ${
          hasAudio ? 'hover:border-neutral-600 hover:shadow-2xl' : 'opacity-60' // Menos opaco se não tiver áudio
          }`}>
        {/* Overlay de gradiente no hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

        {/* Container da Imagem */}
        <div className="relative w-full aspect-square overflow-hidden bg-neutral-900">
          {imageUrl ? (
             <Image
                src={imageUrl}
                alt={`Capa do álbum de ${title}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                // Adiciona 'sizes' para otimização e remover warning do console
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
          ) : (
             // Placeholder se não houver imagem
             <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-neutral-600">
                <Music size={48} />
             </div>
          )}

          {/* Overlay com botão Play/Pause ou Indicação de Indisponível */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
              {/* Botão principal de interação */}
              <button
                onClick={handlePlayPauseOverlayClick}
                // <<< MUDANÇA: Usa hasAudio para disabled >>>
                disabled={!hasAudio}
                className={`p-3 rounded-full text-black transition-all transform duration-300 ease-out scale-75 group-hover:scale-100 ${
                  hasAudio
                    ? 'bg-green-500 hover:scale-110 active:scale-100 cursor-pointer' // Estilo normal/ativo
                    : 'bg-neutral-600 cursor-not-allowed text-neutral-400' // Estilo desabilitado
                }`}
                aria-label={
                    // <<< MUDANÇA: Usa hasAudio para label >>>
                    !hasAudio ? `Áudio indisponível para ${title}` :
                    isCurrentlyPlaying ? `Pausar ${title}` : `Tocar ${title}` // Labels normais
                }
              >
                  {/* Ícone condicional */}
                  {/* <<< MUDANÇA: Usa hasAudio para ícone >>> */}
                  {!hasAudio ? (
                    <XCircle size={24} /> // Ícone 'X' se não houver áudio
                  ) : isCurrentlyPlaying ? (
                    <Pause size={24} fill="currentColor" /> // Ícone Pause
                  ) : (
                    <Play size={24} fill="currentColor" /> // Ícone Play
                  )}
              </button>
          </div>
        </div>

        {/* Container do Conteúdo de Texto */}
        <div className="p-4 pt-2 relative z-0"> {/* z-0 para ficar abaixo dos botões flutuantes */}
           {/* Botões superiores (Fav/Share) posicionados absolutamente */}
           <div className="absolute top-2 right-2 flex gap-1 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                 <button
                    onClick={handleFavoriteClick}
                    className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                    isFavoritedLocal
                        ? 'bg-red-500/80 text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                    aria-label={`${isFavoritedLocal ? 'Remover de' : 'Adicionar a'} favoritos`}
                 >
                    <Heart size={16} fill={isFavoritedLocal ? 'currentColor' : 'none'} />
                </button>
                 <button
                    onClick={handleShareClick}
                    className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-200 backdrop-blur-sm"
                    aria-label="Compartilhar"
                 >
                    <Share2 size={16} />
                </button>
           </div>

            {/* Informações da Música */}
            <div className="space-y-1 mt-2">
              {/* <<< MUDANÇA: Usa hasAudio para cor do título >>> */}
              <h3 className={`font-bold text-sm line-clamp-2 transition-colors duration-300 ${hasAudio ? 'text-white group-hover:text-green-400' : 'text-neutral-500'}`}>
                {title}
              </h3>
              <p className="text-xs text-neutral-400 truncate">{artist}</p>
            </div>

            {/* Tags (Mood/Genre) */}
            {(mood || genre) && (
              <div className="flex gap-1.5 flex-wrap mt-2">
                {mood && <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-[10px] font-semibold rounded-full"> {mood} </span>}
                {genre && <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 text-[10px] font-semibold rounded-full"> {genre} </span>}
              </div>
            )}

             {/* Justificativa da IA */}
             {justification && (
                 <div className="mt-2 bg-neutral-800/50 border border-neutral-700/50 rounded-md p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-h-16 overflow-hidden">
                    <p className="text-[11px] text-neutral-300 line-clamp-3">
                        <span className="font-semibold text-green-400">IA: </span>
                        {justification}
                    </p>
                </div>
             )}
        </div>
      </div>

      {/* Efeito de Brilho (Glow) - Condicional */}
       {/* <<< MUDANÇA: Usa hasAudio para Glow Effect >>> */}
       {hasAudio && (
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/0 via-green-500/0 to-green-500/0 rounded-xl opacity-0 group-hover:opacity-100 group-hover:from-green-500/20 group-hover:to-green-500/10 transition-opacity duration-300 -z-10 blur-xl" />
       )}
    </div>
  );
}