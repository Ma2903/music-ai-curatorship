// backend/src/services/authService.ts
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma'; // Importa a instância do Prisma
import { User } from '@prisma/client'; // Importa o tipo User gerado pelo Prisma

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET não está definido no arquivo .env');
}

const SALT_ROUNDS = 10; // Custo do hashing da senha

/**
 * Registra um novo usuário.
 * @param email Email do usuário.
 * @param password Senha em texto plano.
 * @param name Nome opcional do usuário.
 * @returns O usuário criado (sem a senha).
 * @throws Error se o email já existir ou se houver erro no hashing/criação.
 */
export const registerUser = async (email: string, password: string, name?: string): Promise<Omit<User, 'password'>> => {
  // Verifica se o email já existe
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('Email já cadastrado.');
  }

  // Gera o hash da senha
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // Cria o usuário no banco de dados
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: name || null, // Garante que seja null se não fornecido
    },
  });

  // Remove a senha antes de retornar
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

/**
 * Autentica um usuário e gera um token JWT.
 * @param email Email do usuário.
 * @param password Senha em texto plano.
 * @returns Um objeto contendo o token JWT e os dados do usuário (sem senha).
 * @throws Error se o email não for encontrado ou a senha estiver incorreta.
 */
export const loginUser = async (email: string, password: string): Promise<{ token: string; user: Omit<User, 'password'> }> => {
  // Encontra o usuário pelo email
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Email ou senha inválidos.'); // Mensagem genérica por segurança
  }

  // Compara a senha fornecida com o hash armazenado
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Email ou senha inválidos.'); // Mensagem genérica
  }

  // Gera o token JWT contendo o ID do usuário
  // Definir expiração (ex: 1 dia)
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1d' });

  // Remove a senha antes de retornar os dados do usuário
  const { password: _, ...userWithoutPassword } = user;

  return { token, user: userWithoutPassword };
};

/**
 * Verifica um token JWT.
 * @param token O token JWT a ser verificado.
 * @returns O payload decodificado (contendo userId) se o token for válido.
 * @throws Error se o token for inválido ou expirado.
 */
export const verifyToken = (token: string): { userId: number } => {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number; iat: number; exp: number };
    return { userId: payload.userId };
  } catch (error) {
    console.error("Erro na verificação do token:", error);
    throw new Error('Token inválido ou expirado.');
  }
};