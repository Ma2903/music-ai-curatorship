// backend/src/routes/index.ts
import { Router } from 'express';
import searchRoutes from './searchRoutes';
import authRoutes from './authRoutes';
import recommendationRoutes from './recommendationRoutes';
import historyRoutes from './historyRoutes';
import playlistRoutes from './playlistRoutes'; // <<< ADICIONE ESTA LINHA

const router = Router();

router.use('/auth', authRoutes);
router.use('/search', searchRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/history', historyRoutes);
router.use('/playlists', playlistRoutes); // <<< ADICIONE ESTA LINHA

router.get('/health', (req, res) => {
  res.json({ status: 'API is running!' });
});

export default router;