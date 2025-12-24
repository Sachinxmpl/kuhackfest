/**
 * Prisma Client singleton instance
 * Ensures only one Prisma Client instance exists across the application
 */
import { PrismaClient } from '../generated/prisma/client.js';

import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/mydb',
});

export const prisma = new PrismaClient({ adapter });