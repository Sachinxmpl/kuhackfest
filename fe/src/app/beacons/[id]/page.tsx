'use client';

import { useState, use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { formatRelativeTime } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import CountdownTimer from '@/components/beacon/CountdownTimer';
import ApplicantList from '@/components/beacon/ApplicantList';
import ProfileCard from '@/components/profile/ProfileCard';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Beacon, BeaconStatus, BeaconType, User } from '@/lib/types';
import { API_BASE_URL } from '@/constants/constants';
import { useUser } from '@/contexts/UserContext';

interface BeaconDetailsPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function BeaconDetailsPage({ params }: BeaconDetailsPageProps) {
    const { id: beaconId } = use(params)
    const router = useRouter();
    const { user } = useUser();

    const [beacon, setBeacon] = useState<Beacon | null>(null);
    const [beaconFetchError, setBeaconFetchError] = useState<string | null>(null);

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    useEffect(() => {
        const getBeacon = async (id: string) => {
            try {
                const response = await fetch(`${API_BASE_URL}/beacons/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token as string,
                    },
                });

                const result = await response.json();

                if (!result.success) {
                    setBeaconFetchError(result.message || 'Failed to fetch beacon details.');
                    return;
                }

                const beacon = {
                    ...result.data,
                    createdAt: new Date(result.data.createdAt),
                    expiresAt: result.data.expiresAt ? new Date(result.data.expiresAt) : null,
                    applications: result.data.applications ? result.data.applications.map((app: any) => ({
                        ...app,
                        appliedAt: new Date(app.appliedAt),
                    })) : [],
                }

                setBeacon(beacon as Beacon);
            } catch (e) {
                setBeaconFetchError('An error occurred while fetching beacon details.');
                console.error(e);
            }
        }

        if (token) {
            getBeacon(beaconId);
        }
    }, [beaconId, token])

    const isOwner = beacon?.creatorId == user?.id;
    const isUrgent = beacon?.type === BeaconType.URGENT;

    const handleSelectHelper = async (applicationId: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/select`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token as string,
                },
                body: JSON.stringify({ applicationId }),
            });

            const result = await response.json();
            console.log("Select helper result:", result);

            if (!result.success) {
                // Handle error
                return;
            }

            const updatedBeacon = {
                ...beacon,
                status: BeaconStatus.IN_SESSION,
                session: result.data,
            } as Beacon;

            setBeacon(updatedBeacon);

            // Simulate starting session
            setTimeout(() => {
                router.push(`/sessions/${result.data.id}`);
            }, 1000);
        } catch (e) {
            console.error('An error occurred while selecting helper.', e);
        }
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
                        <Badge variant="info">{beacon?.status}</Badge>
                    </div>

                    <h1 className="text-3xl font-bold text-zinc-900 mb-4">
                        {beacon?.title}
                    </h1>

                    {
                        beaconFetchError ? (
                            <p className="text-red-600">{beaconFetchError}</p>
                        ) : !beacon ? (
                            <p>Loading beacon details...</p>
                        ) : null
                    }

                    <p className="text-zinc-600 mb-6 leading-relaxed">
                        {beacon?.description}
                    </p>

                    <div className="flex items-center justify-between pt-6 border-t border-zinc-200">
                        <div className="flex items-center gap-4 text-sm text-zinc-600">
                            <span>Posted {formatRelativeTime(new Date(beacon?.createdAt as Date))}</span>
                            {isUrgent && beacon.expiresAt && (
                                <>
                                    <span>•</span>
                                    <CountdownTimer targetDate={beacon.expiresAt} />
                                </>
                            )}
                        </div>

                        {!isOwner && beacon?.status === BeaconStatus.OPEN && (
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
                        <ProfileCard user={beacon?.creator as User} showStats={true} />
                    </div>
                )}

                {/* Applicants (only visible to beacon owner) */}
                {true && (
                    <div>
                        <ApplicantList
                            applications={beacon?.applications || []}
                            onSelectHelper={handleSelectHelper}
                            isOwner={isOwner}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
