/**
 * Users Module - Service Layer
 */
import { prisma } from '../../lib/prisma.js';
import { NotFoundError } from '../../lib/errors.js';
import type { UpdateProfileInput } from './users.schema.js';

export class UsersService {
    /**
     * Get current user's profile
     */
    async getMe(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                profile: true,
                helperStats: true,
            },
        });

        if (!user) {
            throw new NotFoundError('User not found');
        }

        return {
            id: user.id,
            email: user.email,
            profile: user.profile,
            helperStats: user.helperStats,
        };
    }

    /**
     * Update user profile
     */
    async updateProfile(userId: string, data: UpdateProfileInput) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { profile: true },
        });

        if (!user || !user.profile) {
            throw new NotFoundError('User or profile not found');
        }

        const updatedProfile = await prisma.profile.update({
            where: { id: user.profile.id },
            data: {
                name: data.name ?? user.profile.name,
                bio: data.bio ?? user.profile.bio,
                interests: data.interests ?? user.profile.interests,
                skills: data.skills ?? user.profile.skills,
            },
        });

        return updatedProfile;
    }

    /**
     * Get user by ID (for viewing other users)
     */
    async getUserById(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                profile: true,
                helperStats: true,
            },
        });

        if (!user) {
            throw new NotFoundError('User not found');
        }

        return {
            id: user.id,
            profile: user.profile,
            helperStats: user.helperStats,
        };
    }
}
