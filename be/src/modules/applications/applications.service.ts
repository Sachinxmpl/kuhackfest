import { prisma } from '../../lib/prisma.js';
import { NotFoundError, ForbiddenError, ConflictError } from '../../lib/errors.js';
import type { ApplyToBeaconInput } from './applications.schema.js';

export class ApplicationsService {
    /**
     * Apply to help with a beacon
     */
    async applyToBeacon(beaconId: string, helperId: string, data: ApplyToBeaconInput) {
        const beacon = await prisma.beacon.findUnique({
            where: { id: beaconId },
        });

        if (!beacon) {
            throw new NotFoundError('Beacon not found');
        }

        if (beacon.status !== 'OPEN') {
            throw new ForbiddenError('This beacon is no longer accepting applications');
        }

        // Check if beacon is expired
        if (beacon.expiresAt && beacon.expiresAt < new Date()) {
            throw new ForbiddenError('This beacon has expired');
        }

        // Can't apply to your own beacon
        if (beacon.creatorId === helperId) {
            throw new ForbiddenError('You cannot apply to your own beacon');
        }

        // Check if already applied
        const existingApplication = await prisma.beaconApplication.findUnique({
            where: {
                beaconId_helperId: {
                    beaconId,
                    helperId,
                },
            },
        });

        if (existingApplication) {
            throw new ConflictError('You have already applied to this beacon');
        }

        // Create application
        const application = await prisma.beaconApplication.create({
            data: {
                beaconId,
                helperId,
                message: data.message as string,
            },
            include: {
                helper: {
                    include: {
                        profile: true,
                        helperStats: true,
                    },
                },
            },
        });

        return application;
    }


    async getBeaconApplications(beaconId: string, userId: string) {
        const beacon = await prisma.beacon.findUnique({
            where: { id: beaconId },
        });

        if (!beacon) {
            throw new NotFoundError('Beacon not found');
        }

        if (beacon.creatorId !== userId) {
            throw new ForbiddenError('You can only view applications for your own beacons');
        }

        const applications = await prisma.beaconApplication.findMany({
            where: { beaconId },
            include: {
                helper: {
                    include: {
                        profile: true,
                        helperStats: true,
                    },
                },
            },
            orderBy: [
                { appliedAt: 'asc' }, // First come first serve
            ],
        });

        return applications;
    }

    /**
     * Select a helper for a beacon (beacon owner only) creates a session
     */
    async selectHelper(applicationId: string, userId: string) {
        const application = await prisma.beaconApplication.findUnique({
            where: { id: applicationId },
            include: {
                beacon: true,
            },
        });

        if (!application) {
            throw new NotFoundError('Application not found');
        }

        // Verify the user is the beacon owner
        if (application.beacon.creatorId !== userId) {
            throw new ForbiddenError('Only the beacon owner can select a helper');
        }

        // Verify beacon is still open
        if (application.beacon.status !== 'OPEN') {
            throw new ForbiddenError('This beacon is no longer open');
        }

        // Create a session and update beacon status in a transaction
        const result = await prisma.$transaction(async (tx) => {
            // Update beacon status
            await tx.beacon.update({
                where: { id: application.beaconId },
                data: { status: 'IN_SESSION' },
            });

            console.log("Creatinggggggggggggggg sesssssssssssssssssssion")

            const session = await tx.session.create({
                data: {
                    beaconId: application.beaconId,
                    learnerId: application.beacon.creatorId,
                    helperId: application.helperId,
                    status: 'ACTIVE',
                },
                include: {
                    beacon: true,
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

            console.log("session is " , session)

            return session;
        });

        return result;
    }
}
