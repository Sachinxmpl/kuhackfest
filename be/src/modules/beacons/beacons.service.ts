/**
 * Beacons Module - Service Layer
 */
import { prisma } from '../../lib/prisma.js';
import { NotFoundError, ForbiddenError } from '../../lib/errors.js';
import type { CreateBeaconInput, UpdateBeaconInput, BeaconQueryInput } from './beacons.schema.js';

export class BeaconsService {
    async createBeacon(userId: string, data: CreateBeaconInput) {
        const { title, description, type, expiresInMinutes } = data;

        let expiresAt: Date | null = null;
        if (type === 'URGENT' && expiresInMinutes) {
            expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);
        }

        const beacon = await prisma.beacon.create({
            data: {
                title,
                description,
                type,
                status: 'OPEN',
                expiresAt,
                creatorId: userId,
            },
            include: {
                creator: {
                    include: {
                        profile: true,
                    },
                },
            },
        });

        return beacon;
    }

    async getBeacons(filters: BeaconQueryInput) {
        const { status, type, creatorId } = filters;

        const where: any = {};

        if (status) where.status = status;
        if (type) where.type = type;
        if (creatorId) where.creatorId = creatorId;

        // Exclude expired urgent beacons
        where.OR = [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } },
        ];

        const beacons = await prisma.beacon.findMany({
            where,
            include: {
                creator: {
                    include: {
                        profile: true,
                    },
                },
                applications: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return beacons;
    }

    /**
     * Get beacon by ID
     */
    async getBeaconById(beaconId: string) {
        const beacon = await prisma.beacon.findUnique({
            where: { id: beaconId },
            include: {
                creator: {
                    include: {
                        profile: true,
                    },
                },
                applications: {
                    include: {
                        helper: {
                            include: {
                                profile: true,
                                helperStats: true,
                            },
                        },
                    },
                },
            },
        });

        if (!beacon) {
            throw new NotFoundError('Beacon not found');
        }

        // Check if beacon is expired
        if (beacon.expiresAt && beacon.expiresAt < new Date()) {
            // Auto-update to CLOSED if expired
            if (beacon.status === 'OPEN') {
                await prisma.beacon.update({
                    where: { id: beaconId },
                    data: { status: 'CLOSED' },
                });
                beacon.status = 'CLOSED';
            }
        }

        return beacon;
    }

    /**
     * Update beacon (owner only)
     */
    async updateBeacon(beaconId: string, userId: string, data: UpdateBeaconInput) {
        const beacon = await this.getBeaconById(beaconId);

        if (beacon.creatorId !== userId) {
            throw new ForbiddenError('You can only update your own beacons');
        }

        if (beacon.status !== 'OPEN') {
            throw new ForbiddenError('Can only update open beacons');
        }

        const updatedBeacon = await prisma.beacon.update({
            where: { id: beaconId },
            data: {
                title: data.title ?? beacon.title,
                description: data.description ?? beacon.description,
            },
            include: {
                creator: {
                    include: {
                        profile: true,
                    },
                },
            },
        });

        return updatedBeacon;
    }

    /**
     * Delete beacon (owner only)
     */
    async deleteBeacon(beaconId: string, userId: string) {
        const beacon = await this.getBeaconById(beaconId);

        if (beacon.creatorId !== userId) {
            throw new ForbiddenError('You can only delete your own beacons');
        }

        if (beacon.status === 'IN_SESSION') {
            throw new ForbiddenError('Cannot delete beacon with active session');
        }

        await prisma.beacon.delete({
            where: { id: beaconId },
        });

        return { message: 'Beacon deleted successfully' };
    }
}
