// Zod schemas for form validation
import { z } from 'zod';
import { BeaconStatus, BeaconType } from './types';

// Auth schemas
export const loginSchema = z.object({
    email: z.email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

// Profile schemas
export const profileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
    interests: z.array(z.string()).min(1, 'Select at least one interest'),
    skills: z.array(z.string()).min(1, 'Select at least one skill'),
});

// Profile Details schema
export const profileDetailsSchema = z.object({
    studyLevel: z.enum(
        ['High School', 'Undergraduate', 'Postgraduate', 'PhD', 'Professional'],
    ),
    academicStream: z.string().min(2, 'Academic stream is required'),
    bio: z.string().min(20, 'About section must be at least 20 characters').max(1000, 'About section must be less than 1000 characters'),
    interests: z.array(z.string()).min(1, 'Select at least one interest'),
    skills: z.array(z.string()).min(1, 'Select at least one skill'),
    profileImage: z
        .any()
        .optional()
        .refine(
            (files) =>
                !files || files instanceof FileList && files.length <= 1,
            'Invalid file'
        )
});

// Beacon schemas
export const beaconSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title must be less than 100 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description must be less than 1000 characters'),
    type: z.enum(BeaconType),
    status: z.enum(BeaconStatus).default(BeaconStatus.OPEN).optional(),
    urgentDuration: z.number().optional(),
});

// Application schema
export const applicationSchema = z.object({
    message: z.string().min(10, 'Message must be at least 10 characters').max(500, 'Message must be less than 500 characters'),
});

// Rating schema
export const ratingSchema = z.object({
    stars: z.number().min(1, 'Please select a rating').max(5, 'Rating must be between 1 and 5'),
    feedback: z.string().max(500, 'Feedback must be less than 500 characters').optional(),
});

// Export types
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type ProfileDetailsFormData = z.infer<typeof profileDetailsSchema>;
export type BeaconFormData = z.infer<typeof beaconSchema>;
export type ApplicationFormData = z.infer<typeof applicationSchema>;
export type RatingFormData = z.infer<typeof ratingSchema>;
