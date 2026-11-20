import { PrismaClient } from '@prisma/client';

// Reuse one client across route calls in dev so hot-reload doesn't exhaust
// Neon's connection limit by creating a new client on every reload.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
