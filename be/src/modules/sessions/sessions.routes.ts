    import { Router } from 'express';
    import { SessionsController } from './sessions.controller.js';
    import { authenticate } from '../../middlewares/auth.middleware.js';

    const router = Router();
    const sessionsController = new SessionsController();


    router.use(authenticate);

    router.get('/', sessionsController.getUserSessions.bind(sessionsController));

    router.get('/:id', sessionsController.getSessionById.bind(sessionsController));


    router.post('/:id/end', sessionsController.endSession.bind(sessionsController));

    export default router;
