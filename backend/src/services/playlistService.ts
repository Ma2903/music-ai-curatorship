// backend/src/services/playlistService.ts
import { prisma } from '../lib/prisma';

// Interface para os dados da música esperados do frontend
interface SongData {
  id: string; // jamendoSongId
  title: string;
  artist: string;
  album: string;
  duration: string;
  imageUrl?: string | null;
  audioUrl?: string | null;
}

/**
 * Cria uma nova playlist para um usuário com uma música inicial.
 */
export const createPlaylist = async (
  userId: number,
  name: string,
  initialSong: SongData // Usando a interface SongData
) => {
  console.log(`Criando playlist '${name}' para userId ${userId} com música ${initialSong.title}`);

  // Usa uma transação para garantir que a playlist E a música sejam criadas
  const newPlaylist = await prisma.$transaction(async (tx) => {
    // 1. Criar a Playlist
    const playlist = await tx.playlist.create({
      data: {
        name: name,
        userId: userId,
        // Usa a imagem da música inicial como capa
        coverUrl: initialSong.imageUrl || 'https://picsum.photos/id/1018/300/300', // Fallback
      },
    });

    // 2. Adicionar a música inicial à playlist
    await tx.playlistSong.create({
      data: {
        playlistId: playlist.id,
        jamendoSongId: initialSong.id,
        songTitle: initialSong.title,
        songArtist: initialSong.artist,
        songAlbum: initialSong.album,
        songDuration: initialSong.duration,
        songImageUrl: initialSong.imageUrl,
        songAudioUrl: initialSong.audioUrl,
      },
    });

    return playlist;
  });

  // Retorna a playlist criada (sem a lista de músicas, para ser leve)
  return {
    id: newPlaylist.id,
    name: newPlaylist.name,
    coverUrl: newPlaylist.coverUrl,
    songCount: 1, // Sabemos que tem 1 música
  };
};

/**
 * Busca todas as playlists de um usuário (para a Sidebar).
 */
export const getUserPlaylists = async (userId: number) => {
  const playlists = await prisma.playlist.findMany({
    where: { userId: userId },
    include: {
      _count: {
        select: { songs: true }, // Pega a contagem de músicas
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Mapeia para o formato esperado pelo frontend
  return playlists.map((p) => ({
    id: p.id,
    name: p.name,
    coverUrl: p.coverUrl,
    songCount: p._count.songs,
    songs: [], // Não envia as músicas para a sidebar
  }));
};

/**
 * Busca uma playlist específica por ID, incluindo suas músicas.
 * Garante que a playlist pertença ao usuário.
 */
export const getPlaylistById = async (userId: number, playlistId: number) => {
  const playlist = await prisma.playlist.findFirst({
    where: {
      id: playlistId,
      userId: userId, // <<< Verificação de segurança
    },
    include: {
      songs: {
        orderBy: { addedAt: 'asc' }, // Ordena as músicas
      },
    },
  });

  if (!playlist) {
    return null;
  }

  // Mapeia as PlaylistSong para o formato Song do frontend
  const songs = playlist.songs.map((ps) => ({
    id: ps.jamendoSongId,
    title: ps.songTitle,
    artist: ps.songArtist,
    album: ps.songAlbum,
    duration: ps.songDuration,
    imageUrl: ps.songImageUrl,
    audioUrl: ps.songAudioUrl,
    genre: null, // Não armazenamos isso (ainda)
    mood: null, // Não armazenamos isso (ainda)
  }));

  return {
    id: playlist.id,
    name: playlist.name,
    coverUrl: playlist.coverUrl,
    songCount: songs.length,
    songs: songs, // Retorna a lista completa de músicas
  };
};

/**
 * Adiciona uma música a uma playlist existente.
 * Verifica se o usuário é o dono da playlist.
 */
export const addSongToPlaylist = async (
  userId: number,
  playlistId: number,
  song: SongData
) => {
  // 1. Verifica se a playlist existe e pertence ao usuário
  const playlist = await prisma.playlist.findFirst({
    where: { id: playlistId, userId: userId },
  });

  if (!playlist) {
    throw new Error('Playlist não encontrada ou acesso negado.');
  }

  // 2. Verifica se a música já não está na playlist
  const existingSong = await prisma.playlistSong.findUnique({
    where: {
      playlistId_jamendoSongId: {
        playlistId: playlistId,
        jamendoSongId: song.id,
      },
    },
  });

  if (existingSong) {
    throw new Error('Esta música já está na playlist.');
  }

  // 3. Adiciona a música
  const newPlaylistSong = await prisma.playlistSong.create({
    data: {
      playlistId: playlistId,
      jamendoSongId: song.id,
      songTitle: song.title,
      songArtist: song.artist,
      songAlbum: song.album,
      songDuration: song.duration,
      songImageUrl: song.imageUrl,
      songAudioUrl: song.audioUrl,
    },
  });

  return newPlaylistSong;
};

/**
 * Remove uma música de uma playlist.
 * Verifica se o usuário é o dono da playlist.
 */
export const removeSongFromPlaylist = async (
  userId: number,
  playlistId: number,
  jamendoSongId: string
) => {
  // 1. Verifica se a playlist existe e pertence ao usuário
  const playlist = await prisma.playlist.findFirst({
    where: { id: playlistId, userId: userId },
  });

  if (!playlist) {
    throw new Error('Playlist não encontrada ou acesso negado.');
  }

  // 2. Remove a música
  const deleteResult = await prisma.playlistSong.deleteMany({
    where: {
      playlistId: playlistId,
      jamendoSongId: jamendoSongId,
      playlist: {
        userId: userId,
      },
    },
  });

  if (deleteResult.count === 0) {
    throw new Error('Música não encontrada na playlist.');
  }

  return { success: true, count: deleteResult.count };
};

/**
 * <<< NOVO: Deleta uma playlist inteira >>>
 * Verifica se o usuário é o dono.
 * O 'onDelete: Cascade' no schema irá remover as PlaylistSong.
 */
export const deletePlaylist = async (
  userId: number,
  playlistId: number
) => {
  // Deleta a playlist APENAS se o ID da playlist E o ID do usuário baterem
  const deleteResult = await prisma.playlist.deleteMany({
    where: {
      id: playlistId,
      userId: userId,
    },
  });

  if (deleteResult.count === 0) {
    throw new Error('Playlist não encontrada ou acesso negado.');
  }

  return { success: true };
};