// backend/src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/authService'; // Importa a função de verificação

// Estende a interface Request do Express para adicionar a propriedade userId
declare global {
    namespace Express {
        interface Request {
            user?: { userId: number }; // Adiciona a propriedade opcional user
        }
    }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Pega o token do cabeçalho Authorization (formato: "Bearer TOKEN")
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token de autenticação não fornecido ou mal formatado.' });
    }

    const token = authHeader.split(' ')[1]; // Extrai apenas o token

    try {
        const payload = verifyToken(token); // Verifica o token
        req.user = { userId: payload.userId }; // Anexa o userId à requisição
        next(); // Passa para a próxima rota/middleware
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro na autenticação';
        res.status(401).json({ error: 'Falha na autenticação: ' + message });
    }
};