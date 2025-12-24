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
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedError('No token provided');
        }
        console.log("middlewareeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")

        const token = authHeader.substring(7);
        const decoded = verifyToken(token);

        req.user = decoded;
        console.log("________________________")
        console.log(req.user)

        next();
    } catch (error) {
        next(error);
    }
};
