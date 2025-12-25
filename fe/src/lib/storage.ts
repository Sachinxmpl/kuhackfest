/**
 * Local Storage Manager for Frontend-Only Data
 * Handles data that exists ONLY in frontend (not sent to backend)
 */

// ============================================================================
// STORAGE KEYS
// ============================================================================

const STORAGE_KEYS = {
    FRONTEND_PROFILE_DATA: 'study_beacon_frontend_profile',
    USER_PREFERENCES: 'study_beacon_preferences',
} as const;

// ============================================================================
// TYPES
// ============================================================================

export interface FrontendProfileData {
    userId: string;
    studyLevel?: string;
    academicStream?: string;
    availability?: string;
    experienceLevel?: string;
}

export interface UserPreferences {
    theme?: 'light' | 'dark';
    notifications?: boolean;
    defaultBeaconType?: 'NORMAL' | 'URGENT';
}

// ============================================================================
// FRONTEND PROFILE DATA MANAGEMENT
// ============================================================================

export const frontendProfileStorage = {
    /**
     * Save frontend-only profile data for a user
     */
    save: (data: FrontendProfileData): void => {
        if (typeof window === 'undefined') return;

        try {
            localStorage.setItem(
                STORAGE_KEYS.FRONTEND_PROFILE_DATA,
                JSON.stringify(data)
            );
        } catch (error) {
            console.error('Failed to save frontend profile data:', error);
        }
    },

    /**
     * Get frontend-only profile data for current user
     */
    get: (userId: string): Partial<FrontendProfileData> | null => {
        if (typeof window === 'undefined') return null;

        try {
            const data = localStorage.getItem(STORAGE_KEYS.FRONTEND_PROFILE_DATA);
            if (!data) return null;

            const parsed: FrontendProfileData = JSON.parse(data);

            // Only return if it matches the current user
            if (parsed.userId === userId) {
                return parsed;
            }

            return null;
        } catch (error) {
            console.error('Failed to get frontend profile data:', error);
            return null;
        }
    },

    /**
     * Update specific fields in frontend profile data
     */
    update: (
        userId: string,
        updates: Partial<Omit<FrontendProfileData, 'userId'>>
    ): void => {
        if (typeof window === 'undefined') return;

        const existing = frontendProfileStorage.get(userId) || { userId };
        const updated = { ...existing, ...updates, userId };
        frontendProfileStorage.save(updated);
    },

    /**
     * Clear frontend profile data
     */
    clear: (): void => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(STORAGE_KEYS.FRONTEND_PROFILE_DATA);
    },
};

// ============================================================================
// USER PREFERENCES MANAGEMENT
// ============================================================================

export const preferencesStorage = {
    /**
     * Save user preferences
     */
    save: (preferences: UserPreferences): void => {
        if (typeof window === 'undefined') return;

        try {
            localStorage.setItem(
                STORAGE_KEYS.USER_PREFERENCES,
                JSON.stringify(preferences)
            );
        } catch (error) {
            console.error('Failed to save preferences:', error);
        }
    },

    /**
     * Get user preferences
     */
    get: (): UserPreferences => {
        if (typeof window === 'undefined') {
            return {
                theme: 'light',
                notifications: true,
                defaultBeaconType: 'NORMAL',
            };
        }

        try {
            const data = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
            if (!data) {
                return {
                    theme: 'light',
                    notifications: true,
                    defaultBeaconType: 'NORMAL',
                };
            }

            return JSON.parse(data);
        } catch (error) {
            console.error('Failed to get preferences:', error);
            return {
                theme: 'light',
                notifications: true,
                defaultBeaconType: 'NORMAL',
            };
        }
    },

    /**
     * Update specific preference
     */
    update: (updates: Partial<UserPreferences>): void => {
        const existing = preferencesStorage.get();
        const updated = { ...existing, ...updates };
        preferencesStorage.save(updated);
    },

    /**
     * Clear all preferences
     */
    clear: (): void => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(STORAGE_KEYS.USER_PREFERENCES);
    },
};

// ============================================================================
// CLEAR ALL STORAGE
// ============================================================================

export function clearAllLocalData(): void {
    frontendProfileStorage.clear();
    preferencesStorage.clear();
}
