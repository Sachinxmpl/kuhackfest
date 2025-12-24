import 'dotenv/config';
import { createServer } from 'http';
import { createApp } from './app.js';
import { initializeSocketIO } from './lib/socket.js';
import { prisma } from './lib/prisma.js';

const PORT = process.env.PORT || 4000;
const app = createApp();
const httpServer = createServer(app);

const io = initializeSocketIO(httpServer);

const startServer = async () => {
    try {
        await prisma.$connect();
        console.log('✅ Database connected');

        httpServer.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        process.exit(1);
    }
};

startServer();
