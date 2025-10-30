// frontend/src/app/(main)/search/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { SearchBar } from '@/components/UI/SearchBar';
import { MusicCard } from '@/components/UI/MusicCard';
import { PlaylistCard } from '@/components/UI/PlaylistCard'; // Mantendo para estrutura
import { Section } from '@/components/UI/Section';
import { Grid } from '@/components/UI/Grid';
import { Header } from '@/components/UI/Header';
import { Recommendation, Playlist, Song } from '@/types/music'; // Tipos atualizados
// import { formatDuration } from '@/lib/utils'; // Não precisamos mais formatar aqui
import { useDebounce } from '@/hooks/useDebounce'; // Importar o Hook

// Interface para os dados que o NOSSO backend retorna (baseado no Jamendo)
// É muito similar ao nosso tipo Song
interface JamendoTrackResponseItem {
    id: string;
    title: string;
    artist: string;
    album: string;
    duration: string; // Já formatado "m:ss" pelo backend
    durationSeconds?: number;
    imageUrl?: string | null;
    audioUrl?: string | null; // <<< URL do Stream Completo >>>
    previewUrl?: string | null; // Provavelmente sempre null
    genre?: string | null; // Backend não retorna isso ainda
    mood?: string | null; // Backend não retorna isso ainda
}
// Interface para sugestões (campos limitados)
interface SuggestionItem extends Pick<Song, 'id' | 'title' | 'artist' | 'imageUrl'> {}


export default function SearchPage() {
  // Estado para a query DA BUSCA PRINCIPAL (acionada por Enter/clique)
  const [mainSearchQuery, setMainSearchQuery] = useState('');
  // Estado para a query DE SUGESTÕES (atualizada a cada digitação)
  const [suggestionQuery, setSuggestionQuery] = useState('');
  // Estado para os resultados da BUSCA PRINCIPAL
  const [searchResults, setSearchResults] = useState<JamendoTrackResponseItem[]>([]);
  // Estado para os resultados das SUGESTÕES (já filtradas no backend)
  const [suggestionResults, setSuggestionResults] = useState<SuggestionItem[]>([]);
  // Estados de Loading
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  // Estados de Erro
  const [errorSearch, setErrorSearch] = useState<string | null>(null);
  const [errorSuggestions, setErrorSuggestions] = useState<string | null>(null);

  // Aplica debounce na query de SUGESTÕES
  const debouncedSuggestionQuery = useDebounce(suggestionQuery, 400); // Atraso de 400ms

  // Função para buscar resultados PRINCIPAIS (todos, sem filtro de preview)
  const fetchSearchResults = useCallback(async (query: string) => {
      if (!query.trim()) {
          setSearchResults([]);
          setErrorSearch(null);
          return;
      }
      console.log("Fetching MAIN search results for:", query);
      setIsLoadingSearch(true);
      setErrorSearch(null);
      try {
          // Busca SEM previewsOnly (não existe mais no backend atualizado)
          const response = await fetch(`http://localhost:3333/api/search?q=${encodeURIComponent(query)}&limit=20`);
           if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Erro ${response.status} na busca principal`);
            }
            // <<< USA O NOVO TIPO >>>
            const data: JamendoTrackResponseItem[] = await response.json();
            setSearchResults(data);
      } catch (err) {
           console.error("Erro na busca principal:", err);
           setErrorSearch(err instanceof Error ? err.message : 'Erro desconhecido');
           setSearchResults([]);
      } finally { setIsLoadingSearch(false); }
  }, []); // Sem dependências, pois usa a query passada como argumento

  // Efeito para buscar SUGESTÕES quando a query DEBOUNCED mudar
  useEffect(() => {
      // Só busca se tiver texto após o debounce
      if (!debouncedSuggestionQuery.trim()) {
          setSuggestionResults([]);
          setErrorSuggestions(null);
          return;
      }
      const fetchSuggestions = async () => {
          console.log("Fetching SUGGESTIONS for:", debouncedSuggestionQuery);
          setIsLoadingSuggestions(true);
          setErrorSuggestions(null);
          try {
              // Busca COM limite baixo (previewsOnly não é mais necessário no backend com Jamendo)
              const response = await fetch(`http://localhost:3333/api/search?q=${encodeURIComponent(debouncedSuggestionQuery)}&limit=7`);
               if (!response.ok) {
                   const errorData = await response.json();
                   throw new Error(errorData.error || `Erro ${response.status} nas sugestões`);
               }
               // <<< USA O NOVO TIPO >>>
               const data: JamendoTrackResponseItem[] = await response.json();
               // Mapeia para SuggestionItem
               setSuggestionResults(data.map(track => ({
                   id: track.id, title: track.title, artist: track.artist, imageUrl: track.imageUrl
               })));
          } catch (err) {
              console.error("Erro ao buscar sugestões:", err);
              setErrorSuggestions(err instanceof Error ? err.message : 'Erro desconhecido');
              setSuggestionResults([]);
          } finally { setIsLoadingSuggestions(false); }
      };
      fetchSuggestions();
  }, [debouncedSuggestionQuery]); // Depende APENAS da query com debounce

  // Adapta resultados da busca PRINCIPAL para Recommendation
  const formattedRecommendations: Recommendation[] = searchResults.map(track => ({
       id: track.id, // String
       title: track.title,
       artist: track.artist,
       album: track.album,
       duration: track.duration, // Já formatado pelo backend
       imageUrl: track.imageUrl,
       // <<< USA audioUrl (stream completo) como fonte principal >>>
       audioUrl: track.audioUrl,
       previewUrl: track.previewUrl, // Ainda pode passar, mas será null
       // genre e mood ainda não vêm da busca simples
       justification: `Encontrado via Jamendo por "${mainSearchQuery}"`, // Atualiza justificação
   }));

  // Placeholder para busca de playlists (não implementado)
  const filteredPlaylists: Playlist[] = [];

  return (
      <div className="px-4 sm:px-6 py-6 max-w-7xl mx-auto">
          <Header title="Buscar" subtitle="Encontre músicas (Jamendo)" />
          <div className="mb-12 max-w-2xl">
               <SearchBar
                  // Função chamada no Enter/Clique na sugestão
                  onSearch={(queryFromSearch) => {
                      setMainSearchQuery(queryFromSearch); // Define a query principal
                      fetchSearchResults(queryFromSearch); // Dispara a busca principal
                  }}
                  // Função chamada a cada digitação
                  onQueryChange={setSuggestionQuery} // Atualiza a query que busca sugestões
                  // Passa as sugestões
                  suggestions={suggestionResults}
                  isLoadingSuggestions={isLoadingSuggestions}
                  placeholder="Buscar músicas (Jamendo)..." // Atualiza placeholder
                  // Limpa tudo ao clicar no 'X'
                  onClear={() => {
                      setMainSearchQuery(''); setSuggestionQuery('');
                      setSearchResults([]); setSuggestionResults([]);
                  }}
              />
          </div>

           {/* Exibe erros */}
           {errorSuggestions && <p className="text-center text-sm text-red-600 mb-4">Erro ao buscar sugestões: {errorSuggestions}</p>}
           {errorSearch && <p className="text-center text-red-500 mb-4">Erro na busca principal: {errorSearch}</p>}

          {/* Indicador de Loading da Busca Principal */}
          {isLoadingSearch && <p className="text-center text-neutral-400">Buscando...</p>}

          {/* Exibição dos Resultados da Busca Principal */}
          {!isLoadingSearch && mainSearchQuery.trim() && ( // Só mostra se uma busca principal foi feita
              <>
                 {/* Músicas encontradas */}
                  {formattedRecommendations.length > 0 && (
                      <Section title="Resultados da Busca" subtitle={`${formattedRecommendations.length} música(s) encontrada(s)`} >
                          <Grid columns={4}>
                              {formattedRecommendations.map((rec) => ( <MusicCard key={rec.id} recommendation={rec} /> ))}
                          </Grid>
                      </Section>
                  )}
                  {/* Nenhuma música encontrada */}
                  {formattedRecommendations.length === 0 && !errorSearch && (
                       <div className="text-center py-12"> <p className="text-neutral-400 text-lg"> Nenhum resultado encontrado para "{mainSearchQuery}" </p> </div>
                  )}
              </>
          )}

           {/* Mensagem inicial (quando mainSearchQuery está vazio) */}
           {!isLoadingSearch && !mainSearchQuery.trim() && (
               <div className="text-center py-12"> <p className="text-neutral-400 text-lg"> Digite algo para buscar músicas ou artistas </p> </div>
           )}
      </div>
  );
}