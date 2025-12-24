import { z } from 'zod';

export const createBeaconSchema = z.object({
    body: z.object({
        title: z.string(),
        description: z.string(),
        type: z.enum(['NORMAL', 'URGENT']),
        expiresInMinutes: z.number() // in minutes 
    }),
});

export const updateBeaconSchema = z.object({
    body: z.object({
        title: z.string(),
        description: z.string()
    }),
});

export const beaconQuerySchema = z.object({
    query: z.object({
        status: z.enum(['OPEN', 'IN_SESSION', 'CLOSED']).optional(),
        type: z.enum(['NORMAL', 'URGENT']).optional(),
        creatorId: z.string().uuid().optional(),
    }),
});

export type CreateBeaconInput = z.infer<typeof createBeaconSchema>['body'];
export type UpdateBeaconInput = z.infer<typeof updateBeaconSchema>['body'];
export type BeaconQueryInput = z.infer<typeof beaconQuerySchema>['query'];
