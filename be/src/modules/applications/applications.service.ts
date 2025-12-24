import { prisma } from '../../lib/prisma.js';
import { NotFoundError, ForbiddenError, ConflictError } from '../../lib/errors.js';
import { messageStore } from '../../lib/message.store.js'; 
import type { ApplyToBeaconInput } from './applications.schema.js';

export class ApplicationsService {
    async applyToBeacon(beaconId: string, helperId: string, data: ApplyToBeaconInput) {
        const beacon = await prisma.beacon.findUnique({ where: { id: beaconId } });
        
        if (!beacon) throw new NotFoundError('Beacon not found');
        if (beacon.status !== 'OPEN') throw new ForbiddenError('Beacon closed');

        if (beacon.creatorId === helperId) {
            throw new ForbiddenError('You cannot apply to your own beacon');
        }

        const existingApplication = await prisma.beaconApplication.findUnique({
            where: {
                beaconId_helperId: {
                    beaconId,
                    helperId
                }
            }
        });
        if (existingApplication) throw new ConflictError('You have already applied to this beacon');

         return await prisma.beaconApplication.create({
            data: { beaconId, helperId, message: data.message as string },
            include: { helper: { include: { profile: true, helperStats: true } } },
        });
    }
    
    async getBeaconApplications(beaconId: string, userId: string) {
        const beacon = await prisma.beacon.findUnique({ where: { id: beaconId }});
        if (!beacon) throw new NotFoundError('Beacon not found');

        return prisma.beaconApplication.findMany({
            where: { beaconId },
            include: { helper: { include: { profile: true, helperStats: true } } },
            orderBy: [{ appliedAt: 'asc' }],
        });
    }

    async selectHelper(applicationId: string, userId: string) {
        const application = await prisma.beaconApplication.findUnique({
            where: { id: applicationId },
            include: { beacon: true },
        });

        if (!application) throw new NotFoundError('Application not found');
        if (application.beacon.creatorId !== userId) throw new ForbiddenError('Only owner can select');
        if (application.beacon.status !== 'OPEN') throw new ForbiddenError('Beacon not open');

        const result = await prisma.$transaction(async (tx) => {
            await tx.beacon.update({
                where: { id: application.beaconId },
                data: { status: 'IN_SESSION' },
            });

            const session = await tx.session.create({
                data: {
                    beaconId: application.beaconId,
                    learnerId: application.beacon.creatorId,
                    helperId: application.helperId,
                    status: 'ACTIVE',
                },
                include: {
                    beacon: true,
                    learner: { include: { profile: true } },
                    helper: { include: { profile: true } },
                },
            });

            return session;
        });

        messageStore.initSession(result.id);
        console.log(`Initialized memory store for session: ${result.id}`);

        return result;
    }
}