// frontend/src/context/PlaylistContext.tsx
'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { Playlist } from '@/types/music';
import { useAuth } from './AuthContext';

interface PlaylistContextType {
  playlists: Playlist[];
  isLoading: boolean;
  error: string | null;
  refetchPlaylists: () => Promise<void>;
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

export function PlaylistProvider({ children }: { children: ReactNode }) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { token, user, isLoading: isLoadingAuth } = useAuth();

  // Função de busca encapsulada
  const fetchPlaylists = useCallback(async () => {
    if (isLoadingAuth) {
        setIsLoading(true);
        return; // Espera a autenticação carregar
    }
    if (!token || !user) {
      setPlaylists([]);
      setIsLoading(false);
      setError(null); // Não é um erro, usuário apenas não está logado
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3333/api/playlists', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `Erro ${response.status}`);
      }
      const data: Playlist[] = await response.json();
      setPlaylists(data);
    } catch (err) {
      console.error("Erro ao buscar playlists (Context):", err);
      setError(err instanceof Error ? err.message : "Falha ao carregar playlists");
      setPlaylists([]);
    } finally {
      setIsLoading(false);
    }
  }, [token, user, isLoadingAuth]);

  // Busca inicial
  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]); // O useCallback garante que fetchPlaylists é estável

  return (
    <PlaylistContext.Provider value={{ playlists, isLoading, error, refetchPlaylists: fetchPlaylists }}>
      {children}
    </PlaylistContext.Provider>
  );
}

// Hook customizado
export function usePlaylists() {
  const context = useContext(PlaylistContext);
  if (context === undefined) {
    throw new Error('usePlaylists must be used within a PlaylistProvider');
  }
  return context;
}