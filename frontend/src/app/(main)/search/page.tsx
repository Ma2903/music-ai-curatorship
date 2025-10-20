// frontend/src/app/(main)/search/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { SearchBar } from '@/components/UI/SearchBar';
import { MusicCard } from '@/components/UI/MusicCard';
import { PlaylistCard } from '@/components/UI/PlaylistCard';
import { Section } from '@/components/UI/Section';
import { Grid } from '@/components/UI/Grid';
import { Header } from '@/components/UI/Header';
import { mockSongs, mockPlaylists } from '@/lib/mockData';
import { Recommendation } from '@/types/music';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Converter mockSongs para Recommendation com justificativas
  const allRecommendations: Recommendation[] = useMemo(
    () =>
      mockSongs.map((song) => ({
        ...song,
        justification: `Encontrado na busca por "${searchQuery || 'música'}"`,
      })),
    [searchQuery]
  );

  // Filtrar resultados baseado na busca
  const filteredSongs = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    return allRecommendations.filter(
      (song) =>
        song.title.toLowerCase().includes(query) ||
        song.artist.toLowerCase().includes(query) ||
        song.album.toLowerCase().includes(query) ||
        song.genre.toLowerCase().includes(query)
    );
  }, [searchQuery, allRecommendations]);

  const filteredPlaylists = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    return mockPlaylists.filter((playlist) =>
      playlist.name.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <div className="px-4 sm:px-6 py-6 max-w-7xl mx-auto">
      {/* Header */}
      <Header title="Buscar" subtitle="Encontre suas músicas e playlists favoritas" />

      {/* Barra de Busca */}
      <div className="mb-12 max-w-2xl">
        <SearchBar onSearch={setSearchQuery} />
      </div>

      {/* Resultados */}
      {searchQuery.trim() ? (
        <>
          {/* Playlists */}
          {filteredPlaylists.length > 0 && (
            <Section
              title="Playlists"
              subtitle={`${filteredPlaylists.length} resultado(s) encontrado(s)`}
            >
              <Grid columns={4}>
                {filteredPlaylists.map((playlist) => (
                  <PlaylistCard key={playlist.id} playlist={playlist} />
                ))}
              </Grid>
            </Section>
          )}

          {/* Músicas */}
          {filteredSongs.length > 0 && (
            <Section
              title="Músicas"
              subtitle={`${filteredSongs.length} resultado(s) encontrado(s)`}
            >
              <Grid columns={4}>
                {filteredSongs.map((song) => (
                  <MusicCard key={song.id} recommendation={song} />
                ))}
              </Grid>
            </Section>
          )}

          {/* Sem resultados */}
          {filteredSongs.length === 0 && filteredPlaylists.length === 0 && (
            <div className="text-center py-12">
              <p className="text-neutral-400 text-lg">
                Nenhum resultado encontrado para &quot;{searchQuery}&quot;
              </p>
              <p className="text-neutral-500 text-sm mt-2">
                Tente buscar por outro termo
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-neutral-400 text-lg">
            Digite algo para começar a buscar
          </p>
          <p className="text-neutral-500 text-sm mt-2">
            Busque por músicas, artistas, álbuns ou playlists
          </p>
        </div>
      )}
    </div>
  );
}

