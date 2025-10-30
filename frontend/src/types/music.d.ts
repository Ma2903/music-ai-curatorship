// frontend/src/types/music.d.ts

// Tipos básicos para tags contextuais
// Mantendo os tipos que você definiu
export type Mood = 'Alegre' | 'Triste' | 'Relaxante' | 'Foco' | 'Energético';
// Expandindo Genre com base nos exemplos do frontend
export type Genre = 'Pop' | 'Rock' | 'Lo-Fi' | 'Eletrônica' | 'Sertanejo' | 'Rap' | 'Reggae' | 'Jazz';

// Estrutura de uma música
export interface Song {
  id: string; // Jamendo usa string
  title: string;
  artist: string;
  album: string;
  duration: string; // "m:ss"
  genre?: Genre | null; // Opcional
  mood?: Mood | null; // Opcional
  imageUrl?: string | null;
  audioUrl?: string | null; // <<< URL do stream COMPLETO do Jamendo >>>
  durationSeconds?: number; // Opcional: útil ter os segundos originais
}

// Estrutura de uma Playlist (usando ID numérico gerado pelo seu backend)
export interface Playlist {
  id: number;
  name: string;
  songCount: number;
  coverUrl: string; // Capa da playlist
  songs: Song[]; // Lista de músicas (agora com id string)
  // Campos opcionais que apareceram no PlaylistCard
  description?: string;
  imageUrl?: string; // Pode ser o mesmo que coverUrl
  duration?: string; // Duração total calculada
}

// O tipo mais importante: a recomendação justificada pela IA
export interface Recommendation extends Song {
    justification: string; // A explicação gerada pelo Gemini
}

// Estrutura para o histórico de audição (o que alimenta a IA)
export interface HistoryEntry {
    song: Song; // Usa a definição de Song (com id string)
    listenedAt: Date;
}