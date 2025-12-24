import jwt from 'jsonwebtoken';
import { UnauthorizedError } from './errors.js';

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface JWTPayload {
    userId: string;
    email: string;
}


export const generateToken = (payload: JWTPayload): string => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    } as jwt.SignOptions);
};

export const verifyToken = (token: string): JWTPayload => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
        return decoded;
    } catch (error) {
        throw new UnauthorizedError('Invalid or expired token');
    }
}