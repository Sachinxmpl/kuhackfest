/**
 * Study Beacon API - Main Export
 * 
 * Import from this file to access all API functionality:
 * 
 * import { api, useAuth, useBeacons, tokenManager, socketManager } from '@/lib/api';
 */

// API Client
export { default as api, tokenManager, ApiError } from './client';
export type { ApiResponse, ApiSuccessResponse, ApiErrorResponse } from './types';

// React Hooks
export {
    useAuth,
    useBeacons,
    useBeacon,
    useSessions,
    useSession,
    useApiQuery,
} from './hooks';

// Socket.IO
export { default as socketManager } from './socket';

// Types
export * from './types';

// Re-export specific APIs for convenience
export { authApi, usersApi, beaconsApi, sessionsApi, ratingsApi } from './client';
