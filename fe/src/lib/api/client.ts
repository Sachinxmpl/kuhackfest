/**
 * Type-safe API Client for Study Beacon Backend
 * Base URL: http://localhost:3000/api
 */

import type {
    ApiResponse,
    AuthResponse,
    CurrentUserResponse,
    PublicUserResponse,
    UpdateProfileRequest,
    BeaconWithCreator,
    BeaconWithApplications,
    CreateBeaconRequest,
    UpdateBeaconRequest,
    BeaconQueryParams,
    BeaconApplicationWithHelper,
    ApplyToBeaconRequest,
    SessionWithDetails,
    SessionWithRatings,
    RatingWithDetails,
    CreateRatingRequest,
    SignupRequest,
    LoginRequest,
} from './types';

// ============================================================================
// CONFIGURATION
// ============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// ============================================================================
// ERROR CLASSES
// ============================================================================

export class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public response?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

// ============================================================================
// BASE FETCH WRAPPER
// ============================================================================

async function fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    // Get token from localStorage (client-side only)
    const token = localStorage.getItem('token')
    console.log("Token in client:", token);

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    // Add authorization header if token exists
    if (token) {
        headers['Authorization'] = token;
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers,
        });

        const data: ApiResponse<T> = await response.json();

        // Backend returns { success: true/false }
        if (!data.success) {
            throw new ApiError(
                data.error || 'Request failed',
                response.status,
                data
            );
        }

        return data.data;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        // Network or parsing errors
        throw new ApiError(
            error instanceof Error ? error.message : 'Unknown error',
            0
        );
    }
}

// ============================================================================
// AUTH API
// ============================================================================

export const authApi = {
    /**
     * Sign up a new user
     * POST /auth/signup
     */
    signup: async (data: SignupRequest): Promise<AuthResponse> => {
        return fetchApi<AuthResponse>('/auth/signup', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    /**
     * Log in an existing user
     * POST /auth/login
     */
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        return fetchApi<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    /**
     * Get current authenticated user
     * GET /auth/me
     */
    getCurrentUser: async (): Promise<CurrentUserResponse> => {
        return fetchApi<CurrentUserResponse>('/auth/me');
    },
};

// ============================================================================
// USERS API
// ============================================================================

export const usersApi = {
    /**
     * Get public profile of a user by ID
     * GET /users/:id
     */
    getUser: async (userId: string): Promise<PublicUserResponse> => {
        return fetchApi<PublicUserResponse>(`/users/${userId}`);
    },

    /**
     * Update current user's profile
     * PUT /users/profile
     */
    updateProfile: async (data: UpdateProfileRequest): Promise<CurrentUserResponse> => {
        return fetchApi<CurrentUserResponse>('/users/profile', {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },
};

// ============================================================================
// BEACONS API
// ============================================================================

export const beaconsApi = {
    /**
     * Get all beacons (with optional filters)
     * GET /beacons
     */
    getBeacons: async (params?: BeaconQueryParams): Promise<BeaconWithCreator[]> => {
        const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
        return fetchApi<BeaconWithCreator[]>(`/beacons${query}`);
    },

    /**
     * Get a single beacon by ID with applications
     * GET /beacons/:id
     */
    getBeacon: async (beaconId: string): Promise<BeaconWithApplications> => {
        return fetchApi<BeaconWithApplications>(`/beacons/${beaconId}`);
    },

    /**
     * Create a new beacon
     * POST /beacons
     */
    createBeacon: async (data: CreateBeaconRequest): Promise<BeaconWithCreator> => {
        return fetchApi<BeaconWithCreator>('/beacons', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    /**
     * Update a beacon (only creator can update)
     * PUT /beacons/:id
     */
    updateBeacon: async (
        beaconId: string,
        data: UpdateBeaconRequest
    ): Promise<BeaconWithCreator> => {
        return fetchApi<BeaconWithCreator>(`/beacons/${beaconId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    /**
     * Delete a beacon (only creator can delete)
     * DELETE /beacons/:id
     */
    deleteBeacon: async (beaconId: string): Promise<{ message: string }> => {
        return fetchApi<{ message: string }>(`/beacons/${beaconId}`, {
            method: 'DELETE',
        });
    },

    /**
     * Apply to help with a beacon
     * POST /beacons/:id/apply
     */
    applyToBeacon: async (
        beaconId: string,
        data?: ApplyToBeaconRequest
    ): Promise<BeaconApplicationWithHelper> => {
        return fetchApi<BeaconApplicationWithHelper>(`/beacons/${beaconId}/apply`, {
            method: 'POST',
            body: JSON.stringify(data || {}),
        });
    },

    /**
     * Select a helper for a beacon (only creator can select)
     * POST /beacons/:id/select/:helperId
     */
    selectHelper: async (
        beaconId: string,
        helperId: string
    ): Promise<SessionWithDetails> => {
        return fetchApi<SessionWithDetails>(`/beacons/${beaconId}/select/${helperId}`, {
            method: 'POST',
        });
    },
};

// ============================================================================
// SESSIONS API
// ============================================================================

export const sessionsApi = {
    /**
     * Get all sessions for current user (as learner or helper)
     * GET /sessions
     */
    getSessions: async (): Promise<SessionWithDetails[]> => {
        return fetchApi<SessionWithDetails[]>('/sessions');
    },

    /**
     * Get a single session by ID
     * GET /sessions/:id
     */
    getSession: async (sessionId: string): Promise<SessionWithRatings> => {
        return fetchApi<SessionWithRatings>(`/sessions/${sessionId}`);
    },

    /**
     * End a session (marks as COMPLETED)
     * POST /sessions/:id/end
     */
    endSession: async (sessionId: string): Promise<SessionWithDetails> => {
        return fetchApi<SessionWithDetails>(`/sessions/${sessionId}/end`, {
            method: 'POST',
        });
    },

    /**
     * Cancel a session (marks as CANCELLED)
     * POST /sessions/:id/cancel
     */
    cancelSession: async (sessionId: string): Promise<SessionWithDetails> => {
        return fetchApi<SessionWithDetails>(`/sessions/${sessionId}/cancel`, {
            method: 'POST',
        });
    },
};

// ============================================================================
// RATINGS API
// ============================================================================

export const ratingsApi = {
    /**
     * Create a rating for a completed session
     * POST /ratings
     */
    createRating: async (data: CreateRatingRequest): Promise<RatingWithDetails> => {
        return fetchApi<RatingWithDetails>('/ratings', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    /**
     * Get ratings received by a user
     * GET /ratings/received
     */
    getReceivedRatings: async (): Promise<RatingWithDetails[]> => {
        return fetchApi<RatingWithDetails[]>('/ratings/received');
    },

    /**
     * Get ratings given by current user
     * GET /ratings/given
     */
    getGivenRatings: async (): Promise<RatingWithDetails[]> => {
        return fetchApi<RatingWithDetails[]>('/ratings/given');
    },
};

// ============================================================================
// TOKEN MANAGEMENT
// ============================================================================

export const tokenManager = {
    /**
     * Save auth token to localStorage
     */
    saveToken: (token: string): void => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('token', token);
        }
    },

    /**
     * Get auth token from localStorage
     */
    getToken: (): string | null => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token');
        }
        return null;
    },

    /**
     * Remove auth token from localStorage
     */
    removeToken: (): void => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
        }
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated: (): boolean => {
        return tokenManager.getToken() !== null;
    },
};

// ============================================================================
// EXPORT ALL
// ============================================================================

export const api = {
    auth: authApi,
    users: usersApi,
    beacons: beaconsApi,
    sessions: sessionsApi,
    ratings: ratingsApi,
};

export default api;
