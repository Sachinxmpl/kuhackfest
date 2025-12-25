// Application modal/page for applying to help
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { applicationSchema, type ApplicationFormData } from '@/lib/validator';
import ProfileCard from '@/components/profile/ProfileCard';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { Send } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { User } from '@/lib/types';

export interface ApplicationFormProps {
    beaconId: string;
    onSubmit: (data: ApplicationFormData) => void;
    onCancel?: () => void;
}

export default function ApplicationForm({
    beaconId: _beaconId,
    onSubmit,
    onCancel,
}: ApplicationFormProps) {
    const { user } = useUser();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ApplicationFormData>({
        resolver: zodResolver(applicationSchema),
    });

    return (
        <div className="space-y-6">
            {/* User preview */}
            <div>
                <h3 className="text-sm font-medium text-zinc-700 mb-3">Your Profile</h3>
                <ProfileCard user={user as User} showStats={true} />
            </div>

            {/* Application form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Textarea
                    label="Message to the requester"
                    rows={4}
                    placeholder="Introduce yourself and explain how you can help..."
                    error={errors.message?.message}
                    {...register('message')}
                />

                <div className="flex gap-3">
                    <Button type="submit" fullWidth disabled={isSubmitting}>
                        <Send className="w-4 h-4" />
                        {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </Button>
                    {onCancel && (
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
}
