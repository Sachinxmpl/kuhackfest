import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { signupSchema, loginSchema } from './auth.schema.js';

const router = Router();
const authController = new AuthController();


router.post(
    '/signup',
    validate(signupSchema),
    authController.signup.bind(authController)
);

router.post(
    '/login',
    validate(loginSchema),
    authController.login.bind(authController)
);

export default router;
