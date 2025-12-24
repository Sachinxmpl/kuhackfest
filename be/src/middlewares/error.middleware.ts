/**
 * Global Error Handler Middleware
 * Catches all errors and sends standardized error responses
 */
import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../lib/errors.js';
import { ZodError } from 'zod';
import { sendError } from '../lib/response.js';

const formatZodError = (error: ZodError): string => {
    const errors = error.errors.map((err) => {
        const path = err.path.join('.');
        return `${path}: ${err.message}`;
    });
    return errors.join(', ');
};


export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    // Log error for debugging
    console.error('Error:', err);

    if (err instanceof ZodError) {
        sendError(res, formatZodError(err), 400);
        return;
    }

    // Custom application errors
    if (err instanceof AppError) {
        sendError(res, err.message, err.statusCode);
        return;
    }

    // Prisma errors
    if (err.name === 'PrismaClientKnownRequestError') {
        sendError(res, 'Database error occurred', 400);
        return;
    }

    // Default to 500 server error
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    sendError(
        res,
        process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message,
        statusCode
    );
};
