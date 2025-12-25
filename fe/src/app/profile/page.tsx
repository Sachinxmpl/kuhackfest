// Profile page with view and edit modes
'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, type ProfileFormData } from '@/lib/validator';
import { currentUser, INTERESTS, SKILLS } from '@/lib/mock-data';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import TagInput from '@/components/profile/TagInput';
import { Edit2, Save, X, Award, Star, Users } from 'lucide-react';
import { formatRating } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const { user, setUser } = useUser();

    const getExperienceLevel = (helpCount: number = 0) => {
        if (helpCount < 10) return 'Beginner';
        if (helpCount < 20) return 'Intermediate';
        return 'Advanced';
    };

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.profile?.name || "User",
            bio: user?.profile?.bio,
            interests: user?.profile?.interests,
            skills: user?.profile?.skills,
            // experienceLevel: getExperienceLevel(user?.helperStats?.helpCount || 0),
        },
    });

    const onSubmit = async (data: ProfileFormData) => {
        
    };

    const handleCancel = () => {
        reset();
        setIsEditing(false);
    };

    return (
        <div className="min-h-screen bg-zinc-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-zinc-900">My Profile</h1>
                    {!isEditing && (
                        <Button onClick={() => setIsEditing(true)} variant="outline">
                            <Edit2 className="w-4 h-4" />
                            Edit Profile
                        </Button>
                    )}
                </div>

                <div className="grid gap-6">
                    {/* Profile card */}
                    <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-sm">
                        <div className="flex items-start gap-6">
                            {/* Avatar */}
                            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-zinc-100 shrink-0">
                                    <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-zinc-600">
                                        {user?.profile?.name.charAt(0) || "User"}
                                    </div>
                            </div>

                            {/* User info */}
                            <div className="flex-1">
                                {!isEditing ? (
                                    <>
                                        <h2 className="text-2xl font-bold text-zinc-900">{user?.profile?.name || "User"}</h2>
                                        <div className="flex items-center gap-4 mt-2">
                                            <Badge>{getExperienceLevel(user?.helperStats?.helpCount || 0)}</Badge>
                                            <span className="flex items-center gap-1 text-zinc-600">
                                                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                                {formatRating(user?.helperStats?.avgRating || 0)}
                                            </span>
                                            <span className="flex items-center gap-1 text-zinc-600">
                                                <Award className="w-5 h-5" />
                                                {user?.helperStats?.totalPoints || 0} points
                                            </span>
                                            {/* <span className="flex items-center gap-1 text-zinc-600">
                                                <Users className="w-5 h-5" />
                                                {user?.helperStats?.totalSessions || 0} sessions
                                            </span> */}
                                        </div>
                                        {user?.profile?.bio && (
                                            <p className="mt-4 text-zinc-600">{user?.profile?.bio}</p>
                                        )}
                                    </>
                                ) : (
                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                        <Input
                                            label="Name"
                                            error={errors.name?.message}
                                            {...register('name')}
                                        />

                                        <Textarea
                                            label="Bio"
                                            rows={3}
                                            placeholder="Tell others about yourself..."
                                            error={errors.bio?.message}
                                            {...register('bio')}
                                        />
{/* 
                                        <div>
                                            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                                                Experience Level
                                            </label>
                                            <select
                                                className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                                                {...register('experienceLevel')}
                                            >
                                                <option value="Beginner">Beginner</option>
                                                <option value="Intermediate">Intermediate</option>
                                                <option value="Advanced">Advanced</option>
                                            </select>
                                            {errors.experienceLevel && (
                                                <p className="mt-1 text-sm text-red-600">{errors.experienceLevel.message}</p>
                                            )}
                                        </div> */}

                                        <div className="flex gap-2 pt-2">
                                            <Button type="submit" disabled={isSubmitting}>
                                                <Save className="w-4 h-4" />
                                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={handleCancel}
                                            >
                                                <X className="w-4 h-4" />
                                                Cancel
                                            </Button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Interests */}
                    <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Study Interests</h3>
                        {!isEditing ? (
                            <div className="flex flex-wrap gap-2">
                                {user?.profile?.interests.map((interest) => (
                                    <Badge key={interest}>{interest}</Badge>
                                ))}
                            </div>
                        ) : (
                            <Controller
                                name="interests"
                                control={control}
                                render={({ field }) => (
                                    <TagInput
                                        tags={field.value}
                                        suggestions={SKILLS}
                                        onChange={field.onChange}
                                        placeholder="Add study interests..."
                                        error={errors.interests?.message}
                                    />
                                )}
                            />
                        )}
                    </div>

                    {/* Skills */}
                    <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Skills</h3>
                        {!isEditing ? (
                            <div className="flex flex-wrap gap-2">
                                {user?.profile?.skills.map((skill) => (
                                    <Badge key={skill} variant="success">{skill}</Badge>
                                ))}
                            </div>
                        ) : (
                            <Controller
                                name="skills"
                                control={control}
                                render={({ field }) => (
                                    <TagInput
                                        tags={field.value}
                                        suggestions={INTERESTS}
                                        onChange={field.onChange}
                                        placeholder="Add skills..."
                                        error={errors.skills?.message}
                                    />
                                )}
                            />
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
