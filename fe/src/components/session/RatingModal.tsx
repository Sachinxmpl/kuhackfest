'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ratingSchema, type RatingFormData } from '@/lib/validator';
import Modal from '@/components/ui/Modal';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface RatingModalProps {
    isOpen: boolean;
    onClose: () => void;
    recipientName: string;
    onSubmit: (data: RatingFormData) => void;
}

export default function RatingModal({
    isOpen,
    onClose,
    recipientName,
    onSubmit,
}: RatingModalProps) {
    const [hoveredStar, setHoveredStar] = useState(0);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<RatingFormData>({
        resolver: zodResolver(ratingSchema),
        defaultValues: {
            stars: 0,
        },
    });

    const selectedStars = watch('stars');

    const handleStarClick = (rating: number) => {
        setValue('stars', rating, { shouldValidate: true });
    };

    const onFormSubmit = async (data: RatingFormData) => {
        await onSubmit(data);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Rate Your Session">
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
                {/* Rating description */}
                <div className="text-center">
                    <p className="text-zinc-600">
                        How was your session with <span className="font-medium">{recipientName}</span>?
                    </p>
                </div>

                {/* Star rating */}
                <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-3 text-center">
                        Rating
                    </label>
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                                key={rating}
                                type="button"
                                onClick={() => handleStarClick(rating)}
                                onMouseEnter={() => setHoveredStar(rating)}
                                onMouseLeave={() => setHoveredStar(0)}
                                className="transition-transform hover:scale-110 focus:outline-none"
                            >
                                <Star
                                    className={cn(
                                        'w-10 h-10 transition-colors',
                                        (hoveredStar >= rating || selectedStars >= rating)
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-zinc-300'
                                    )}
                                />
                            </button>
                        ))}
                    </div>
                    {errors.stars && (
                        <p className="mt-2 text-sm text-red-600 text-center">{errors.stars.message}</p>
                    )}
                </div>

                {/* Feedback */}
                <Textarea
                    label="Feedback (Optional)"
                    rows={4}
                    placeholder="Share your experience..."
                    error={errors.feedback?.message}
                    {...register('feedback')}
                />

                {/* Points info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                        <span className="font-medium">{recipientName}</span> will earn{' '}
                        <span className="font-bold">{selectedStars * 10} points</span> for this session
                    </p>
                </div>

                {/* Submit */}
                <Button type="submit" fullWidth disabled={isSubmitting || !selectedStars}>
                    {isSubmitting ? 'Submitting...' : 'Submit Rating'}
                </Button>
            </form>
        </Modal>
    );
}