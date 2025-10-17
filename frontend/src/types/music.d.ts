// frontend/src/types/music.d.ts

// Tipos básicos para tags contextuais
export type Mood = 'Alegre' | 'Triste' | 'Relaxante' | 'Foco' | 'Energético';
export type Genre = 'Pop' | 'Rock' | 'Lo-Fi' | 'Eletrônica' | 'Sertanejo';

// Estrutura de uma música (como ela está no nosso DB/Mock)
export interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: string; // Ex: "3:45"
  genre: Genre;
  mood: Mood;
  imageUrl: string; // Capa do álbum
  audioUrl: string; // O URL de áudio (simulado)
}

// Estrutura de uma Playlist
export interface Playlist {
  id: number;
  name: string;
  songCount: number;
  coverUrl: string; // Capa da playlist
  songs: Song[];
}

// O tipo mais importante: a recomendação justificada pela IA
export interface Recommendation extends Song {
    justification: string; // A explicação gerada pelo Gemini
}

// Estrutura para o histórico de audição (o que alimenta a IA)
export interface HistoryEntry {
    song: Song;
    listenedAt: Date;
}