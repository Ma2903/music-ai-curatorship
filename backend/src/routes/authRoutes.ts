// backend/src/routes/authRoutes.ts
import { Router, Request, Response } from 'express';
import { registerUser, loginUser } from '../services/authService';

const router = Router();

// Rota POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  // Validação básica de entrada
  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }
  if (password.length < 6) { // Exemplo de regra de senha mínima
      return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres.' });
  }

  try {
    const newUser = await registerUser(email, password, name);
    res.status(201).json({ message: 'Usuário registrado com sucesso!', user: newUser });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido ao registrar.';
    // Retorna 409 (Conflict) se o email já existe, senão 500
    res.status(message === 'Email já cadastrado.' ? 409 : 500).json({ error: message });
  }
});

// Rota POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  try {
    const { token, user } = await loginUser(email, password);
    res.status(200).json({ message: 'Login bem-sucedido!', token, user });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido ao fazer login.';
     // Retorna 401 (Unauthorized) para credenciais inválidas
    res.status(message === 'Email ou senha inválidos.' ? 401 : 500).json({ error: message });
  }
});

export default router;