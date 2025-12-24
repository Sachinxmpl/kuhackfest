import type { Request, Response, NextFunction } from 'express';
import { ApplicationsService } from './applications.service.js';
import { sendSuccess } from '../../lib/response.js';
import type { ApplyToBeaconInput } from './applications.schema.js';

const applicationsService = new ApplicationsService();

export class ApplicationsController {
    async applyToBeacon(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { beaconId } = req.params;
            if (!beaconId) throw new Error('beaconId is required');
            const helperId = req.user!.userId;
            const data: ApplyToBeaconInput = req.body;
            const application = await applicationsService.applyToBeacon(beaconId, helperId, data);
            sendSuccess(res, application, 'Application submitted successfully', 201);
        } catch (error) {
            next(error);
        }
    }

    async getBeaconApplications(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { beaconId } = req.params;
            if (!beaconId) throw new Error('beaconId is required');
        } catch (error) {
            next(error);
        }
    }


    async selectHelper(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { applicationId } = req.params;
            if (!applicationId) throw new Error('applicationId is required');
            const userId = req.user!.userId;
            const session = await applicationsService.selectHelper(applicationId, userId);
            sendSuccess(res, session, 'Helper selected successfully', 201);
        } catch (error) {
            next(error);
        }
    }
}