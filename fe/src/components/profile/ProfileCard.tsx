// ProfileCard component
import { User } from '@/lib/types';
import { formatRating } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import { Award, Star, Users } from 'lucide-react';

export interface ProfileCardProps {
    user: User;
    showStats?: boolean;
}

export default function ProfileCard({ user, showStats = true }: ProfileCardProps) {
    const getExperienceLevel = (helpCount: number = 0) => {
        if (helpCount < 10) return 'Beginner';
        if (helpCount < 20) return 'Intermediate';
        return 'Advanced';
    };

    return (
        <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-zinc-100 flex-shrink-0">
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-zinc-600">
                        {user.profile?.name.charAt(0)}
                    </div>
                </div>

                {/* User info */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-zinc-900">{user.profile?.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge size="sm">{getExperienceLevel(user.helperStats?.helpCount || 0)}</Badge>
                        {showStats && (
                            <>
                                <span className="flex items-center gap-1 text-sm text-zinc-600">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    {formatRating(user?.helperStats?.avgRating || 0)}
                                </span>
                                <span className="flex items-center gap-1 text-sm text-zinc-600">
                                    <Award className="w-4 h-4" />
                                    {user?.helperStats?.totalPoints} pts
                                </span>
                            </>
                        )}
                    </div>

                    {user?.profile?.bio && (
                        <p className="mt-2 text-sm text-zinc-600 line-clamp-2">{user.profile.bio}</p>
                    )}
                </div>
            </div>

            {/* Skills */}
            {user?.profile && user.profile?.skills && user.profile.skills.length > 0 && (
                <div className="mt-4 pt-4 border-t border-zinc-200">
                    <h4 className="text-sm font-medium text-zinc-700 mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                        {user.profile.skills.slice(0, 5).map((skill) => (
                            <Badge key={skill} size="sm">
                                {skill}
                            </Badge>
                        ))}
                        {user.profile.skills.length > 5 && (
                            <Badge size="sm" variant="info">
                                +{user.profile.skills.length - 5} more
                            </Badge>
                        )}
                    </div>
                </div>
            )}

            {/* Stats */}
            {/* {showStats && (
                <div className="mt-4 pt-4 border-t border-zinc-200 flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-zinc-600">
                        <Users className="w-4 h-4" />
                        <span>{user?.helperStats?.totalSessions} sessions</span>
                    </div>
                </div>
            )} */}
        </div>
    );
}
