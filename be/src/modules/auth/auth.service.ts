import bcrypt from 'bcrypt';
import { prisma } from '../../lib/prisma.js';
import { generateToken } from '../../lib/jwt.js';
import { ConflictError, UnauthorizedError } from '../../lib/errors.js';
import type { SignupInput, LoginInput } from './auth.schema.js';

const SALT_ROUNDS = 10;

export class AuthService {
    async signup(data: SignupInput) {
        const { name, email, password } = data;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new ConflictError('Email already registered');
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                profile: {
                    create: {
                        name,
                        interests: [],
                        skills: [],
                    },
                },
                helperStats: {
                    create: {
                        helpCount: 0,
                        totalPoints: 0,
                        avgRating: 0,
                    },
                },
            },
            include: {
                profile: true,
            },
        });

        const token = generateToken({
            userId: user.id,
            email: user.email,
        });

        return {
            user: {
                id: user.id,
                email: user.email,
                profile: user.profile,
            },
            token,
        };
    }


    async login(data: LoginInput) {
        const { email, password } = data;
        
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                profile: true,
            },
        });

        if (!user) {
            throw new UnauthorizedError('Invalid email or password');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
            throw new UnauthorizedError('Invalid email or password');
        }


        const token = generateToken({
            userId: user.id,
            email: user.email,
        });

        return {
            user: {
                id: user.id,
                email: user.email,
                profile: user.profile,
            },
            token,
        };
    }
}
