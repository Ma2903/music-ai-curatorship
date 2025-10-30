// backend/src/routes/playlistRoutes.ts
import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addSongToPlaylist,
  removeSongFromPlaylist,
  deletePlaylist, // <<< IMPORTAR
} from '../services/playlistService';

const router = Router();

// --- POST /api/playlists ---
// (Código existente... sem mudança)
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({ error: 'Usuário não autenticado.' });
  }

  const { name, initialSong } = req.body;

  if (!name || !initialSong || !initialSong.id) {
    return res.status(400).json({
      error: 'Nome da playlist e uma música inicial (com ID) são obrigatórios.',
    });
  }

  try {
    const newPlaylist = await createPlaylist(userId, name, initialSong);
    res.status(201).json(newPlaylist);
  } catch (error) {
    console.error('Erro ao criar playlist:', error);
    const message =
      error instanceof Error ? error.message : 'Erro desconhecido.';
    res.status(500).json({ error: message });
  }
});

// --- GET /api/playlists ---
// (Código existente... sem mudança)
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({ error: 'Usuário não autenticado.' });
  }

  try {
    const playlists = await getUserPlaylists(userId);
    res.status(200).json(playlists);
  } catch (error) {
    console.error('Erro ao buscar playlists:', error);
    const message =
      error instanceof Error ? error.message : 'Erro desconhecido.';
    res.status(500).json({ error: message });
  }
});

// --- GET /api/playlists/:id ---
// (Código existente... sem mudança)
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({ error: 'Usuário não autenticado.' });
  }

  const playlistId = parseInt(req.params.id, 10);
  if (isNaN(playlistId)) {
    return res.status(400).json({ error: 'ID de playlist inválido.' });
  }

  try {
    const playlist = await getPlaylistById(userId, playlistId);
    if (!playlist) {
      return res
        .status(404)
        .json({ error: 'Playlist não encontrada ou acesso negado.' });
    }
    res.status(200).json(playlist);
  } catch (error) {
    console.error(`Erro ao buscar playlist ${playlistId}:`, error);
    const message =
      error instanceof Error ? error.message : 'Erro desconhecido.';
    res.status(500).json({ error: message });
  }
});

// --- POST /api/playlists/:id/songs ---
// (Código existente... sem mudança)
router.post('/:id/songs', authMiddleware, async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({ error: 'Usuário não autenticado.' });
  }

  const playlistId = parseInt(req.params.id, 10);
  const songData = req.body; 

  if (isNaN(playlistId) || !songData || !songData.id) {
    return res.status(400).json({ error: 'ID da playlist e dados da música são obrigatórios.' });
  }

  try {
    const newSong = await addSongToPlaylist(userId, playlistId, songData);
    res.status(201).json(newSong);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido.';
    console.error(`Erro ao adicionar música à playlist ${playlistId}:`, error);
    res.status(message.includes('já está na playlist') ? 409 : 500).json({ error: message });
  }
});

// --- DELETE /api/playlists/:id/songs/:jamendoSongId ---
// (Código existente... sem mudança)
router.delete('/:id/songs/:jamendoSongId', authMiddleware, async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({ error: 'Usuário não autenticado.' });
  }

  const playlistId = parseInt(req.params.id, 10);
  const { jamendoSongId } = req.params;

  if (isNaN(playlistId) || !jamendoSongId) {
    return res.status(400).json({ error: 'ID da playlist e ID da música são obrigatórios.' });
  }

  try {
    await removeSongFromPlaylist(userId, playlistId, jamendoSongId);
    res.status(204).send(); // 204 No Content (sucesso, sem corpo)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido.';
    console.error(`Erro ao remover música ${jamendoSongId} da playlist ${playlistId}:`, error);
    res.status(message.includes('não encontrada') ? 404 : 500).json({ error: message });
  }
});


// --- <<< NOVO: DELETE /api/playlists/:id >>> ---
// Deletar uma playlist inteira
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({ error: 'Usuário não autenticado.' });
  }

  const playlistId = parseInt(req.params.id, 10);
  if (isNaN(playlistId)) {
    return res.status(400).json({ error: 'ID de playlist inválido.' });
  }

  try {
    await deletePlaylist(userId, playlistId);
    res.status(204).send(); // Sucesso
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido.';
    console.error(`Erro ao deletar playlist ${playlistId}:`, error);
    res.status(message.includes('não encontrada') ? 404 : 500).json({ error: message });
  }
});


export default router;