// frontend/src/app/(main)/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link'; 
import { useRouter } from 'next/navigation'; 
import { MusicCard } from '@/components/UI/MusicCard';
import { PlaylistCard } from '@/components/UI/PlaylistCard';
import { Section } from '@/components/UI/Section';
import { Grid } from '@/components/UI/Grid';
import { Recommendation, Playlist } from '@/types/music';
import { useAuth } from '@/context/AuthContext'; 
// --- ADIÇÃO ---
import { usePlaylists } from '@/context/PlaylistContext';
// --- FIM DA ADIÇÃO ---

export default function Home() {
  // Estado para recomendações da IA
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoadingRecs, setIsLoadingRecs] = useState(true);
  const [errorRecs, setErrorRecs] = useState<string | null>(null);

  // --- ALTERAÇÃO: Remover estado local de playlists ---
  // const [playlists, setPlaylists] = useState<Playlist[]>([]);
  // const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(true); 
  // const [errorPlaylists, setErrorPlaylists] = useState<string | null>(null); 
  
  // --- ALTERAÇÃO: Consumir do contexto ---
  const { playlists, isLoading: isLoadingPlaylists, error: errorPlaylists } = usePlaylists();
  // --- FIM DA ALTERAÇÃO ---

  const { token, user, isLoading: isLoadingAuth } = useAuth();
  const router = useRouter(); 

  // --- ALTERAÇÃO: Simplificar o useEffect ---
  // Removemos a função fetchPlaylists daqui
  useEffect(() => {
    if (isLoadingAuth) {
      setIsLoadingRecs(true); 
      return;
    }

    const fetchRecommendations = async () => {
      if (!token) { 
           console.log("Usuário não logado, não buscando recomendações.");
           setIsLoadingRecs(false);
           setErrorRecs("Faça login para ver suas recomendações personalizadas.");
           setRecommendations([]); 
           return;
      }
      setIsLoadingRecs(true);
      setErrorRecs(null);
      try {
          const response = await fetch('http://localhost:3333/api/recommendations', {
              headers: { 'Authorization': `Bearer ${token}` }
          });
           if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || `Erro ${response.status}`);
          }
          const data: Recommendation[] = await response.json();
          setRecommendations(data);
      } catch (error) {
          console.error("Erro ao buscar recomendações:", error);
          setErrorRecs(error instanceof Error ? error.message : "Falha ao carregar recomendações");
          setRecommendations([]);
      } finally {
          setIsLoadingRecs(false);
      }
    };
    
    fetchRecommendations();
    // fetchPlaylists() foi removido daqui

  }, [token, isLoadingAuth]); 
  // --- FIM DA ALTERAÇÃO ---

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto space-y-12 animate-fade-in">
      {/* Seção Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500/20 via-neutral-900 to-neutral-900 border border-green-500/30 p-8 sm:p-12 backdrop-blur-sm">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-500 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
            {user ? `Bem-vindo, ${user.name || user.email}!` : "Music AI Curatorship"}
          </h1>
          <p className="text-lg text-neutral-300 max-w-2xl leading-relaxed">
            {user
              ? "Aqui estão suas recomendações personalizadas de hoje."
              : "Descubra músicas personalizadas curadas por inteligência artificial. Faça login para começar."
            }
          </p>
        </div>
      </div>

      {/* Seção de Recomendações */}
      <Section
        title="Recomendações para você"
        subtitle={errorRecs ? "Não foi possível carregar" : "Baseado no seu histórico de audição"}
      >
        {/* ... (Renderização das recomendações não muda) ... */}
        {isLoadingRecs || isLoadingAuth ? (
          <p className="text-neutral-400">Carregando recomendações da IA...</p>
        ) : errorRecs ? (
          <p className="text-red-500">{errorRecs}</p>
        ) : recommendations.length === 0 && user ? (
          <p className="text-neutral-500">Nenhuma recomendação disponível. Comece a ouvir músicas para treinar a IA!</p>
        ) : recommendations.length > 0 && user ? (
          <Grid columns={4}>
            {recommendations.map((rec, index) => (
              <div 
                key={`${rec.id}-${index}`} 
                className="animate-slide-up" 
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <MusicCard recommendation={rec} />
              </div>
            ))}
          </Grid>
        ) : (
           !user && <p className="text-neutral-500">{errorRecs || "Faça login para ver suas recomendações."}</p>
        )}
      </Section>

      {/* Seção de Playlists */}
      {/* A lógica de renderização agora usa os dados do contexto */}
      <Section
        title="Suas Playlists"
        subtitle="Acesse suas playlists favoritas"
      >
          {isLoadingAuth || isLoadingPlaylists ? (
             <p className="text-neutral-400">Carregando playlists...</p>
          ) : errorPlaylists ? (
             <p className="text-red-500">{errorPlaylists}</p>
          ) : user && playlists.length > 0 ? (
             <Grid columns={4}>
                {playlists.map((playlist, index) => (
                  <Link 
                    href={`/playlist/${playlist.id}`} 
                    key={playlist.id} 
                    className="animate-slide-up" 
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <PlaylistCard 
                      playlist={playlist} 
                      onPlay={() => router.push(`/playlist/${playlist.id}`)}
                    />
                  </Link>
                ))}
             </Grid>
          ) : user ? (
             <p className="text-neutral-500">Você ainda não criou nenhuma playlist.</p>
          ) : (
             <p className="text-neutral-500">Faça login para ver suas playlists.</p>
          )}
      </Section>

    </div>
  );
}