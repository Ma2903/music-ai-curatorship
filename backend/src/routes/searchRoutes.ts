// backend/src/routes/searchRoutes.ts
import { Router, Request, Response } from 'express';
import { searchJamendoTracks } from '../services/jamendoService'; // <<< IMPORTA O NOVO SERVIÇO >>>

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const query = req.query.q as string;
  const limit = parseInt(req.query.limit as string, 10) || 20;

  if (!query) {
    return res.status(400).json({ error: 'Parâmetro de busca "q" é obrigatório.' });
  }

  try {
    // <<< CHAMA A FUNÇÃO DO JAMENDO >>>
    const results = await searchJamendoTracks(query, limit);
    console.log(`Busca por "${query}" no Jamendo retornou ${results.length} resultados.`); // Log

    res.json(results);

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido ao buscar';
    console.error("Erro na rota /api/search (Jamendo):", message); // Log de erro
    res.status(500).json({ error: message });
  }
});

export default router;