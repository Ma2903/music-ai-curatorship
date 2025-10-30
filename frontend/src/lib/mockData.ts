// frontend/src/lib/mockData.ts
import { Song, Playlist, Recommendation } from '@/types/music';

// --- Músicas de Exemplo ---
export const mockSongs: Song[] = [
    {
        id: "101", // <<< MUDANÇA
        title: "Sunset Drive",
        artist: "Aetherius",
        album: "Neon Dreams",
        duration: "3:45",
        genre: 'Eletrônica',
        mood: 'Relaxante',
        imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
        audioUrl: "/audio/track1.mp3"
    },
    {
        id: "102", // <<< MUDANÇA
        title: "City Lights",
        artist: "The Roadies",
        album: "Urban Flow",
        duration: "4:12",
        genre: 'Rock',
        mood: 'Energético',
        imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
        audioUrl: "/audio/track2.mp3"
    },
    {
        id: "103", // <<< MUDANÇA
        title: "Quiet Morning",
        artist: "Lo-Fi Panda",
        album: "Study Beats V.2",
        duration: "2:58",
        genre: 'Lo-Fi',
        mood: 'Foco',
        imageUrl: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300&h=300&fit=crop",
        audioUrl: "/audio/track3.mp3"
    },
];

// --- Playlists de Exemplo ---
export const mockPlaylists: Playlist[] = [
    {
        id: 201,
        name: "Academia Turbo",
        songCount: 45,
        coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
        songs: mockSongs.slice(1, 2)
    },
    {
        id: 202,
        name: "Chill Zone",
        songCount: 88,
        coverUrl: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300&h=300&fit=crop",
        songs: mockSongs.slice(0, 1)
    },
];

// --- Recomendação de Exemplo (O Retorno da IA) ---
export const mockRecommendation: Recommendation = {
    id: "104", // <<< MUDANÇA
    title: "Echoes in the Rain",
    artist: "Silent Observer",
    album: "Ambient",
    duration: "5:01",
    genre: 'Eletrônica',
    mood: 'Triste',
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
    audioUrl: "/audio/track4.mp3",
    justification: "A IA do Gemini notou que seu histórico tem faixas de 'Relaxante' e 'Eletrônica'. Esta música mantém o ritmo calmo, mas adiciona uma camada melancólica para noites chuvosas."
};