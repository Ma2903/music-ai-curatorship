// backend/src/routes/recommendationRoutes.ts
import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware'; // Importa o middleware
import { generateRecommendations } from '../services/recommendationService'; // Importa o serviço

const router = Router();

// Rota GET /api/recommendations (protegida)
router.get('/', authMiddleware, async (req: Request, res: Response) => {
    // O userId é anexado pelo authMiddleware
    const userId = req.user?.userId;

    if (!userId) {
        // Isso não deve acontecer se o middleware funcionar, mas é uma segurança extra
        return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    try {
        const recommendations = await generateRecommendations(userId);
        res.status(200).json(recommendations);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro desconhecido ao gerar recomendações.';
        console.error("Erro na rota /api/recommendations:", message);
        res.status(500).json({ error: message });
    }
});

export default router;