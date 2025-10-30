// backend/src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

// Opcional: Adicionar logging de queries em desenvolvimento
// export const prisma = new PrismaClient({
//   log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : [],
// });