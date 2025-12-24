/**
 * Applications Module - Validation Schemas
 */
import { z } from 'zod';

export const applyToBeaconSchema = z.object({
    body: z.object({
        message: z.string().min(10, 'Message must be at least 10 characters').max(500).optional(),
    }),
});

export type ApplyToBeaconInput = z.infer<typeof applyToBeaconSchema>['body'];
