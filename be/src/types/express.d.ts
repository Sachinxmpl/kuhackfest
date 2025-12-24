/**
 * Extended Express Request types
 * Adds custom properties to Express Request interface
 */
import { JWTPayload } from '../lib/jwt.js';

declare global {
    namespace Express {
        interface Request {
            user?: JWTPayload;
        }
    }
}
export { };
