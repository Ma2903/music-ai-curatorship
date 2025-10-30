// backend/src/routes/historyRoutes.ts
import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { prisma } from '../lib/prisma';

const router = Router();

// Rota POST /api/history (protegida)
router.post('/', authMiddleware, async (req: Request, res: Response) => {
    // req.user é garantido pelo authMiddleware nesta rota
    // Se não existisse, o middleware já teria retornado 401
    // Mas o tipo de req.user ainda é 'user?: { userId: number }'
    const userId = req.user?.userId;

    // <<< CORREÇÃO AQUI >>>
    // Adicionamos uma verificação explícita que o TypeScript entende.
    if (!userId) {
         return res.status(401).json({ error: 'Usuário não autenticado (ID não encontrado no token).' });
    }

    const { songId, title, artist, genre, mood } = req.body;

    if (!songId || typeof songId !== 'string') {
         return res.status(400).json({ error: 'ID da música (songId) é obrigatório e deve ser string.' });
    }
    if (!title || !artist) {
         return res.status(400).json({ error: 'ID, Título e Artista da música são obrigatórios.' });
    }

    try {
        // Agora, o TypeScript sabe que 'userId' é 100% um 'number'
        const historyEntry = await prisma.historyEntry.create({
            data: {
                userId: userId, // Agora é do tipo 'number', não 'number | undefined'
                jamendoSongId: songId,
                songTitle: title,
                songArtist: artist,
                songGenre: genre || null, // Garante que seja null se undefined
                songMood: mood || null,   // Garante que seja null se undefined
                listenedAt: new Date(),
            }
        });
        res.status(201).json(historyEntry);
    } catch (error) {
         const message = error instanceof Error ? error.message : 'Erro desconhecido ao salvar histórico.';
         console.error("Erro na rota POST /api/history:", message, error);
         res.status(500).json({ error: message });
    }
});

// Rota GET /api/history (protegida)
router.get('/', authMiddleware, async (req: Request, res: Response) => {
    const userId = req.user?.userId;

     if (!userId) { // Verificação de segurança
        return res.status(401).json({ error: 'Usuário não autenticado.' });
     }

     try {
         const history = await prisma.historyEntry.findMany({
             where: { userId: userId }, // 'userId' aqui é 'number'
             orderBy: { listenedAt: 'desc' },
             take: 50,
             // include: { song: true } // Relação removida, está correto
         });
         // history contém jamendoSongId, songTitle, songArtist etc.
         res.status(200).json(history);
     } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro desconhecido ao buscar histórico.';
        console.error("Erro na rota GET /api/history:", message);
        res.status(500).json({ error: message });
     }
 });


export default router;