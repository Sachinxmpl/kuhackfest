'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { mockBeacons, currentUser, mockApplications } from '@/lib/mock-data';
import { formatRelativeTime } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import CountdownTimer from '@/components/beacon/CountdownTimer';
import ApplicantList from '@/components/beacon/ApplicantList';
import ProfileCard from '@/components/profile/ProfileCard';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { BeaconStatus, BeaconType, User } from '@/lib/types';

interface BeaconDetailsPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function BeaconDetailsPage({ params }: BeaconDetailsPageProps) {
    const { id: beaconId } = use(params)
    const router = useRouter();

    const b = mockBeacons.find(b => b.id === beaconId) || mockBeacons[0];
    b.applications = mockApplications;

    const [beacon, setBeacon] = useState(b);

    const isOwner = beacon.creatorId === currentUser.id;
    const isUrgent = beacon.type === BeaconType.URGENT;

    const handleSelectHelper = (helperId: string) => {
        setBeacon({ ...beacon, status: BeaconStatus.IN_SESSION });
        // Simulate starting session
        setTimeout(() => {
            router.push('/session');
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-zinc-50">
            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Back button */}
                <Link href="/dashboard">
                    <Button variant="ghost" size="sm" className="mb-6">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Button>
                </Link>

                {/* Beacon details */}
                <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-sm mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        {/* <Badge variant={isUrgent ? 'warning' : 'default'}>
                            {beacon.title}
                        </Badge> */}
                        {isUrgent && (
                            <Badge variant="warning" className="gap-1">
                                <AlertCircle className="w-3 h-3" />
                                Urgent
                            </Badge>
                        )}
                        <Badge variant="info">{beacon.status}</Badge>
                    </div>

                    <h1 className="text-3xl font-bold text-zinc-900 mb-4">
                        {beacon.title}
                    </h1>

                    <p className="text-zinc-600 mb-6 leading-relaxed">
                        {beacon.description}
                    </p>

                    <div className="flex items-center justify-between pt-6 border-t border-zinc-200">
                        <div className="flex items-center gap-4 text-sm text-zinc-600">
                            <span>Posted {formatRelativeTime(beacon.createdAt)}</span>
                            {isUrgent && beacon.expiresAt && (
                                <>
                                    <span>•</span>
                                    <CountdownTimer targetDate={beacon.expiresAt} />
                                </>
                            )}
                        </div>

                        {!isOwner && beacon.status === BeaconStatus.OPEN && (
                            <Link href={`/beacons/${beacon.id}/apply`}>
                                <Button>Apply to Help</Button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Owner/Requester profile */}
                {!isOwner && (
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-zinc-900 mb-4">Requested by</h2>
                        <ProfileCard user={beacon.creator} showStats={true} />
                    </div>
                )}

                {/* Applicants (only visible to beacon owner) */}
                {true && (
                    <div>
                        <ApplicantList
                            applications={beacon.applications || []}
                            selectedHelperId={beacon.creatorId}
                            onSelectHelper={handleSelectHelper}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
