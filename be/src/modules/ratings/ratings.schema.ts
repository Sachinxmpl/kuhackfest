/**
 * Ratings Module - Validation Schemas
 */
import { z } from 'zod';

export const createRatingSchema = z.object({
    body: z.object({
        sessionId: z.string().uuid(),
        toUserId: z.string().uuid(),
        score: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
        comment: z.string().max(500).optional(),
    }),
});

export type CreateRatingInput = z.infer<typeof createRatingSchema>['body'];
