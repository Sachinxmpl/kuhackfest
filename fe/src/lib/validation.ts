/**
 * Zod Validation Schemas for Frontend Forms
 * These MUST align with backend validation rules from BACKEND_API_REFERENCE.md
 */

import { z } from 'zod';
import { BeaconType } from './api/types';

// ============================================================================
// AUTH SCHEMAS (Must match backend)
// ============================================================================

export const signupSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name cannot exceed 100 characters'),

    email: z
        .string()
        .email('Invalid email address'),

    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const loginSchema = z.object({
    email: z
        .string()
        .email('Invalid email address'),

    password: z
        .string()
        .min(1, 'Password is required'),
});

// ============================================================================
// PROFILE SCHEMAS (Must match backend)
// ============================================================================

export const updateProfileSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name cannot exceed 100 characters')
        .optional(),

    bio: z
        .string()
        .max(500, 'Bio cannot exceed 500 characters')
        .optional()
        .nullable(),

    interests: z
        .array(z.string())
        .optional(),

    skills: z
        .array(z.string())
        .optional(),
});

// ============================================================================
// BEACON SCHEMAS (Must match backend)
// ============================================================================

export const createBeaconSchema = z.object({
    title: z
        .string()
        .min(5, 'Title must be at least 5 characters')
        .max(200, 'Title cannot exceed 200 characters'),

    description: z
        .string()
        .min(10, 'Description must be at least 10 characters')
        .max(2000, 'Description cannot exceed 2000 characters'),

    type: z.nativeEnum(BeaconType),

    expiresInMinutes: z
        .number()
        .int()
        .min(5, 'Expiration must be at least 5 minutes')
        .max(1440, 'Expiration cannot exceed 24 hours (1440 minutes)')
        .optional(),
}).refine(
    (data) => {
        // expiresInMinutes is only for URGENT beacons
        if (data.type === BeaconType.URGENT && !data.expiresInMinutes) {
            return false;
        }
        return true;
    },
    {
        message: 'URGENT beacons must have an expiration time',
        path: ['expiresInMinutes'],
    }
);

export const updateBeaconSchema = z.object({
    title: z
        .string()
        .min(5, 'Title must be at least 5 characters')
        .max(200, 'Title cannot exceed 200 characters')
        .optional(),

    description: z
        .string()
        .min(10, 'Description must be at least 10 characters')
        .max(2000, 'Description cannot exceed 2000 characters')
        .optional(),
});

export const applyToBeaconSchema = z.object({
    message: z
        .string()
        .max(500, 'Message cannot exceed 500 characters')
        .optional(),
});

// ============================================================================
// SESSION SCHEMAS (Must match backend)
// ============================================================================

export const chatMessageSchema = z.object({
    message: z
        .string()
        .min(1, 'Message cannot be empty')
        .max(500, 'Message cannot exceed 500 characters'),
});

// ============================================================================
// RATING SCHEMAS (Must match backend)
// ============================================================================

export const createRatingSchema = z.object({
    sessionId: z
        .string()
        .uuid('Invalid session ID'),

    toUserId: z
        .string()
        .uuid('Invalid user ID'),

    score: z
        .number()
        .int()
        .min(1, 'Rating must be at least 1')
        .max(5, 'Rating cannot exceed 5'),

    comment: z
        .string()
        .max(500, 'Comment cannot exceed 500 characters')
        .optional(),
});

// ============================================================================
// FRONTEND-ONLY SCHEMAS (These fields do NOT exist in backend)
// ============================================================================

/**
 * Extended profile schema for frontend forms
 * Includes backend fields + frontend-only fields
 * 
 * IMPORTANT: When submitting to API, strip out the frontend-only fields!
 * Only send: name, bio, interests, skills
 */
export const extendedProfileSchema = updateProfileSchema.extend({
    // Frontend-only fields - DO NOT send to backend
    studyLevel: z
        .enum(['High School', 'Undergraduate', 'Graduate', 'Postgraduate', 'Other'])
        .optional(),

    academicStream: z
        .string()
        .max(100, 'Academic stream cannot exceed 100 characters')
        .optional(),

    availability: z
        .string()
        .max(200, 'Availability cannot exceed 200 characters')
        .optional(),

    experienceLevel: z
        .enum(['Beginner', 'Intermediate', 'Advanced', 'Expert'])
        .optional(),
});

// ============================================================================
// HELPER TYPE INFERENCE
// ============================================================================

export type SignupFormData = z.infer<typeof signupSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type ExtendedProfileFormData = z.infer<typeof extendedProfileSchema>;
export type CreateBeaconFormData = z.infer<typeof createBeaconSchema>;
export type UpdateBeaconFormData = z.infer<typeof updateBeaconSchema>;
export type ApplyToBeaconFormData = z.infer<typeof applyToBeaconSchema>;
export type ChatMessageFormData = z.infer<typeof chatMessageSchema>;
export type CreateRatingFormData = z.infer<typeof createRatingSchema>;

// ============================================================================
// SCHEMA UTILITIES
// ============================================================================

/**
 * Strip frontend-only fields before sending to backend
 * Use this when submitting extended profile data
 */
export function stripFrontendOnlyFields(
    data: ExtendedProfileFormData
): UpdateProfileFormData {
    const { studyLevel, academicStream, availability, experienceLevel, ...backendData } = data;
    return backendData;
}
