/**
 * Ratings Module - Service Layer
 */
import { prisma } from '../../lib/prisma.js';
import { NotFoundError, ForbiddenError, ConflictError } from '../../lib/errors.js';
import type { CreateRatingInput } from './ratings.schema.js';

const POINTS_PER_RATING = 10; 
const BONUS_POINTS_PER_STAR = 5; 

export class RatingsService {
    async createRating(fromUserId: string, data: CreateRatingInput) {
        const { sessionId, toUserId, score, comment } = data;

        const session = await prisma.session.findUnique({ where: { id: sessionId } });
        if (!session) throw new NotFoundError('Session not found');
        if (session.learnerId !== fromUserId && session.helperId !== fromUserId) {
            throw new ForbiddenError('You are not part of this session');
        }
        if (session.status !== 'COMPLETED') {
            throw new ForbiddenError('Can only rate completed sessions');
        }

        const expectedToUserId = session.learnerId === fromUserId ? session.helperId : session.learnerId;
        if (toUserId !== expectedToUserId) throw new ForbiddenError('Invalid rating recipient');

        const existingRating = await prisma.rating.findUnique({
            where: { sessionId_fromUserId: { sessionId, fromUserId } },
        });
        if (existingRating) throw new ConflictError('You have already rated this session');

        const result = await prisma.$transaction(async (tx) => {
            // 1. Create the Rating
            const rating = await tx.rating.create({
                data: { sessionId, fromUserId, toUserId, score, comment: comment as string },
            });

            // 2. Update Mentor Stats (Only if rating the helper)
            if (toUserId === session.helperId) {
                // Calculate points for this specific session
                const pointsEarned = POINTS_PER_RATING + (score * BONUS_POINTS_PER_STAR);

                // Fetch existing stats to calculate new average
                // We use upsert to handle the case where this is the mentor's FIRST session
                const existingStats = await tx.helperStats.findUnique({ 
                    where: { userId: toUserId } 
                });

                const currentHelpCount = existingStats?.helpCount || 0;
                const currentTotalPoints = existingStats?.totalPoints || 0;
                const currentAvg = existingStats?.avgRating || 0;

                // MATH LOGIC:
                // New Average = ((Old Avg * Old Count) + New Score) / (Old Count + 1)
                const newHelpCount = currentHelpCount + 1;
                const newTotalPoints = currentTotalPoints + pointsEarned;
                const newAvgRating = ((currentAvg * currentHelpCount) + score) / newHelpCount;

                await tx.helperStats.upsert({
                    where: { userId: toUserId },
                    update: {
                        helpCount: newHelpCount,
                        totalPoints: newTotalPoints,
                        avgRating: newAvgRating,
                    },
                    create: {
                        userId: toUserId,
                        helpCount: 1,
                        totalPoints: pointsEarned,
                        avgRating: score, // First rating is the average
                    }
                });
            }

            return rating;
        });

        return result;
    }

    async getUserRatings(userId: string) {
        return prisma.rating.findMany({
            where: { toUserId: userId },
            include: {
                fromUser: { include: { profile: true } },
                session: { include: { beacon: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
}