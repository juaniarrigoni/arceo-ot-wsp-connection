import { PrismaClient } from '@prisma/client';

/**
 * Shared Prisma Client singleton.
 * All services import from here instead of creating their own instances.
 */
const prisma = new PrismaClient();

export default prisma;
