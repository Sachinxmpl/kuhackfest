// Enhanced Profile page with fixed UI and improved design
'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, type ProfileFormData } from '@/lib/validator';
import { INTERESTS, SKILLS } from '@/lib/mock-data';
import { API_BASE_URL } from '@/constants/constants';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import TagInput from '@/components/profile/TagInput';
import { Edit2, Save, X, Award, Star, BookOpen, Sparkles, User as UserIcon, Mail, TrendingUp } from 'lucide-react';
import { formatRating } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [_updateError, setUpdateError] = useState<string | null>(null);
    const [_updateSuccess, setUpdateSuccess] = useState(false);
    const { user, setUser } = useUser();

    const getExperienceLevel = (helpCount: number = 0) => {
        if (helpCount < 10) return { 
            level: 'Beginner', 
            color: 'bg-blue-50 text-blue-700 border-blue-200',
            nextTarget: 10
        };
        if (helpCount < 20) return { 
            level: 'Intermediate', 
            color: 'bg-purple-50 text-purple-700 border-purple-200',
            nextTarget: 20
        };
        return { 
            level: 'Pro', 
            color: 'bg-amber-50 text-amber-700 border-amber-200',
            nextTarget: 30
        };
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
            bio: user?.profile?.bio || "",
            interests: user?.profile?.interests || [],
            skills: user?.profile?.skills || [],
        },
    });

    // Update form when user data changes or when entering edit mode
    useEffect(() => {
        if (user && isEditing) {
            reset({
                name: user?.profile?.name || "User",
                bio: user?.profile?.bio || "",
                interests: user?.profile?.interests || [],
                skills: user?.profile?.skills || [],
            });
        }
    }, [user, isEditing, reset]);

    const onSubmit = async (data: ProfileFormData) => {
        setUpdateError(null);
        setUpdateSuccess(false);
        
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                setUpdateError('Authentication token not found. Please log in again.');
                return;
            }

            const response = await fetch(`${API_BASE_URL}/users/profile`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!result.success) {
                setUpdateError(result.error || 'Failed to update profile');
                return;
            }

            // Update the user context with the new profile data
            if (user) {
                setUser({
                    ...user,
                    profile: result.data,
                });
            }

            setIsEditing(false);
            setUpdateError(null);
            setUpdateSuccess(true);
            
            // Clear success message after 3 seconds
            setTimeout(() => setUpdateSuccess(false), 3000);
        } catch (error) {
            console.error('Failed to update profile:', error);
            setUpdateError('An unexpected error occurred. Please try again.');
        }
    };

    const handleCancel = () => {
        reset({
            name: user?.profile?.name || "User",
            bio: user?.profile?.bio || "",
            interests: user?.profile?.interests || [],
            skills: user?.profile?.skills || [],
        });
        setIsEditing(false);
        setUpdateError(null);
    };

    // Show loading state if user data hasn't loaded yet
    if (!user) {
        return (
            <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-3 border-zinc-300 border-t-zinc-900 mx-auto mb-4"></div>
                    <p className="text-zinc-600 font-medium">Loading profile...</p>
                </div>
            </div>
        );
    }

    const experienceData = getExperienceLevel(user?.helperStats?.helpCount || 0);
    const progressPercentage = Math.min(
        ((user?.helperStats?.helpCount || 0) / experienceData.nextTarget) * 100,
        100
    );

    return (
        <div className="min-h-screen bg-zinc-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

                {/* Banner Container */}
                <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden mb-6 shadow-sm">
                    {/* The colored background that the avatar overlaps */}
                    <div className=" sm:h-25 from-zinc-900 via-zinc-800 to-zinc-900 relative">
                        <div className="absolute inset-0 opacity-10">
                            {/* Optional pattern */}
                        </div>
                    </div>
                    
                    <div className="px-4 sm:px-6 pb-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 -mt-16 sm:-mt-20">
                            {/* Left: Avatar and Info */}
                            <div className="flex flex-col sm:flex-row items-start gap-4">
                                {/* Avatar */}
                                <div className="flex-shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-700 flex items-center justify-center text-white text-4xl sm:text-5xl font-bold border-4 border-white shadow-lg">
                                    {user?.profile?.name?.charAt(0).toUpperCase() || "U"}
                                </div>
                                
                                {/* Name and Email */}
                                <div className="flex-1 min-w-0 pt-0 sm:pt-12">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                                        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">
                                            {user?.profile?.name || "User"}
                                        </h1>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border w-fit ${experienceData.color}`}>
                                            {experienceData.level}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-zinc-600">
                                        <Mail className="w-4 h-4 flex-shrink-0" />
                                        <span className="text-sm">{user?.email}</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Right: Edit Button */}
                            <div className="flex gap-2 sm:pt-12">
                                {!isEditing ? (
                                    <button 
                                        onClick={() => setIsEditing(true)} 
                                        className="w-full sm:w-auto cursor-pointer flex items-center justify-center gap-2 px-4 py-2 border border-zinc-300 rounded-lg bg-white hover:bg-zinc-50 text-zinc-900 font-medium transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Edit Profile
                                    </button>
                                ) : (
                                    <>
                                        <button 
                                            onClick={handleSubmit(onSubmit)} 
                                            disabled={isSubmitting}
                                            className="flex-1 sm:flex-none cursor-pointer flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Save className="w-4 h-4" />
                                            {isSubmitting ? 'Saving...' : 'Save'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            disabled={isSubmitting}
                                            className="flex-1 sm:flex-none cursor-pointer flex items-center justify-center gap-2 px-4 py-2 border border-zinc-300 rounded-lg bg-white hover:bg-zinc-50 text-zinc-900 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <X className="w-4 h-4" />
                                            Cancel
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column - Stats */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center flex-shrink-0">
                                    <Award className="w-4 h-4 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-zinc-900">Statistics</h3>
                            </div>
                            
                            <div className="space-y-6">
                                {/* Average Rating */}
                                <div>
                                    <div className="text-xs text-zinc-500 mb-2 font-semibold uppercase tracking-wider">
                                        Average Rating
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-11 h-11 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                                            <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                                        </div>
                                        <span className="text-3xl font-bold text-zinc-900">
                                            {formatRating(user?.helperStats?.avgRating || 0)}
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t border-zinc-200"></div>

                                {/* Total Points */}
                                <div>
                                    <div className="text-xs text-zinc-500 mb-2 font-semibold uppercase tracking-wider">
                                        Total Points
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-11 h-11 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                                            <Award className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <span className="text-3xl font-bold text-zinc-900">
                                            {user?.helperStats?.totalPoints || 0}
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t border-zinc-200"></div>

                                {/* Students Helped */}
                                <div>
                                    <div className="text-xs text-zinc-500 mb-2 font-semibold uppercase tracking-wider">
                                        Students Helped
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-11 h-11 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                                            <UserIcon className="w-5 h-5 text-green-600" />
                                        </div>
                                        <span className="text-3xl font-bold text-zinc-900">
                                            {user?.helperStats?.helpCount || 0}
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t border-zinc-200"></div>

                                {/* Progress Bar */}
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <TrendingUp className="w-3.5 h-3.5 text-zinc-500" />
                                        <div className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">
                                            Progress
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-zinc-600">Next level</span>
                                            <span className="font-semibold text-zinc-900">
                                                {user?.helperStats?.helpCount || 0} / {experienceData.nextTarget}
                                            </span>
                                        </div>
                                        <div className="w-full bg-zinc-100 rounded-full h-2.5 overflow-hidden">
                                            <div 
                                                className="bg-gradient-to-r from-zinc-900 to-zinc-700 h-full rounded-full transition-all duration-500 ease-out"
                                                style={{ width: `${progressPercentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Profile Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* About Me Card */}
                        <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center flex-shrink-0">
                                    <UserIcon className="w-4 h-4 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-zinc-900">About Me</h3>
                            </div>
                            
                            {!isEditing ? (
                                <div>
                                    {user?.profile?.bio ? (
                                        <p className="text-zinc-700 leading-relaxed whitespace-pre-wrap">{user.profile.bio}</p>
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-3">
                                                <UserIcon className="w-8 h-8 text-zinc-400" />
                                            </div>
                                            <p className="text-zinc-500 mb-3">No bio added yet</p>
                                            <button 
                                                onClick={() => setIsEditing(true)}
                                                className="text-sm text-zinc-900 hover:text-zinc-700 font-medium underline underline-offset-2 cursor-pointer"
                                            >
                                                Add a bio
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <Input
                                        label="Name"
                                        placeholder="Enter your name"
                                        error={errors.name?.message}
                                        {...register('name')}
                                    />

                                    <Textarea
                                        label="Bio"
                                        rows={6}
                                        placeholder="Tell others about yourself, your interests, and what you're passionate about..."
                                        error={errors.bio?.message}
                                        {...register('bio')}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Study Interests Card */}
                        <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                    <BookOpen className="w-4 h-4 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-bold text-zinc-900">Study Interests</h3>
                            </div>
                            
                            {!isEditing ? (
                                <div>
                                    {user?.profile?.interests && user.profile.interests.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {user.profile.interests.map((interest) => (
                                                <span 
                                                    key={interest}
                                                    className="inline-flex items-center px-4 py-2 bg-zinc-50 text-zinc-900 rounded-lg text-sm font-medium border border-zinc-200 hover:bg-zinc-100 transition-colors"
                                                >
                                                    {interest}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3">
                                                <BookOpen className="w-8 h-8 text-blue-400" />
                                            </div>
                                            <p className="text-zinc-500 mb-3">No interests added yet</p>
                                            <button 
                                                onClick={() => setIsEditing(true)}
                                                className="text-sm text-zinc-900 hover:text-zinc-700 font-medium underline underline-offset-2 cursor-pointer"
                                            >
                                                Add interests
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Controller
                                    name="interests"
                                    control={control}
                                    render={({ field }) => (
                                        <TagInput
                                            tags={field.value || []}
                                            suggestions={INTERESTS}
                                            onChange={field.onChange}
                                            placeholder="Add study interests (e.g., Mathematics, Physics)..."
                                            error={errors.interests?.message}
                                        />
                                    )}
                                />
                            )}
                        </div>

                        {/* Skills Card */}
                        <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                                    <Sparkles className="w-4 h-4 text-purple-600" />
                                </div>
                                <h3 className="text-lg font-bold text-zinc-900">Skills & Expertise</h3>
                            </div>
                            
                            {!isEditing ? (
                                <div>
                                    {user?.profile?.skills && user.profile.skills.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {user.profile.skills.map((skill) => (
                                                <span 
                                                    key={skill}
                                                    className="inline-flex items-center px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center mx-auto mb-3">
                                                <Sparkles className="w-8 h-8 text-purple-400" />
                                            </div>
                                            <p className="text-zinc-500 mb-3">No skills added yet</p>
                                            <button 
                                                onClick={() => setIsEditing(true)}
                                                className="text-sm text-zinc-900 hover:text-zinc-700 font-medium underline underline-offset-2 cursor-pointer"
                                            >
                                                Add skills
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Controller
                                    name="skills"
                                    control={control}
                                    render={({ field }) => (
                                        <TagInput
                                            tags={field.value || []}
                                            suggestions={SKILLS}
                                            onChange={field.onChange}
                                            placeholder="Add skills (e.g., Problem Solving, Teaching)..."
                                            error={errors.skills?.message}
                                        />
                                    )}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}