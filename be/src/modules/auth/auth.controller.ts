import type { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service.js';
import { sendSuccess } from '../../lib/response.js';
import type { SignupInput, LoginInput } from './auth.schema.js';

const authService = new AuthService();

export class AuthController {
    async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: SignupInput = req.body;
            const result = await authService.signup(data);
            sendSuccess(res, result, 'User registered successfully', 201);
        } catch (error) {
            next(error);
        }
    }

    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: LoginInput = req.body;
            const result = await authService.login(data);
            sendSuccess(res, result, 'Login successful', 200);
        } catch (error) {
            next(error);
        }
    }
}
