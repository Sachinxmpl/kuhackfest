/**
 * Users Module - Controller Layer
 */
import type { Request, Response, NextFunction } from 'express';
import { UsersService } from './users.service.js';
import { sendSuccess } from '../../lib/response.js';
import type { UpdateProfileInput } from './users.schema.js';

const usersService = new UsersService();

export class UsersController {
    async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.userId;
            const user = await usersService.getMe(userId);
            sendSuccess(res, user);
        } catch (error) {
            next(error);
        }
    }

    async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.userId;
            const data: UpdateProfileInput = req.body;
            const profile = await usersService.updateProfile(userId, data);
            sendSuccess(res, profile, 'Profile updated successfully');
        } catch (error) {
            next(error);
        }
    }

    async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) throw new Error('id is required');
            const user = await usersService.getUserById(id);
            sendSuccess(res, user);
        } catch (error) {
            next(error);
        }
    }
}
