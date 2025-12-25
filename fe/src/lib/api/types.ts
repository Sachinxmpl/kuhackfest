/**
 * Backend API Types
 * These types EXACTLY match the backend Prisma schema and API responses
 * DO NOT modify to match frontend needs - frontend must adapt to these types
 */

// ============================================================================
// ENUMS (Must match backend exactly)
// ============================================================================

export enum BeaconType {
    NORMAL = 'NORMAL',
    URGENT = 'URGENT',
}

export enum BeaconStatus {
    OPEN = 'OPEN',
    IN_SESSION = 'IN_SESSION',
    CLOSED = 'CLOSED',
}

export enum SessionStatus {
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

// ============================================================================
// DATABASE MODELS (Server responses)
// ============================================================================

export interface User {
    id: string;
    email: string;
    createdAt: string;
}

export interface Profile {
    id: string;
    userId: string;
    name: string;
    bio: string | null;
    interests: string[];
    skills: string[];
}

export interface HelperStats {
    id: string;
    userId: string;
    helpCount: number;
    totalPoints: number;
    avgRating: number;
}

export interface Beacon {
    id: string;
    title: string;
    description: string;
    type: BeaconType;
    status: BeaconStatus;
    createdAt: string;
    expiresAt: string | null;
    creatorId: string;
}

export interface BeaconWithCreator extends Beacon {
    creator: {
        id: string;
        email: string;
        profile: Profile;
    };
}

export interface BeaconWithApplications extends BeaconWithCreator {
    applications: BeaconApplication[];
}

export interface BeaconApplication {
    id: string;
    beaconId: string;
    helperId: string;
    appliedAt: string;
    message: string | null;
}

export interface BeaconApplicationWithHelper extends BeaconApplication {
    helper: {
        id: string;
        profile: Profile;
        helperStats: HelperStats;
    };
}

export interface Session {
    id: string;
    beaconId: string;
    learnerId: string;
    helperId: string;
    status: SessionStatus;
    startedAt: string;
    endedAt: string | null;
}

export interface SessionWithDetails extends Session {
    beacon: Beacon;
    learner: {
        id: string;
        profile: Profile;
    };
    helper: {
        id: string;
        profile: Profile;
    };
}

export interface SessionWithRatings extends SessionWithDetails {
    ratings: Rating[];
}

export interface Rating {
    id: string;
    sessionId: string;
    fromUserId: string;
    toUserId: string;
    score: number;
    comment: string | null;
    createdAt: string;
}

export interface RatingWithDetails extends Rating {
    session: {
        id: string;
        beacon: {
            title: string;
        };
    };
    fromUser: {
        id: string;
        profile: Profile;
    };
}

// ============================================================================
// API REQUEST PAYLOADS (What to send to backend)
// ============================================================================

export interface SignupRequest {
    name: string;
    email: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface UpdateProfileRequest {
    name?: string;
    bio?: string;
    interests?: string[];
    skills?: string[];
}

export interface CreateBeaconRequest {
    title: string;
    description: string;
    type: BeaconType;
    expiresInMinutes?: number; // Only for URGENT beacons
}

export interface UpdateBeaconRequest {
    title?: string;
    description?: string;
}

export interface ApplyToBeaconRequest {
    message?: string;
}

export interface CreateRatingRequest {
    sessionId: string;
    toUserId: string;
    score: number; // 1-5
    comment?: string;
}

// ============================================================================
// API RESPONSE WRAPPERS
// ============================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ApiSuccessResponse<T = any> {
    success: true;
    data: T;
    message?: string;
}

export interface ApiErrorResponse {
    success: false;
    error: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

// ============================================================================
// AUTH RESPONSES
// ============================================================================

export interface AuthResponse {
    user: {
        id: string;
        email: string;
        profile: Profile;
    };
    token: string;
}

export interface CurrentUserResponse {
    id: string;
    email: string;
    profile: Profile;
    helperStats?: HelperStats;
}

export interface PublicUserResponse {
    id: string;
    profile: Profile;
    helperStats: HelperStats;
}

// ============================================================================
// QUERY PARAMETERS
// ============================================================================

export interface BeaconQueryParams {
    status?: BeaconStatus;
    type?: BeaconType;
    creatorId?: string;
}

// ============================================================================
// SOCKET.IO TYPES
// ============================================================================

export interface ChatMessage {
    id: string;
    sessionId: string;
    senderId: string;
    content: string;
    createdAt: Date;
    sender: {
        name: string;
        id: string;
    };
}

export interface SocketAuthPayload {
    token: string;
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

export function isApiError(response: ApiResponse): response is ApiErrorResponse {
    return response.success === false;
}

export function isApiSuccess<T>(
    response: ApiResponse<T>
): response is ApiSuccessResponse<T> {
    return response.success === true;
}

// ============================================================================
// FRONTEND-ONLY TYPES (Do NOT send to backend)
// ============================================================================

/**
 * These fields exist ONLY in the frontend and should NEVER be sent to the backend
 * They are kept separate to avoid accidentally including them in API requests
 */
export interface FrontendOnlyProfileFields {
    studyLevel?: string; // e.g., "Undergraduate", "Graduate"
    academicStream?: string; // e.g., "Computer Science", "Mathematics"
    availability?: string; // e.g., "Weekday evenings"
    experienceLevel?: string; // e.g., "Beginner", "Intermediate", "Advanced"
}

/**
 * Extended profile for frontend display only
 * Combines backend Profile with frontend-only fields
 */
export interface ExtendedProfile extends Profile, FrontendOnlyProfileFields { }
