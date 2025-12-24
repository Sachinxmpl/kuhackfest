/**
 * Authentication Middleware
 * Protects routes by verifying JWT tokens
 */
import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../lib/jwt.js';
import { UnauthorizedError } from '../lib/errors.js';


export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            throw new UnauthorizedError('No token provided');
        }   

        const decoded = verifyToken(token);

        req.user = decoded;

        next();
    } catch (error) {
        next(error);
    }
};
