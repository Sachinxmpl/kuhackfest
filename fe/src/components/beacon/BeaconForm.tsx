// BeaconForm component for creating beacons
'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { beaconSchema, type BeaconFormData } from '@/lib/validator';
import { urgentDurations } from '@/lib/mock-data';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { AlertCircle } from 'lucide-react';
import { BeaconType } from '@/lib/types';

export interface BeaconFormProps {
    onSubmit: (data: BeaconFormData) => void;
    onCancel?: () => void;
    error: string | null;
}

export default function BeaconForm({ onSubmit, onCancel, error }: BeaconFormProps) {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<BeaconFormData>({
        resolver: zodResolver(beaconSchema),
        defaultValues: {
            type: BeaconType.NORMAL,
        },
    });

    const beaconType = useWatch({ control, name: "type" });
    const isUrgent = beaconType === BeaconType.URGENT;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Title */}
            <Input
                label="Title"
                placeholder="e.g., Need help understanding React hooks"
                error={errors.title?.message}
                {...register('title')}
            />

            {/* Description */}
            <Textarea
                label="Description"
                rows={4}
                placeholder="Describe what you need help with in detail..."
                error={errors.description?.message}
                {...register('description')}
            />

            {/* Beacon Type */}
            <div>
                <label className="block text-sm font-medium text-zinc-700 mb-3">
                    Beacon Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                    <label className="flex items-start gap-3 p-4 border border-zinc-300 rounded-lg cursor-pointer hover:border-zinc-400 transition-colors">
                        <input
                            type="radio"
                            value={BeaconType.NORMAL}
                            {...register('type')}
                            className="mt-0.5"
                        />
                        <div>
                            <div className="font-medium text-zinc-900">{BeaconType.NORMAL}</div>
                            <div className="text-sm text-zinc-600">
                                Open until you find a helper
                            </div>
                        </div>
                    </label>

                    <label className="flex items-start gap-3 p-4 border border-orange-300 rounded-lg cursor-pointer hover:border-orange-400 transition-colors bg-orange-50/30">
                        <input
                            type="radio"
                              value={BeaconType.URGENT}
                            {...register('type')}
                            className="mt-0.5"
                        />
                        <div>
                            <div className="font-medium text-zinc-900 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4 text-orange-600" />
                                {BeaconType.URGENT}
                            </div>
                            <div className="text-sm text-zinc-600">
                                Time-limited help request
                            </div>
                        </div>
                    </label>
                </div>
            </div>

            {/* Urgent Duration */}
            {isUrgent && (
                <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                        Time Limit
                    </label>
                    <select
                        className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                        {...register('urgentDuration', { valueAsNumber: true })}
                    >
                        <option value="">Select duration</option>
                        {urgentDurations.map((duration) => (
                            <option key={duration.value} value={duration.value}>
                                {duration.label}
                            </option>
                        ))}
                    </select>
                    {errors.urgentDuration && (
                        <p className="mt-1 text-sm text-red-600">{errors.urgentDuration.message}</p>
                    )}
                </div>
            )}

            {
                error && (
                    <div className="p-4 bg-red-100 border border-red-400 text-red-800 rounded-md">
                        {error}
                    </div>
                )
            }

            {/* Actions */}
            <div className="flex gap-3 pt-2">
                <Button type="submit" fullWidth disabled={isSubmitting}>
                    {isSubmitting ? 'Creating...' : 'Create Beacon'}
                </Button>
                {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                )}
            </div>
        </form>
    );
}
