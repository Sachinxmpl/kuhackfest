import { prisma } from '../../lib/prisma.js';
import { NotFoundError, ForbiddenError } from '../../lib/errors.js';
import { messageStore } from '../../lib/message.store.js'; // Import store
import { appEvents } from '../../lib/events.js';

export class SessionsService {
    
    // ... (getSessionById and getUserSessions remain the same) ...
    async getSessionById(sessionId: string, userId: string) {
        const session = await prisma.session.findUnique({
            where: { id: sessionId },
            include: {
                beacon: true,
                learner: { include: { profile: true } },
                helper: { include: { profile: true } },
            },
        });
        if (!session) throw new NotFoundError('Session not found');
        if (session.learnerId !== userId && session.helperId !== userId) {
            throw new ForbiddenError('You are not part of this session');
        }
        return session;
    }

    async getUserSessions(userId: string) {
         // ... (existing logic) ...
         return prisma.session.findMany({
            where: { OR: [{ learnerId: userId }, { helperId: userId }] },
            include: {
                beacon: true,
                learner: { include: { profile: true } },
                helper: { include: { profile: true } },
                ratings: true,
            },
            orderBy: { startedAt: 'desc' },
        });
    }

    // --- CHANGED METHOD ---
    async getSessionMessages(sessionId: string, userId: string) {
        // 1. Verify access (security check still uses DB)
        await this.getSessionById(sessionId, userId);

        // 2. Return messages from RAM
        return messageStore.getMessages(sessionId);
    }

    async endSession(sessionId: string, userId: string) {
        const session = await this.getSessionById(sessionId, userId);
        if (session.status !== 'ACTIVE') throw new ForbiddenError('Session is not active');

        const result = await prisma.$transaction(async (tx) => {
            const updatedSession = await tx.session.update({
                where: { id: sessionId },
                data: { status: 'COMPLETED', endedAt: new Date() },
            });

            await tx.beacon.update({
                where: { id: session.beaconId },
                data: { status: 'CLOSED' },
            });

            return updatedSession;
        });

        appEvents.emit('session-ended', { sessionId });
        return result;
    }
}