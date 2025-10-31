// frontend/src/context/PlayerContext.tsx
'use client';

import React, { createContext, useState, useContext, useRef, useEffect, ReactNode, useCallback } from 'react';
import { Song } from '@/types/music';
import { useAuth } from './AuthContext';

interface PlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  playSong: (song: Song) => void;
  pauseSong: () => void;
  togglePlayPause: () => void;
  audioElement: HTMLAudioElement | null;
  currentTime: number;
  duration: number;
  volume: number;
  seek: (time: number) => void;
  changeVolume: (volume: number) => void;
  // --- ADIÇÕES ---
  isSeeking: boolean;
  setIsSeeking: (seeking: boolean) => void;
  // --- FIM DAS ADIÇÕES ---
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1); // 1 = 100%
  // --- ADIÇÃO ---
  const [isSeeking, setIsSeeking] = useState(false);
  // --- FIM DA ADIÇÃO ---

  const { token } = useAuth();

  const saveToHistory = useCallback(async (song: Song) => {
    if (!token || !song) {
        console.log("Não logado ou sem música, não salvando histórico.");
        return;
    }
    console.log(`Tentando salvar no histórico: ${song.title} (ID: ${song.id})`);
    try {
      const response = await fetch('http://localhost:3333/api/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
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
  }, [token]);

  const tryPlay = useCallback(() => {
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
              saveToHistory(song);
          }, 50);
      }
    }
  }, [currentSong, isPlaying, loadSong, tryPlay, saveToHistory]);

  const pauseSong = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  }, []);

  const togglePlayPause = useCallback(() => {
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

  const seek = (time: number) => {
    if (audioRef.current && isFinite(time)) {
      audioRef.current.currentTime = time;
      setCurrentTime(time); // Atualiza o estado imediatamente
    }
  };

  const changeVolume = (newVolume: number) => {
    if (audioRef.current) {
      const clampedVolume = Math.max(0, Math.min(1, newVolume));
      audioRef.current.volume = clampedVolume;
      setVolume(clampedVolume);
    }
  };

  useEffect(() => {
    if (!audioRef.current) {
        audioRef.current = new Audio();
        audioRef.current.volume = volume;
        console.log("Elemento Audio criado.");
        setIsReady(true);
    }
  }, [volume]); 

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isReady) return;
    
    // --- ALTERAÇÃO: Só atualiza o tempo se não estiver arrastando ---
    const handleTimeUpdate = () => {
      if (audio.currentTime && !isSeeking) {
        setCurrentTime(audio.currentTime);
      }
    };
    // --- FIM DA ALTERAÇÃO ---

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
  }, [isReady, isSeeking]); // Adiciona 'isSeeking' como dependência

  return (
    <PlayerContext.Provider value={{
        currentSong,
        isPlaying,
        playSong,
        pauseSong,
        togglePlayPause,
        audioElement: audioRef.current,
        currentTime,
        duration,
        volume,
        seek,
        changeVolume,
        // --- ADIÇÃO ---
        isSeeking,
        setIsSeeking
        // --- FIM DA ADIÇÃO ---
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