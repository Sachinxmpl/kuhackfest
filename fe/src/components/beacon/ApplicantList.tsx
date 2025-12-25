'use client';

import { BeaconApplication, User } from '@/lib/types';
import ProfileCard from '@/components/profile/ProfileCard';
import Button from '@/components/ui/Button';
import Badge from '../ui/Badge';
import { formatRelativeTime } from '@/lib/utils';
import { Clock } from 'lucide-react';

export interface ApplicantListProps {
    applications: BeaconApplication[];
    selectedHelperId?: string;
    onSelectHelper: (helperId: string) => void;
    isOwner: boolean;
    matchesScore: { helperId: string; similarityScore: number; helperName?: string }[];
}

export default function ApplicantList({
    applications,
    selectedHelperId: _,
    onSelectHelper,
    isOwner,
    matchesScore,
}: ApplicantListProps) {

    const getBadgeVariant = (score: number) => {
        if (score >= 80) return 'success';
        if (score >= 50) return 'info';
        if (score >= 30) return 'warning';
        return 'danger';
    };

    if (applications.length === 0) {
        return (
            <div className="text-center py-12 bg-zinc-50 rounded-lg border border-zinc-200">
                <Clock className="w-12 h-12 mx-auto text-zinc-300 mb-3" />
                <h3 className="text-lg font-medium text-zinc-900 mb-2">
                    No applicants yet
                </h3>
                <p className="text-zinc-600">
                    Waiting for helpers to apply to your beacon
                </p>
            </div>
        );
    }

    // Sort by similarity score and helper stats
    const sortedApplications = [...applications]
        .map(app => {
            const match = matchesScore.find(m => m.helperId === app.helperId);

            const similarityScore = match?.similarityScore ?? 0;
            const helperStats = app.helper?.helperStats;

            const weightedScore =
                (helperStats?.totalPoints ?? 0) +
                (helperStats?.avgRating ?? 0) * 100;

            return {
                ...app,
                similarityScore,
                weightedScore,
            };
        })
        .sort((a, b) => {
            if (b.similarityScore !== a.similarityScore) {
                return b.similarityScore - a.similarityScore;
            }
            return b.weightedScore - a.weightedScore;
        });

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-zinc-900 mb-4">
                    Applications ({applications.length})
                </h3>
                <p className="text-sm text-zinc-600">
                    Sorted by similarity score and helper stats
                </p>
            </div>

            {sortedApplications.map((application) => (
                <div
                    key={application.id}
                    className="bg-white border border-zinc-200 rounded-lg p-5 space-y-4 relative"
                >
                    {/* Similarity Score Badge */}
                    {application.similarityScore !== undefined && (
                        <div className="absolute top-6 right-6">
                            <Badge
                                variant={getBadgeVariant(application.similarityScore)}
                                size="sm"
                            >
                                Match score: {(application.similarityScore * 100).toFixed(1)}%
                            </Badge>
                        </div>
                    )}

                    {/* Helper Profile Card */}
                    <ProfileCard user={application.helper as User} showStats={true} />

                    {/* Application message */}
                    <div>
                        <h4 className="text-sm font-medium text-zinc-700 mb-2">Message</h4>
                        <p className="text-sm text-zinc-600 bg-zinc-50 rounded-lg p-3">
                            {application.message}
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-zinc-200">
                        <span className="text-sm text-zinc-500">
                            Applied {formatRelativeTime(application.appliedAt)}
                        </span>

                        {isOwner && (
                            <Button
                                size="sm"
                                onClick={() => onSelectHelper(application.id)}
                            >
                                Select Helper
                            </Button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
