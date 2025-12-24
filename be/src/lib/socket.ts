// lib/socket.ts
import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { verifyToken } from '../lib/jwt.js';
import { prisma } from '../lib/prisma.js';
import { messageStore } from './message.store.js'; // Import the store
import { appEvents } from './events.js';

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

    // Sync End Session Event
    appEvents.on('session-ended', ({ sessionId }: {sessionId :any}) => {
        io.to(sessionId).emit('session-ended', {
            message: 'The session has been ended.',
        });
        // Optional: clear memory after session ends to save RAM
        // messageStore.clearSession(sessionId); 
    });

    io.use(async (socket: Socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) return next(new Error('Authentication error: No token provided'));

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

        socket.on('join-session', async (sessionId: string) => {
            // ... (Your existing validation logic remains the same) ...
            try {
                const session = await prisma.session.findUnique({ where: { id: sessionId } });
                if (!session) { socket.emit('error', { message: 'Session not found' }); return; }
                if (session.learnerId !== userId && session.helperId !== userId) {
                    socket.emit('error', { message: 'Unauthorized' }); return;
                }

                socket.join(sessionId);
                socket.emit('joined-session', { sessionId });
            } catch (error) {
                console.error(error);
            }
        });

        socket.on('send-message', async (payload: MessagePayload) => {
            try {
                const { sessionId, message } = payload;

                // 1. Validate Session
                const session = await prisma.session.findUnique({ where: { id: sessionId } });
                if (!session || (session.learnerId !== userId && session.helperId !== userId)) {
                    socket.emit('error', { message: 'Unauthorized' });
                    return;
                }

                // 2. Fetch Sender Details (We still need this for the UI)
                // We read User, but we DO NOT write to Message table
                const sender = await prisma.user.findUnique({
                    where: { id: userId },
                    include: { profile: true }
                });

                if (!sender) return;

                // 3. Construct Message Object (In Memory)
                const messageObj = {
                    id: Date.now().toString(), // Temporary ID
                    sessionId,
                    senderId: userId,
                    content: message,
                    createdAt: new Date(),
                    sender: {
                        id: sender.id,
                        name: sender.profile?.name || 'User',
                    }
                };

                // 4. Save to Memory Store
                messageStore.addMessage(sessionId, messageObj);

                // 5. Broadcast
                io.to(sessionId).emit('new-message', messageObj);

            } catch (error) {
                console.error('Error sending message:', error);
                socket.emit('error', { message: 'Failed to send message' });
            }
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${userId}`);
        });
    });

    return io;
};