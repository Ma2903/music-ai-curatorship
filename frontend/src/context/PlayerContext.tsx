// frontend/src/context/PlayerContext.tsx
'use client';

import React, { createContext, useState, useContext, useRef, useEffect, ReactNode, useCallback } from 'react';
import { Song } from '@/types/music';
import { useAuth } from './AuthContext'; // <<< 1. IMPORTAR o hook de autenticação

interface PlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  playSong: (song: Song) => void;
  pauseSong: () => void;
  togglePlayPause: () => void;
  audioElement: HTMLAudioElement | null;
  currentTime: number;
  duration: number;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const { token } = useAuth(); // <<< 2. PEGAR O TOKEN DO AuthContext >>>

  // --- Função para Salvar Histórico (Atualizada) ---
  const saveToHistory = useCallback(async (song: Song) => {
    if (!token || !song) { // <<< 3. USA O TOKEN DO CONTEXTO >>>
        console.log("Não logado ou sem música, não salvando histórico.");
        return;
    }

    console.log(`Tentando salvar no histórico: ${song.title} (ID: ${song.id})`);
    try {
      const response = await fetch('http://localhost:3333/api/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Envia o token
        },
        body: JSON.stringify({
          songId: song.id,
          title: song.title,
          artist: song.artist,
          genre: song.genre,
          mood: song.mood
        })
      });

      if (response.ok) {
        console.log("Histórico salvo com sucesso para:", song.title);
      } else {
        const errorData = await response.json();
        console.error("Falha ao salvar histórico:", errorData.error);
      }
    } catch (error) {
      console.error("Erro de rede ao salvar histórico:", error);
    }
  }, [token]); // <<< 4. ADICIONAR token como dependência >>>

  // ... (tryPlay, loadSong como no seu arquivo original) ...
  const tryPlay = useCallback(() => {
    // <<< USA audioUrl >>>
    if (audioRef.current && currentSong?.audioUrl) {
      console.log("Tentando play() para:", currentSong.title);
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
        }).catch(error => {
          console.error("Erro ao iniciar play():", error);
          setIsPlaying(false);
        });
      }
    } else {
        console.warn("tryPlay: audioRef ou audioUrl indisponível.");
    }
  }, [currentSong]);

  const loadSong = useCallback((song: Song) => {
    // <<< USA audioUrl >>>
    if (!audioRef.current || !song.audioUrl) {
      console.warn(`loadSong: audioRef indisponível ou música "${song.title}" sem audioUrl.`);
      if (audioRef.current) audioRef.current.src = '';
      setCurrentSong(null);
      setIsPlaying(false);
      setDuration(0);
      setCurrentTime(0);
      return false;
    }
    console.log("loadSong: Carregando", song.title, song.audioUrl);
    setCurrentSong(song);
    // <<< USA audioUrl >>>
    audioRef.current.src = song.audioUrl;
    audioRef.current.load();
    setIsPlaying(false);
    setDuration(0);
    setCurrentTime(0);
    return true;
  }, []);


  const playSong = useCallback((song: Song) => {
    console.log("playSong chamado para:", song.title);
    if (currentSong?.id === song.id) {
        if (!isPlaying) {
            tryPlay();
        }
    } else {
      const loaded = loadSong(song);
      if (loaded) {
          setTimeout(() => {
              tryPlay();
              saveToHistory(song); // <<< 5. CHAMA A FUNÇÃO DE HISTÓRICO >>>
          }, 50);
      }
    }
  }, [currentSong, isPlaying, loadSong, tryPlay, saveToHistory]); // <<< 6. ADICIONAR saveToHistory >>>

  // ... (pauseSong, togglePlayPause, useEffects, etc. como no seu arquivo original) ...
  const pauseSong = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  }, []);

  const togglePlayPause = useCallback(() => {
    // <<< USA audioUrl >>>
    if (!currentSong || !currentSong.audioUrl) {
      console.warn("togglePlayPause: Nenhuma música válida carregada.");
      return;
    }
    if (isPlaying) {
      pauseSong();
    } else {
      tryPlay();
    }
  }, [isPlaying, currentSong, pauseSong, tryPlay]);

  useEffect(() => {
    if (!audioRef.current) {
        audioRef.current = new Audio();
        console.log("Elemento Audio criado.");
        setIsReady(true);
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isReady) return;
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(isNaN(audio.duration) ? 0 : audio.duration);
    const handleEnded = () => { setIsPlaying(false); setCurrentTime(0); };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleError = (e: Event | string) => {
         console.error("Erro no elemento de áudio:", audio.error, e);
         setIsPlaying(false);
     };
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
    };
  }, [isReady]);

  return (
    <PlayerContext.Provider value={{
        currentSong,
        isPlaying,
        playSong,
        pauseSong,
        togglePlayPause,
        audioElement: audioRef.current,
        currentTime,
        duration
        }}>
      {children}
    </PlayerContext.Provider>
  );
}

// Hook
export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}