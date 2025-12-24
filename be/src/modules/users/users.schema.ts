/**
 * Users Module - Validation Schemas
 */
import { z } from 'zod';

export const updateProfileSchema = z.object({
    body: z.object({
        name: z.string().min(2).max(100).optional(),
        bio: z.string().max(500).optional(),
        interests: z.array(z.string()).optional(),
        skills: z.array(z.string()).optional(),
    }),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>['body'];
