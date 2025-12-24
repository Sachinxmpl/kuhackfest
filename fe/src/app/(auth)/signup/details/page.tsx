'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileDetailsSchema, type ProfileDetailsFormData } from '@/lib/validator';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { FileUp, BookOpen } from 'lucide-react';
import { useState } from 'react';

const ACADEMIC_STREAMS = [
    'Science',
    'Commerce',
    'Humanities',
    'Engineering',
    'Medical',
    'Law',
    'Business Administration',
    'Information Technology',
];

const INTERESTS = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'Engineering',
    'Economics',
    'Literature',
    'History',
    'Psychology',
    'Philosophy',
    'Languages',
];


const SKILLS = [
    'Problem Solving',
    'Critical Thinking',
    'Communication',
    'Teamwork',
    'Leadership',
    'Time Management',
    'Research',
    'Data Analysis',
    'Public Speaking',
    'Writing',
    'Programming',
    'Project Management',
];

export default function ProfileDetailsPage() {
    const router = useRouter();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
    } = useForm<ProfileDetailsFormData>({
        resolver: zodResolver(profileDetailsSchema),
    });

    const profileImage = watch('profileImage');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const toggleInterest = (interest: string) => {
        setSelectedInterests((prev) =>
            prev.includes(interest)
                ? prev.filter((i) => i !== interest)
                : [...prev, interest]
        );
    };

    const toggleSkill = (skill: string) => {
        setSelectedSkills((prev) =>
            prev.includes(skill)
                ? prev.filter((s) => s !== skill)
                : [...prev, skill]
        );
    };

    const onSubmit = async (data: ProfileDetailsFormData) => {
        // Add selected interests and skills to data
        const formData = {
            ...data,
            interests: selectedInterests,
            skills: selectedSkills,
        };
        // Mock submission - simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log('Profile details:', formData);

        // Redirect to dashboard or profile page
        router.push('/profile');
    };

    return (
        <div className="min-h-screen bg-zinc-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-zinc-900 rounded-full mb-4">
                        <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-zinc-900 mb-2">
                        Complete Your Profile
                    </h1>
                    <p className="text-zinc-600">
                        Tell us more about yourself and your academic interests
                    </p>
                </div>

                <div className="bg-white border border-zinc-200 rounded-lg p-8 shadow-sm">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        {/* Profile Image Upload */}
                        <div className="border-2 border-dashed border-zinc-300 rounded-lg p-8 text-center hover:border-zinc-400 transition">
                            <input
                                type="file"
                                accept="image/*"
                                {...register('profileImage')}
                                onChange={handleImageChange}
                                className="hidden"
                                id="profileImage"
                            />
                            <label htmlFor="profileImage" className="cursor-pointer">
                                {imagePreview ? (
                                    <div className="flex flex-col items-center">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-32 h-32 rounded-full object-cover mb-4"
                                        />
                                        <p className="text-sm text-zinc-600">
                                            Click to change image
                                        </p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <FileUp className="w-8 h-8 text-zinc-400 mb-2" />
                                        <p className="text-sm font-medium text-zinc-900">
                                            Upload profile picture
                                        </p>
                                        <p className="text-xs text-zinc-500 mt-1">
                                            PNG, JPG, GIF up to 10MB
                                        </p>
                                    </div>
                                )}
                            </label>
                        </div>

                        {/* About Section */}
                        <div>
                            <Textarea
                                label="About You"
                                placeholder="Tell us about yourself, your academic journey, goals, and what makes you unique..."
                                error={errors.about?.message}
                                {...register('about')}
                                rows={5}
                            />
                            <p className="text-xs text-zinc-500 mt-2">
                                Minimum 20 characters, maximum 1000
                            </p>
                        </div>

                        {/* Academic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-zinc-900 mb-2">
                                    Study Level
                                </label>
                                <select
                                    {...register('studyLevel')}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 transition text-zinc-900 ${
                                        errors.studyLevel
                                            ? 'border-red-500'
                                            : 'border-zinc-300'
                                    }`}
                                >
                                    <option value="">Select your study level</option>
                                    <option value="High School">High School</option>
                                    <option value="Undergraduate">Undergraduate</option>
                                    <option value="Postgraduate">Postgraduate</option>
                                    <option value="PhD">PhD</option>
                                    <option value="Professional">Professional</option>
                                </select>
                                {errors.studyLevel && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {errors.studyLevel.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-900 mb-2">
                                    Academic Stream
                                </label>
                                <select
                                    {...register('academicStream')}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 transition text-zinc-900 ${
                                        errors.academicStream
                                            ? 'border-red-500'
                                            : 'border-zinc-300'
                                    }`}
                                >
                                    <option value="">Select your stream</option>
                                    {ACADEMIC_STREAMS.map((stream) => (
                                        <option key={stream} value={stream}>
                                            {stream}
                                        </option>
                                    ))}
                                </select>
                                {errors.academicStream && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {errors.academicStream.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        

                        {/* Interests */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-900 mb-4">
                                Areas of Interest
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {INTERESTS.map((interest) => (
                                    <button
                                        key={interest}
                                        type="button"
                                        onClick={() => toggleInterest(interest)}
                                        className={`px-4 py-2 rounded-lg border transition font-medium text-sm ${
                                            selectedInterests.includes(interest)
                                                ? 'bg-zinc-900 text-white border-zinc-900'
                                                : 'bg-white text-zinc-900 border-zinc-300 hover:border-zinc-400'
                                        }`}
                                    >
                                        {interest}
                                    </button>
                                ))}
                            </div>
                            {selectedInterests.length === 0 && (
                                <p className="text-sm text-red-500 mt-2">
                                    Please select at least one interest
                                </p>
                            )}
                        </div>

                        {/* Skills */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-900 mb-4">
                                Skills
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {SKILLS.map((skill) => (
                                    <button
                                        key={skill}
                                        type="button"
                                        onClick={() => toggleSkill(skill)}
                                        className={`px-4 py-2 rounded-lg border transition font-medium text-sm ${
                                            selectedSkills.includes(skill)
                                                ? 'bg-zinc-900 text-white border-zinc-900'
                                                : 'bg-white text-zinc-900 border-zinc-300 hover:border-zinc-400'
                                        }`}
                                    >
                                        {skill}
                                    </button>
                                ))}
                            </div>
                            {selectedSkills.length === 0 && (
                                <p className="text-sm text-red-500 mt-2">
                                    Please select at least one skill
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            fullWidth
                            size="lg"
                            disabled={isSubmitting || selectedInterests.length === 0 || selectedSkills.length === 0}
                        >
                            {isSubmitting ? 'Creating Profile...' : 'Complete Profile'}
                        </Button>

                        {/* Back to Previous */}
                        <p className="text-center text-sm text-zinc-600">
                            You can always update these details later
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
