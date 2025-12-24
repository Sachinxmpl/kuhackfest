/**
 * Ratings Module - Routes
 */
import { Router } from 'express';
import { RatingsController } from './ratings.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createRatingSchema } from './ratings.schema.js';

const router = Router();
const ratingsController = new RatingsController();

// All routes require authentication
router.use(authenticate);

/**
 * @route   POST /ratings
 * @desc    Create a rating for a session
 * @access  Private
 */
router.post(
    '/',
    validate(createRatingSchema),
    ratingsController.createRating.bind(ratingsController)
);

/**
 * @route   GET /ratings/user/:userId
 * @desc    Get all ratings for a user
 * @access  Private
 */
router.get('/user/:userId', ratingsController.getUserRatings.bind(ratingsController));

export default router;
