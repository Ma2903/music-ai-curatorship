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
    <div className="px-4 sm:px-6 py-6 max-w-7xl mx-auto">
      {/* Seção de Boas-vindas */}
      <Section
        title="Bem-vindo ao Music AI Curatorship"
        subtitle="Descubra novas músicas curadas por IA generativa"
      >
        <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg p-4 sm:p-6 border border-green-500/30">
          <p className="text-neutral-300 text-sm leading-relaxed">
            O Music AI Curatorship utiliza a inteligência artificial do Gemini para analisar seu
            histórico de audição e recomendar músicas personalizadas com justificativas detalhadas.
            Cada recomendação é acompanhada de uma explicação sobre por que a IA acha que você
            pode gostar dessa faixa.
          </p>
        </div>
      </Section>

      {/* Seção de Recomendações */}
      <Section
        title="Recomendações para você"
        subtitle="Baseado no seu histórico de audição"
      >
        <Grid columns={4}>
          {recommendations.map((rec) => (
            <MusicCard key={rec.id} recommendation={rec} />
          ))}
        </Grid>
      </Section>

      {/* Seção de Playlists */}
      <Section
        title="Suas Playlists"
        subtitle="Acesse suas playlists favoritas"
      >
        <Grid columns={4}>
          {mockPlaylists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </Grid>
      </Section>

      {/* Seção de Descoberta */}
      <Section
        title="Descobrir"
        subtitle="Explore novos gêneros e artistas"
      >
        <Grid columns={4}>
          {['Pop', 'Rock', 'Lo-Fi', 'Eletrônica', 'Sertanejo'].map((genre) => (
            <div
              key={genre}
              className="bg-neutral-800 hover:bg-neutral-700 transition-colors p-6 rounded-lg cursor-pointer text-center group"
            >
              <p className="font-semibold text-white group-hover:text-green-400 transition-colors">
                {genre}
              </p>
            </div>
          ))}
        </Grid>
      </Section>
    </div>
  );
}

