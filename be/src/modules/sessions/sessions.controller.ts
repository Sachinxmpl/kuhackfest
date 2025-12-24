import type { Request, Response, NextFunction } from 'express';
import { SessionsService } from './sessions.service.js';
import { sendSuccess } from '../../lib/response.js';

const sessionsService = new SessionsService();

export class SessionsController {
    /**
     * GET /sessions/:id
     * Get session by ID
     */
    async getSessionById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) throw new Error('id is required');
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /sessions
     * Get all sessions for current user
     */
    async getUserSessions(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.userId;
            const sessions = await sessionsService.getUserSessions(userId);
            sendSuccess(res, sessions);
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /sessions/:id/end
     * End a session
     */
    async endSession(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) throw new Error('id is required');
            const userId = req.user!.userId;
            const session = await sessionsService.endSession(id, userId);
            sendSuccess(res, session, 'Session ended successfully');
        } catch (error) {
            next(error);
        }
    }


    async getSessionMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            if(!id) throw new Error('id is required')
            const userId = req.user!.userId;
            
            // This now returns the In-Memory array
            const messages = await sessionsService.getSessionMessages(id, userId);
            
            sendSuccess(res, messages);
        } catch (error) {
            next(error);
        }
    }
}
