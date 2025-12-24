/**
 * Socket.IO Setup for Real-time Chat
 * Handles real-time messaging during study sessions
 */
import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { verifyToken } from '../lib/jwt.js';
import { prisma } from '../lib/prisma.js';

interface SocketData {
    userId: string;
    email: string;
}

interface MessagePayload {
    sessionId: string;
    message: string;
}

export const initializeSocketIO = (httpServer: HTTPServer): SocketIOServer => {
    const io = new SocketIOServer(httpServer, {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            credentials: true,
        },
    });

    io.use(async (socket: Socket, next) => {
        try {
            const token = socket.handshake.auth.token;

            if (!token) {
                return next(new Error('Authentication error: No token provided'));
            }

            const decoded = verifyToken(token);
            (socket.data as SocketData) = {
                userId: decoded.userId,
                email: decoded.email,
            };

            next();
        } catch (error) {
            next(new Error('Authentication error: Invalid token'));
        }
    });

    io.on('connection', (socket: Socket) => {
        const userId = (socket.data as SocketData).userId;
        console.log(`User connected: ${userId}`);

        socket.on('join-session', async (sessionId: string) => {
            try {
                // Verify user is part of the session
                const session = await prisma.session.findUnique({
                    where: { id: sessionId },
                });

                if (!session) {
                    socket.emit('error', { message: 'Session not found' });
                    return;
                }

                if (session.learnerId !== userId && session.helperId !== userId) {
                    socket.emit('error', { message: 'You are not part of this session' });
                    return;
                }

                // Join the room
                socket.join(sessionId);
                socket.emit('joined-session', { sessionId });

                console.log(`User ${userId} joined session ${sessionId}`);
            } catch (error) {
                console.error('Error joining session:', error);
                socket.emit('error', { message: 'Failed to join session' });
            }
        });
        
        socket.on('send-message', async (payload: MessagePayload) => {
            try {
                const { sessionId, message } = payload;

                // Verify user is part of the session
                const session = await prisma.session.findUnique({
                    where: { id: sessionId },
                    include: {
                        learner: {
                            include: {
                                profile: true,
                            },
                        },
                        helper: {
                            include: {
                                profile: true,
                            },
                        },
                    },
                });

                if (!session) {
                    socket.emit('error', { message: 'Session not found' });
                    return;
                }

                if (session.learnerId !== userId && session.helperId !== userId) {
                    socket.emit('error', { message: 'You are not part of this session' });
                    return;
                }

                // Get sender profile
                const senderProfile =
                    session.learnerId === userId
                        ? session.learner.profile
                        : session.helper.profile;

                // Broadcast message to all users in the session room
                const messageData = {
                    id: Date.now().toString(), // Simple ID for demo
                    sessionId,
                    userId,
                    userName: senderProfile?.name || 'Anonymous',
                    message,
                    timestamp: new Date().toISOString(),
                };

                io.to(sessionId).emit('new-message', messageData);
            } catch (error) {
                console.error('Error sending message:', error);
                socket.emit('error', { message: 'Failed to send message' });
            }
        });

        /**
         * Leave a session room
         */
        socket.on('leave-session', (sessionId: string) => {
            socket.leave(sessionId);
            console.log(`User ${userId} left session ${sessionId}`);
        });

        /**
         * Disconnect handler
         */
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${userId}`);
        });
    });

    return io;
};
