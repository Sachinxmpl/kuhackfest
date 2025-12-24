/**
 * Ratings Module - Controller Layer
 */
import type { Request, Response, NextFunction } from 'express';
import { RatingsService } from './ratings.service.js';
import { sendSuccess } from '../../lib/response.js';
import type { CreateRatingInput } from './ratings.schema.js';

const ratingsService = new RatingsService();

export class RatingsController {
    /**
     * POST /ratings
     * Create a rating
     */
    async createRating(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const fromUserId = req.user!.userId;
            const data: CreateRatingInput = req.body;
            const rating = await ratingsService.createRating(fromUserId, data);
            sendSuccess(res, rating, 'Rating submitted successfully', 201);
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /ratings/user/:userId
     * Get ratings for a user
     */
    async getUserRatings(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId } = req.params;
            if (!userId) throw new Error('userId is required');
            const ratings = await ratingsService.getUserRatings(userId);
            sendSuccess(res, ratings);
        } catch (error) {
            next(error);
        }
    }
}
