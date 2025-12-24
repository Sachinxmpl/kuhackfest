import express, { type Application } from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/error.middleware.js';


import authRoutes from './modules/auth/auth.routes.js';
import usersRoutes from './modules/users/users.routes.js';
import beaconsRoutes from './modules/beacons/beacons.routes.js';
import applicationsRoutes from './modules/applications/applications.routes.js';
import sessionsRoutes from './modules/sessions/sessions.routes.js';
import ratingsRoutes from './modules/ratings/ratings.routes.js';

export const createApp = (): Application => {
    const app = express();

    app.use(
        cors({
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            credentials: true,
        })
    );

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.get('/health', (req, res) => {
        res.json({
            status: 'ok',
        });
    });

    app.use('/api/auth', authRoutes);
    app.use('/api/users', usersRoutes);
    app.use('/api', applicationsRoutes);    
    app.use('/api/beacons', beaconsRoutes);
    app.use('/api/sessions', sessionsRoutes);
    app.use('/api/ratings', ratingsRoutes);

    app.use((req, res) => {
        res.status(404).json({
            success: false,
            error: 'Route not found',
        });
    });

    app.use(errorHandler);

    return app;
};
