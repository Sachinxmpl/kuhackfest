/**
 * React Hooks for API Integration
 * Provides easy-to-use hooks for common API operations
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import api, { tokenManager, ApiError } from './client';
import type {
    AuthResponse,
    CurrentUserResponse,
    BeaconWithCreator,
    BeaconWithApplications,
    SessionWithDetails,
    SessionWithRatings,
    CreateBeaconRequest,
    SignupRequest,
    LoginRequest,
    UpdateProfileRequest,
    BeaconQueryParams,
} from './types';

// ============================================================================
// AUTH HOOKS
// ============================================================================

export function useAuth() {
    const [user, setUser] = useState<CurrentUserResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load current user on mount
    useEffect(() => {
        const loadUser = async () => {
            if (!tokenManager.isAuthenticated()) {
                setLoading(false);
                return;
            }

            try {
                const currentUser = await api.auth.getCurrentUser();
                setUser(currentUser);
            } catch (err) {
                setError(err instanceof ApiError ? err.message : 'Failed to load user');
                tokenManager.removeToken();
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const signup = async (data: SignupRequest): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.auth.signup(data);
            tokenManager.saveToken(response.token);
            setUser(response.user);
        } catch (err) {
            const message = err instanceof ApiError ? err.message : 'Signup failed';
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    };

    const login = async (data: LoginRequest): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.auth.login(data);
            tokenManager.saveToken(response.token);
            setUser(response.user);
        } catch (err) {
            const message = err instanceof ApiError ? err.message : 'Login failed';
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    };

    const logout = useCallback(() => {
        tokenManager.removeToken();
        setUser(null);
    }, []);

    const updateProfile = async (data: UpdateProfileRequest): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            const updated = await api.users.updateProfile(data);
            setUser(updated);
        } catch (err) {
            const message = err instanceof ApiError ? err.message : 'Update failed';
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        loading,
        error,
        isAuthenticated: !!user,
        signup,
        login,
        logout,
        updateProfile,
    };
}

// ============================================================================
// BEACONS HOOKS
// ============================================================================

export function useBeacons(params?: BeaconQueryParams) {
    const [beacons, setBeacons] = useState<BeaconWithCreator[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadBeacons = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.beacons.getBeacons(params);
            setBeacons(data);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Failed to load beacons');
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        loadBeacons();
    }, [loadBeacons]);

    const createBeacon = async (data: CreateBeaconRequest): Promise<BeaconWithCreator> => {
        try {
            const beacon = await api.beacons.createBeacon(data);
            setBeacons((prev) => [beacon, ...prev]);
            return beacon;
        } catch (err) {
            const message = err instanceof ApiError ? err.message : 'Failed to create beacon';
            throw new Error(message);
        }
    };

    const deleteBeacon = async (beaconId: string): Promise<void> => {
        try {
            await api.beacons.deleteBeacon(beaconId);
            setBeacons((prev) => prev.filter((b) => b.id !== beaconId));
        } catch (err) {
            const message = err instanceof ApiError ? err.message : 'Failed to delete beacon';
            throw new Error(message);
        }
    };

    return {
        beacons,
        loading,
        error,
        refresh: loadBeacons,
        createBeacon,
        deleteBeacon,
    };
}

export function useBeacon(beaconId: string | null) {
    const [beacon, setBeacon] = useState<BeaconWithApplications | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadBeacon = useCallback(async () => {
        if (!beaconId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await api.beacons.getBeacon(beaconId);
            setBeacon(data);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Failed to load beacon');
        } finally {
            setLoading(false);
        }
    }, [beaconId]);

    useEffect(() => {
        loadBeacon();
    }, [loadBeacon]);

    const applyToBeacon = async (message?: string): Promise<void> => {
        if (!beaconId) throw new Error('No beacon ID');

        try {
            await api.beacons.applyToBeacon(beaconId, { message });
            await loadBeacon(); // Reload to get updated applications
        } catch (err) {
            const errorMessage = err instanceof ApiError ? err.message : 'Failed to apply';
            throw new Error(errorMessage);
        }
    };

    const selectHelper = async (helperId: string): Promise<SessionWithDetails> => {
        if (!beaconId) throw new Error('No beacon ID');

        try {
            const session = await api.beacons.selectHelper(beaconId, helperId);
            await loadBeacon(); // Reload to get updated status
            return session;
        } catch (err) {
            const message = err instanceof ApiError ? err.message : 'Failed to select helper';
            throw new Error(message);
        }
    };

    return {
        beacon,
        loading,
        error,
        refresh: loadBeacon,
        applyToBeacon,
        selectHelper,
    };
}

// ============================================================================
// SESSIONS HOOKS
// ============================================================================

export function useSessions() {
    const [sessions, setSessions] = useState<SessionWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadSessions = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.sessions.getSessions();
            setSessions(data);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Failed to load sessions');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadSessions();
    }, [loadSessions]);

    return {
        sessions,
        loading,
        error,
        refresh: loadSessions,
    };
}

export function useSession(sessionId: string | null) {
    const [session, setSession] = useState<SessionWithRatings | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadSession = useCallback(async () => {
        if (!sessionId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await api.sessions.getSession(sessionId);
            setSession(data);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Failed to load session');
        } finally {
            setLoading(false);
        }
    }, [sessionId]);

    useEffect(() => {
        loadSession();
    }, [loadSession]);

    const endSession = async (): Promise<void> => {
        if (!sessionId) throw new Error('No session ID');

        try {
            await api.sessions.endSession(sessionId);
            await loadSession();
        } catch (err) {
            const message = err instanceof ApiError ? err.message : 'Failed to end session';
            throw new Error(message);
        }
    };

    const cancelSession = async (): Promise<void> => {
        if (!sessionId) throw new Error('No session ID');

        try {
            await api.sessions.cancelSession(sessionId);
            await loadSession();
        } catch (err) {
            const message = err instanceof ApiError ? err.message : 'Failed to cancel session';
            throw new Error(message);
        }
    };

    return {
        session,
        loading,
        error,
        refresh: loadSession,
        endSession,
        cancelSession,
    };
}

// ============================================================================
// GENERIC DATA FETCHING HOOK
// ============================================================================

export function useApiQuery<T>(
    queryFn: () => Promise<T>,
    deps: React.DependencyList = []
) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const execute = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await queryFn();
            setData(result);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Request failed');
        } finally {
            setLoading(false);
        }
    }, deps);

    useEffect(() => {
        execute();
    }, [execute]);

    return {
        data,
        loading,
        error,
        refetch: execute,
    };
}
