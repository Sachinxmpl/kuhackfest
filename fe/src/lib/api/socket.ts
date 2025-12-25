/**
 * Socket.IO Client for Real-time Chat
 * Connects to backend Socket.IO server for session chat
 */

import { io, Socket } from 'socket.io-client';
import type { ChatMessage, SocketAuthPayload } from './types';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000';

// ============================================================================
// SOCKET EVENT TYPES
// ============================================================================

export interface ServerToClientEvents {
    'new-message': (message: ChatMessage) => void;
    'user-joined': (data: { sessionId: string; userId: string; userName: string }) => void;
    'user-left': (data: { sessionId: string; userId: string; userName: string }) => void;
    error: (error: { message: string }) => void;
}

export interface ClientToServerEvents {
    'join-session': (sessionId: string) => void;
    'send-message': (data: { sessionId: string; message: string }) => void;
    'leave-session': (sessionId: string) => void;
}

// ============================================================================
// SOCKET MANAGER CLASS
// ============================================================================

class SocketManager {
    private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;
    private token: string | null = null;

    /**
     * Initialize socket connection with auth token
     */
    connect(token: string): Socket<ServerToClientEvents, ClientToServerEvents> {
        if (this.socket?.connected) {
            return this.socket;
        }

        this.token = token;

        this.socket = io(SOCKET_URL, {
            auth: {
                token,
            } as SocketAuthPayload,
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        // Connection event handlers
        this.socket.on('connect', () => {
            console.log('[Socket] Connected:', this.socket?.id);
        });

        this.socket.on('disconnect', (reason) => {
            console.log('[Socket] Disconnected:', reason);
        });

        this.socket.on('error', (error) => {
            console.error('[Socket] Error:', error);
        });

        return this.socket;
    }

    /**
     * Disconnect from socket server
     */
    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.token = null;
        }
    }

    /**
     * Get current socket instance
     */
    getSocket(): Socket<ServerToClientEvents, ClientToServerEvents> | null {
        return this.socket;
    }

    /**
     * Check if socket is connected
     */
    isConnected(): boolean {
        return this.socket?.connected || false;
    }

    /**
     * Join a session room
     */
    joinSession(sessionId: string): void {
        if (!this.socket) {
            throw new Error('Socket not connected. Call connect() first.');
        }
        this.socket.emit('join-session', sessionId);
    }

    /**
     * Leave a session room
     */
    leaveSession(sessionId: string): void {
        if (!this.socket) {
            throw new Error('Socket not connected. Call connect() first.');
        }
        this.socket.emit('leave-session', sessionId);
    }

    /**
     * Send a message in a session
     */
    sendMessage(sessionId: string, message: string): void {
        if (!this.socket) {
            throw new Error('Socket not connected. Call connect() first.');
        }
        this.socket.emit('send-message', { sessionId, message });
    }

    /**
     * Listen for new messages
     */
    onNewMessage(callback: (message: ChatMessage) => void): void {
        if (!this.socket) {
            throw new Error('Socket not connected. Call connect() first.');
        }
        this.socket.on('new-message', callback);
    }

    /**
     * Listen for user joined events
     */
    onUserJoined(
        callback: (data: { sessionId: string; userId: string; userName: string }) => void
    ): void {
        if (!this.socket) {
            throw new Error('Socket not connected. Call connect() first.');
        }
        this.socket.on('user-joined', callback);
    }

    /**
     * Listen for user left events
     */
    onUserLeft(
        callback: (data: { sessionId: string; userId: string; userName: string }) => void
    ): void {
        if (!this.socket) {
            throw new Error('Socket not connected. Call connect() first.');
        }
        this.socket.on('user-left', callback);
    }

    /**
     * Remove all event listeners
     */
    removeAllListeners(): void {
        if (this.socket) {
            this.socket.removeAllListeners();
        }
    }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const socketManager = new SocketManager();

export default socketManager;
