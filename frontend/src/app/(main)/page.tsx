// frontend/src/app/(main)/page.tsx
'use client';

import { useState } from 'react';
import { MusicCard } from '@/components/UI/MusicCard';
import { PlaylistCard } from '@/components/UI/PlaylistCard';
import { Section } from '@/components/UI/Section';
import { Grid } from '@/components/UI/Grid';
import { mockRecommendation, mockPlaylists, mockSongs } from '@/lib/mockData';
import { Recommendation } from '@/types/music';

export default function Home() {
  const [recommendations] = useState<Recommendation[]>([
    mockRecommendation,
    {
      ...mockSongs[0],
      justification:
        'A IA notou que você gosta de eletrônica relaxante. Esta faixa combina sintetizadores suaves com batidas minimalistas.',
    },
    {
      ...mockSongs[1],
      justification:
        'Baseado no seu histórico de rock energético, esta é uma ótima opção para sessões de treino.',
    },
    {
      ...mockSongs[2],
      justification:
        'Lo-Fi perfeito para concentração. A IA detectou que você ouve muito este gênero durante o trabalho.',
    },
  ]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto space-y-12 animate-fade-in">
      {/* Seção Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500/20 via-neutral-900 to-neutral-900 border border-green-500/30 p-8 sm:p-12 backdrop-blur-sm">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-500 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
            Music AI Curatorship
          </h1>
          <p className="text-lg text-neutral-300 max-w-2xl leading-relaxed">
            Descubra músicas personalizadas curadas por inteligência artificial. Cada recomendação vem com uma explicação detalhada sobre por que a IA acha que você pode gostar.
          </p>
        </div>
      </div>

      {/* Seção de Recomendações */}
      <Section
        title="Recomendações para você"
        subtitle="Baseado no seu histórico de audição"
      >
        <Grid columns={4}>
          {recommendations.map((rec, index) => (
            <div key={rec.id} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
              <MusicCard recommendation={rec} />
            </div>
          ))}
        </Grid>
      </Section>

      {/* Seção de Playlists */}
      <Section
        title="Suas Playlists"
        subtitle="Acesse suas playlists favoritas"
      >
        <Grid columns={4}>
          {mockPlaylists.map((playlist, index) => (
            <div key={playlist.id} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
              <PlaylistCard playlist={playlist} />
            </div>
          ))}
        </Grid>
      </Section>

      {/* Seção de Gêneros */}
      <Section
        title="Explorar Gêneros"
        subtitle="Descubra novos estilos e artistas"
      >
        <Grid columns={4}>
          {['Pop', 'Rock', 'Lo-Fi', 'Eletrônica', 'Sertanejo', 'Rap', 'Reggae', 'Jazz'].map((genre, index) => (
            <div
              key={genre}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700/50 p-6 cursor-pointer transition-all duration-300 hover:border-green-500/50 hover:shadow-2xl hover:shadow-green-500/20 animate-scale-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-green-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10 text-center">
                <p className="text-lg font-bold text-white group-hover:text-green-400 transition-colors duration-300">
                  {genre}
                </p>
              </div>
            </div>
          ))}
        </Grid>
      </Section>
    </div>
  );
}

