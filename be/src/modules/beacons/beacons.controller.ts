import type { Request, Response, NextFunction } from 'express';
import { BeaconsService } from './beacons.service.js';
import { sendSuccess } from '../../lib/response.js';
import type { CreateBeaconInput, UpdateBeaconInput, BeaconQueryInput } from './beacons.schema.js';

const beaconsService = new BeaconsService();

export class BeaconsController {
    /**
     * POST /beacons
     * Create a new beacon
     */
    async createBeacon(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.userId;
            const data: CreateBeaconInput = req.body;
            const beacon = await beaconsService.createBeacon(userId, data);
            sendSuccess(res, beacon, 'Beacon created successfully', 201);
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /beacons
     * Get all beacons with optional filters
     */
    async getBeacons(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const filters: BeaconQueryInput = req.query;
            const beacons = await beaconsService.getBeacons(filters);
            sendSuccess(res, beacons);
        } catch (error) {
            next(error);
        }
    }

   
    async getBeaconById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) throw new Error('id is required');
            const beacon = await beaconsService.getBeaconById(id);
            sendSuccess(res, beacon);
        } catch (error) {
            next(error);
        }
    }

    /**
     * PATCH /beacons/:id
     * Update beacon
     */
    async updateBeacon(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) throw new Error('id is required');
            const userId = req.user!.userId;
            const data: UpdateBeaconInput = req.body;
            const beacon = await beaconsService.updateBeacon(id, userId, data);
            sendSuccess(res, beacon, 'Beacon updated successfully');
        } catch (error) {
            next(error);
        }
    }

    /**
     * DELETE /beacons/:id
     * Delete beacon
     */
    async deleteBeacon(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) throw new Error('id is required');
            const userId = req.user!.userId;
            const result = await beaconsService.deleteBeacon(id, userId);
            sendSuccess(res, result);
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /beacons/:id/matches
     * Get match scores for all applicants of a specific beacon
     */
    async getBeaconMatches(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) throw new Error('id is required');
            const matches = await beaconsService.getBeaconMatches(id);
            sendSuccess(res, matches);
        } catch (error) {
            next(error);
        }
    }
}
