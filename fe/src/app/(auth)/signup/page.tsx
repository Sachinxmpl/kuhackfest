'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupFormData } from '@/lib/validator';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/constants/constants';
import { useUser } from '@/contexts/UserContext';

export default function SignupPage() {
    const router = useRouter();
    const { setUser } = useUser();

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data: SignupFormData) => {
        setErrorMessage(null);
        try {
            const response = await fetch(`${API_BASE_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!result.success) {
                setErrorMessage('Signup failed. Please try again.');
                return;
            }

            const token = result.data.token;
            localStorage.setItem('token', token);
            setUser(result.data.user);
            console.log('Signup successful:', result.data);
        } catch (e) {
            console.error('Signup failed:', e);
            setErrorMessage('Signup failed. Please try again later.');
            return;
        }

        router.push('/signup/details');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4 py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-zinc-900 rounded-full mb-4">
                        <UserPlus className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-zinc-900 mb-2">Create an account</h1>
                    <p className="text-zinc-600">Join Study Beacon and start learning together</p>
                </div>

                <div className="bg-white border border-zinc-200 rounded-lg p-8 shadow-sm">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <Input
                            label="Full name"
                            type="text"
                            placeholder="John Doe"
                            error={errors.name?.message}
                            {...register('name')}
                        />

                        <Input
                            label="Email"
                            type="email"
                            placeholder="you@example.com"
                            error={errors.email?.message}
                            {...register('email')}
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            helperText="At least 6 characters"
                            error={errors.password?.message}
                            {...register('password')}
                        />

                        <Input
                            label="Confirm password"
                            type="password"
                            placeholder="••••••••"
                            error={errors.confirmPassword?.message}
                            {...register('confirmPassword')}
                        />

                        {errorMessage && (
                            <p className="text-sm text-red-600">{errorMessage}</p>
                        )}

                        <Button
                            type="submit"
                            fullWidth
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Creating account...' : 'Create account'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-zinc-600">
                            Already have an account?{' '}
                            <Link
                                href="/login"
                                className="font-medium text-zinc-900 hover:underline"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>

                <p className="mt-6 text-center text-xs text-zinc-500">
                    By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
}
