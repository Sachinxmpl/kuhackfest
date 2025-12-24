/**
 * Users Module - Routes
 */
import { Router } from 'express';
import { UsersController } from './users.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { updateProfileSchema } from './users.schema.js';

const router = Router();
const usersController = new UsersController();

router.use(authenticate);

router.get('/me', usersController.getMe.bind(usersController));

router.patch(
    '/profile',
    validate(updateProfileSchema),
    usersController.updateProfile.bind(usersController)
);

router.get('/:id', usersController.getUserById.bind(usersController));

export default router;
